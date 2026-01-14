// ui paefi domain orchestrator //

import { Render }                             from '../core/renderer.js';
import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade,
         Dominio, Modulo 
       } from '../core/omEnum.js';

import { DomainInfo }                    from '../core/omData.js';
import { DomainView }                    from './domainView.js';
import { ApiGate }                       from './appGate.js';
import { ModalShell, ModalFormBuilder, ModalMessageBuilder }  from '../core/omModal.js';

export class Orchestrator {
  
    constructor()   {
        this.gate       = null;
        this.info       = null;
        this.render     = null;  
        this.modal      = new ModalShell(); 
    }

    async init(moduleKey, domainKey) {
        this.info = DomainInfo.Create(domainKey);

        this.modalRequested = this.modalRequested.bind(this);
        this.render         = await DomainView.Create(moduleKey, this.info, this.modalRequested); 

        this.gate = new ApiGate(this.info, (x) => this.render.Rows(x), () => this.filters());
        await this.gate.Read();

        this.wireAdminEvents();
    }

    static async Create(moduleKey, domainKey) {
        const instance = new Orchestrator();
        await instance.init(moduleKey, domainKey);
        return instance;
    }  
      
    filters() {
        //const campos = this.info.Catalog.Bindings.filter(x => x.Lookup || x.LookupId);
        const campos = this.info.Catalog.Bindings.filter(x => (x.Lookup || x.LookupId) && x.UiFilterKey);
        const filtro = campos.reduce((acc, binding) => {
            acc[binding.DtoId] = $(binding.UiFilterKey).val() || null;
            return acc;
        }, {});
        console.log(filtro);
        return filtro;
    }

    modalRequested(mode, data, id = null) {
        if (mode === 'create') {
            this.gate.Create(data);
        } 
        if (mode === 'update') {
            this.gate.Update(id, data);
        } 
    }

    wireAdminEvents() {
        // filters
        $(document).on('change', '.filters-bar select', async () => {
           await this.gate.Read(this.filters());
        });

        $('#btnClearFilter').on('click', async () => {
            $('.filters-bar select').val('');
            await this.gate.Clear();
        });

        $('#navControls').on('click', 'a.page-link', async e => {
            const page = $(e.currentTarget).data('page');
            await this.gate.ReadPage(e, page);
        });

        // modals
        //$(document).on('click', '#btnAddNew', () => { this.render.addModal.open() });

        $('#btnAddNew').on('click', async () => {
            const builder = new ModalFormBuilder({ 
                title   : `Novo ${this.info.Name}`,
                catalog : this.info.Catalog,
                dto     : null
            });

            const result = await this.modal.open(builder);
            if (result.action !== 'save')           return;

            await this.gate.Create(result.payload);
        });

        $(document).on('click', '.js-edit', async e => {
            const id      = $(e.currentTarget).data('id');
            const dto     = await this.info.API.GetById(id);
            const builder = new ModalFormBuilder({
                title   : `Editar ${this.info.Name}`,
                catalog : this.info.Catalog,
                dto
            });

            const result = await this.modal.open(builder);
            if (result.action !== 'save')           return;
            if (!Object.keys(result.dirty).length)  return;

            await this.gate.Update(id, result.payload);
        });

        $(document).on('click', '.js-delete', async e => {
            const builder = new ModalMessageBuilder({
                title   : 'Confirmação',
                message : 'Deseja realmente excluir este registro?'
            });

            const result = await this.modal.open(builder);
            if (result.action === 'confirm' && result.value) {
                await this.gate.Delete(id);
            }
        });

    }
}