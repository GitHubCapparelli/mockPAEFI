import { Render }                             from '../core/renderer.js';
import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import {
  FuncaoUsuario, CargoUsuario, Especialidade,
  Dominio, Modulo
} from '../core/omEnum.js';
import { DomainInfo } from '../core/omData.js';

export class ApiGate {
    constructor(info, fnRows) {
        this.query      = new QueryEngine(info.API, fnRows);
        this.command    = new CommandEngine(info.API, () => this.query.loadData(this.getFilters()));
    }

    async Create(data) {  
        this.command.Create(data);
    }

    async Read(filters = null) {
        await this.query.GetPaginated(filters);
    }

    async ReadPage(e, page) {
        await this.query.Navigate(e, page);
    }

    async Update(id, data) {
        await this.command.Update(id, data);
    }

    async Delete(id, data = null) {
        if (data) {
            await this.command.SoftDelete(id, data);
        }
        else {
            await this.command.Delete(id);
        }
    }

    async Load() {
        await this.query.loadData();
    }
}

class DomainView {

    constructor(info, namedLists, fnOnModalSubmited) {
        this.metadata = metadata;
        this.lookups  = namedLists;

        this.addModal   = new Modal('add-modal',  `Novo ${info.Name}`,      fnOnModalSubmited);
        this.editModal  = new Modal('edit-modal', `Editando ${info.Name}`,  fnOnModalSubmited);
        this.view(moduleKey);
    }
    static async Create(info) {
        const lookupAPIs = info.Lookups;
        const apiTasks   = Object.entries(lookupAPIs).map(async ([key, api]) => {
            const data = await api.GetAll(); 
            return [key, data];
        });
        const response   = await Promise.all(apiTasks);
        const namedLists = Object.fromEntries(response);
        return new DomainView(info, namedLists);
    }  
    
    Filters() {
        const $container = $('#divFilterOptions').empty();

        if (this.metadata.key === DomainInfo.UsuariosServidores.Key) {
            $container.append(
            Render.Select('cmbFilterUnidade', 'Todas as Unidades'),
            Render.Select('cmbFilterEspecialidade', 'Todas as Especialidades'),
            Render.Select('cmbFilterFuncao', 'Todas as Funções'),
            Render.Select('cmbFilterCargo', 'Todos os Cargos')
            );
        }
        // Unidades...
        this.FiltersItems();
    }

    FiltersItems() {
        const $el  = $('#cmbFilterUnidade');
        this.lookups.unidades.forEach(u => $el.append($('<option>', { value: u.id, text: u.sigla })));

        Render.Enum('#cmbFilterEspecialidade', Especialidade);
        Render.Enum('#cmbFilterFuncao', FuncaoUsuario);
        Render.Enum('#cmbFilterCargo', CargoUsuario);
    }

    Rows(response) {
        const list  = response.data;
        const tbody = $('#dataRows').empty();

        if (!list.length) {
        tbody.append(`<tr><td colspan="${columns.length}">Nenhum registro</td></tr>`);
        return;
        }

        list.forEach(u => {
        tbody.append(`<tr>
            <td class="ellipsis25" title="${u.nome}">${u.nome}</td>
            <td>${this.lookups.unidades?.find(un => un.id === u.unidadeID)?.sigla ?? ''}</td>
            <td>${u.especialidade === Especialidade.NaoInformada.Key ? '' : Especialidade.ValueFromKey(u.especialidade)}</td>
            <td>${u.funcao === FuncaoUsuario.NaoInformada.Key ? '' : FuncaoUsuario.ValueFromKey(u.funcao)}</td>
            <td>${u.cargo === CargoUsuario.NaoInformado.Key ? '' : CargoUsuario.ValueFromKey(u.cargo)}</td>
            <td>
                <button class="btn btn-sm btn-primary js-edit" data-id="${u.id}" title="Editar">
                <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger js-delete" data-id="${u.id}" title="Deletar">
                <i class="fas fa-trash"></i>
                </button>
            </td>
            </tr>
        `);
        });

        Render.Info(response.pagination);
    }
}

export class Orchestrator {
  
  constructor(moduleKey, info)   {
    this.moduleKey  = moduleKey;
    this.info       = info;

    this.render     = DomainView.Create(info); 
    this.addModal   = new Modal('add-modal',  `Novo ${info.Name}`,      () => this.modalRequested('create'));
    this.editModal  = new Modal('edit-modal', `Editando ${info.Name}`,  () => this.modalRequested('update',));
    this.view(moduleKey);

    this.api        = new ApiGate(info, (x) => this.render.Rows(x));

    this.wireAdminEvents();
  }
  static async Create(moduleKey, domainKey) {
    const info = DomainInfo.Create(domainKey);
    return new Orchestrator(moduleKey, info);
  }  
  async view(moduleKey) {
    if (moduleKey === Modulo.Admin.Key) {
      await this.viewAdmin();
    }
  }

  //
    
    filters() {
        if (this.info.Key === DomainInfo.Unidades.Key) {
            return {
                funcao         : $('#cmbFilterFuncao').val() || null
            };
        }
        if (this.info.Key === DomainInfo.UsuariosServidores.Key) {
            return {
                unidadeID      : $('#cmbFilterUnidade').val() || null,
                especialidade  : $('#cmbFilterEspecialidade').val() || null,
                funcao         : $('#cmbFilterFuncao').val() || null,
                cargo          : $('#cmbFilterCargo').val() || null
            };
        }
        return null;
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
      await this.gate.Read(filters());
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
      this.addModal.open()
    });
  }

  async viewAdmin() {
    Render.Table(columns);
    this.render.Filters();

    await this.gate.Load();
  }
}

