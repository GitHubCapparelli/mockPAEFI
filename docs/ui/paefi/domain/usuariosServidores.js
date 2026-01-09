//ui.paefi.domain.usuariosServidores

import { Render }                             from '../core/renderer.js';
import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import {
  FuncaoUsuario, CargoUsuario, Especialidade,
  Dominio, Modulo
} from '../core/omEnum.js';

const columns = [
  { label: 'Nome', field: 'nome' },
  { label: 'Unidade', field: 'unidade' },
  { label: 'Especialidade', field: 'especialidade' },
  { label: 'Função', field: 'funcao' },
  { label: 'Cargo', field: 'cargo' },
  { label: 'Ações', field: 'acoes' }
];

// class BaseOrchestrator(api, lookups, modulo)

// instance //
export class UsuariosServidoresDomain {
  constructor(modulo, lookups, api)   {
    this.modulo     = modulo;
    this.render     = new Renderer(lookups);
    this.query      = new QueryEngine(api,   (x) => this.render.Rows(x));
    this.command    = new CommandEngine(api, () => this.query.loadData(this.getFilters()));
    this.addModal   = new Modal('add-modal',  'Novo Usuário Servidor',      () => this.modalRequested('create'));
    this.editModal  = new Modal('edit-modal', 'Editando Usuário Servidor',  () => this.modalRequested('update',));

    this.init();
  }
  async  init() {
    if (modulo.Key === Modulo.Admin.Key) {
      await instance.viewAdmin();
    }
  }
  static async Create(modulo) {
    await Promise.all([
      UnidadesAPI.Init(),
      UsuariosServidoresAPI.Init()
    ]);
    const lookups = { unidades: UnidadesAPI.GetAll() };
    return new UsuariosServidoresDomain(modulo, lookups, UsuariosServidoresAPI);
  }  

  modalRequested(mode, data, id = null) {
    if (mode === 'create') {
      this.command.Create(data);
    } 
    if (mode === 'update') {
      this.command.Update(id, data);
    } 
  }

  wireAdminEvents() {
    $(document).on('change', '.filters-bar select', async () => {
      const filters = this.getFilters();
      this.query.Apply(filters);
    });

    $(document).on('click', '#btnAddNew', () => {
      this.addModal.open()
    });

    $('#btnClearFilter').on('click', async () => {
      $('.filters-bar select').val('');
      this.query.Clear();
    });

    $('#navControls').on('click', 'a.page-link', async e => {
      const page = $(e.currentTarget).data('page');
      await this.query.Navigate(e, page);
    });
  }


  async viewAdmin() {
    Render.Table(columns);

    this.render.Filters();
    await this.query.loadData();

    this.wireAdminEvents();
  }

  getFilters() {
    return {
      unidadeID      : $('#cmbFilterUnidade').val() || null,
      especialidade  : $('#cmbFilterEspecialidade').val() || null,
      funcao         : $('#cmbFilterFuncao').val() || null,
      cargo          : $('#cmbFilterCargo').val() || null
    };
  }
}

class Renderer {
  constructor(lookups) {
    this.lookups = lookups;
  }

  Filters() {
    const $container = $('#divFilterOptions').empty();

    $container.append(
      Render.Select('cmbFilterUnidade', 'Todas as Unidades'),
      Render.Select('cmbFilterEspecialidade', 'Todas as Especialidades'),
      Render.Select('cmbFilterFuncao', 'Todas as Funções'),
      Render.Select('cmbFilterCargo', 'Todos os Cargos')
    );
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