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
    static NS = '.orch-domain';
  
    constructor()   {
        this.gate       = null;
        this.info       = null;
        this.render     = null;  
        this.modal      = null; 
    }

    async init(moduleKey, domainKey) {
        this.info = DomainInfo.Create(domainKey);

        this.modalRequested = this.modalRequested.bind(this);
        this.render         = await DomainView.Create(moduleKey, this.info, this.modalRequested); 

        this.gate = new ApiGate(this.info, (x) => this.render.Rows(x), () => this.filters());
        await this.gate.Read();

        this.modal = new ModalShell(); 
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
        $(document).off(Orchestrator.NS);
        $('#btnAddNew').off(Orchestrator.NS);
        $('#btnClearFilter').off(Orchestrator.NS);
        $('#navControls').off(Orchestrator.NS);

        // filters
        $(document).on(`change${Orchestrator.NS}`, '.filters-bar select', async () => {
           await this.gate.Read(this.filters());
        });

        $('#btnClearFilter').on(`click${Orchestrator.NS}`, async () => {
            $('.filters-bar select').val('');
            await this.gate.Clear();
        });

        $('#navControls').on(`click${Orchestrator.NS}`, 'a.page-link', async e => {
            const page = $(e.currentTarget).data('page');
            await this.gate.ReadPage(e, page);
        });

        // modals
        $('#btnAddNew').on(`click${Orchestrator.NS}`,           async e => await this.onCreate_clicked(e));
        $(document).on(`click${Orchestrator.NS}`, '.js-edit',   async e => await this.onUpdate_clicked(e));
        $(document).on(`click${Orchestrator.NS}`, '.js-delete', async e => await this.onDelete_clicked(e));
    }

//    wireAdminEvents() {
//        $(document).on('change', '.filters-bar select', async () => {
//            await this.gate.Read(this.filters());
//        });
//
//        $('#btnClearFilter').on('click', async () => {
//            $('.filters-bar select').val('');
//            await this.gate.Clear();
//        });
//
//        $('#navControls').on('click', 'a.page-link', async e => {
//            const page = $(e.currentTarget).data('page');
//            await this.gate.ReadPage(e, page);
//        });
//
//        // modals
//        $('#btnAddNew').on('click', async e => await this.onCreate_clicked(e));
//        $(document).on('click', '.js-edit', async e => await this.onUpdate_clicked(e));
//        $(document).on('click', '.js-delete', async e => await this.onDelete_clicked(e));
//    }

    async onCreate_clicked(e) {
        e.preventDefault();
        const builder = new ModalFormBuilder({
            title: `Incluindo ${this.info.Name}`,
            catalog: this.info.Catalog,
            lookups: this.render.lookups,
            dto: null
        });

        const result = await this.modal.open(builder);
        if (result.action !== 'save') return;

        await this.gate.Create(result.payload);
    }

    async onUpdate_clicked(e) {
        e.preventDefault();
        const id = $(e.currentTarget).data('id');
        const dto = await this.info.API.GetById(id);
        const builder = new ModalFormBuilder({
            title: `Editando ${this.info.Name}`,
            catalog: this.info.Catalog,
            lookups: this.render.lookups,
            dto
        });

        const result = await this.modal.open(builder);
        if (result.action !== 'save') return;
        if (!Object.keys(result.dirty).length) return;

        await this.gate.Update(id, result.payload);
    }

    async onDelete_clicked(e) {
        e.preventDefault();
        const id = $(e.currentTarget).data('id');

        const dto = await this.info.API.GetById(id);
        const title = dto.nome 
                    ? dto.nome
                    : dto.sigla
                    ? dto.sigla
                    : 'Confirmação';

        const builder = new ModalMessageBuilder({
            title: title,
            message: 'Deseja realmente excluir este registro ?'
        });

        const result = await this.modal.open(builder);
        if (result.action !== 'confirm') return;

        await this.gate.Delete(id, dto);
    }
}