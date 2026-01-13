// ui paefi domain orchestrator //

import { Render }                             from '../core/renderer.js';
import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade,
         Dominio, Modulo 
       } from '../core/omEnum.js';
import { DomainInfo } from '../core/omData.js';
import { DomainView } from './domainView.js';
import { ApiGate }    from './appGate.js';


export class Orchestrator {
  
    constructor()   {
        this.gate       = null;
        this.info       = null;
        this.render     = null;  
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
        const campos = this.info.Catalog.Bindings.filter(x => x.Lookup || x.LookupId);
        const filtro = campos.reduce((acc, binding) => {
            acc[binding.DtoId] = $(binding.UiFilterKey).val() || null;
            return acc;
        }, {});
        console.log(filtro);
        return filtro;
//              
//       if (this.info.Key === DomainInfo.Unidades.Key) {
//           return {
//               funcao         : $('#cmbFilterFuncao').val() || null
//           };
//       }
//       if (this.info.Key === DomainInfo.UsuariosServidores.Key) {
//           return {
//               unidadeID      : $('#cmbFilterUnidade').val() || null,
//               especialidade  : $('#cmbFilterEspecialidade').val() || null,
//               funcao         : $('#cmbFilterFuncao').val() || null,
//               cargo          : $('#cmbFilterCargo').val() || null
//           };
//        }
//        return null;

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
        $(document).on('click', '#btnAddNew', () => {
           this.render.addModal.open()
        });
    }
}