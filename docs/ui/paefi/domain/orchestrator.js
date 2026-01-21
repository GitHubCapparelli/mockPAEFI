// ui paefi domain orchestrator //

import { DomainInfo }                                from '../core/omData.js';
import { DomainView }                                from './domainView.js';
import { ApiGate }                                   from './appGate.js';
import { ModalShell, ModalFormBuilder, ModalMessageBuilder, ModalJustificativaBuilder }  from '../core/omModal.js';

export class Orchestrator {
    static NS = '.orch-domain';
  
    constructor()   {
        this.gate       = null;
        this.info       = null;
        this.render     = null;  
        this.modal      = null;
    }

    async init(moduleKey, domainKey) {
        this.info           = DomainInfo.Find(domainKey);
        this.render         = await DomainView.Create(moduleKey, this.info); 
        this.gate           = new ApiGate(this.info, (x) => this.render.Rows(x), () => this.filters());
        this.modal          = new ModalShell(); 

        this.modalRequested = this.modalRequested.bind(this);

        await this.gate.Read();
        this.wireAdminEvents();
    }

    static async CreateInstance(moduleKey, domainKey) {
        const instance = new Orchestrator();
        await instance.init(moduleKey, domainKey);
        return instance;
    }  
      
    filters() {
        const campos = this.info.Bindings.filter(x => (x.Lookup || x.LookupId) && x.UiFilterKey);
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

    async onCreate_clicked(e) {
        e.preventDefault();
        const builder   = ModalFormBuilder.Create('Incluindo', this.info, this.render.lookups);
        const result    = await this.modal.open(builder);
        
        if (result.action === 'proceed') {
            const response = await this.gate.Create(result.payload);
            await this.#messageOnError(response, 'ERRO ao incluir novos dados');
        }
    }

    async onUpdate_clicked(e) {
        e.preventDefault();
        const id        = $(e.currentTarget).data('id');
        const dto       = await this.info.API.GetById(id);

        const builder   = ModalFormBuilder.Create('Editando', this.info, this.render.lookups, dto);
        const result    = await this.modal.open(builder);
        if (!Object.keys(result.dirty).length) return;

        if (result.action === 'proceed') {
            const justificativa = await this.#assureJustificativa('update', result, dto);
            const response      = await this.gate.Update(id, request.payload, justificativa);
            await this.#messageOnError(response, 'ERRO ao atualizar dados');
        }
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

        const builder = ModalMessageBuilder.Create(title, 'Deseja realmente excluir este registro ?');
        const result  = await this.modal.open(builder);
        
        if (result.action === 'proceed') {
            const response = await this.gate.Delete(id, dto);
            await this.#messageOnError(response, 'ERRO ao excluir registro');
        }
    }

    async #assureJustificativa(acao, result, dto = null) {
        if (acao === 'update') {
            let fields = this.#getSensitiveFields(result.dirty);
            if (fields.length > 0) {
                const title   = `Editando dados de ${dto.nome}`;
                const builder = ModalJustificativaBuilder.Create(title, fields);
                const result  = await this.modal.open(builder);

                if (result.action === 'proceed' && result.justificativa) {
                    return result.justificativa
                }
            }
        }
        return null;
    }

    /// AQUI.... !!!
    #getSensitiveFields(instance) {
        let fields = [];
        Object.entries(instance).forEach(entry => {
            const binding = this.info.Bindings.find(x => x.DtoId === entry[0]);
            const field   = this.info.Catalog.FieldByName(binding.DbKey); // Bindings.find(x => x.DtoId === entry[0]);
            if (field.IsSensitive) {
                fields.push(binding.UiFieldTitle);
            }
        });
        return fields;
    }

    async #messageOnError(response, title) {
        if (response?.error) {
            const builder = ModalMessageBuilder.Create(title, response.error);
            await this.modal.open(builder);
        }
   }
}