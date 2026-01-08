//ui.paefi.domain.unidades

import { Render }                     from '../core/renderer.js';
import { QueryEngine, CommandEngine } from '../core/omClass.js';
import { UnidadesAPI }                from '../../../services/api/unidadesAPI.js';
import { FuncaoUnidade, Modulo}       from '../core/omEnum.js';

const columns = [
  { label: 'Função', field: 'funcao' },
  { label: 'Sigla', field: 'sigla' },
  { label: 'Nome', field: 'nome' },
  { label: 'IBGE Id', field: 'IbgeId' },
  { label: 'Ações', field: 'acoes' }
];

export class UnidadesDomain {

  constructor(modulo, api) {
    this.modulo   = modulo;
    this.render   = new Renderer();
    this.query    = new QueryEngine(api, (x) => this.render.Rows(x));
    this.command  = new CommandEngine(api, (x) => this.render.Rows(x));
  }

  static async Create(modulo) {
    await UnidadesAPI.Init();
    const instance = new UnidadesDomain(modulo, UnidadesAPI);

    if (modulo.Key === Modulo.Admin.Key) {
      await instance.viewAdmin();
    }
    return instance;
  }  

  async viewAdmin() {
    Render.Table(columns);

    this.render.Filters();
    await this.query.loadData();

    this.wireAdminEvents();
  }

  getFilters() {
    return {
      funcao: $('#cmbFilterFuncao').val() || null
    };
  }

  wireAdminEvents() {
    $(document).on('change', '.filters-bar select', async () => {
      const filters = this.getFilters();
      this.query.Apply(filters);
    });

    $('#btnClearFilter').on('click', async () => {
      $('.filters-bar select').val('');
      this.query.Clear();
    });

    $('#navControls').on('click', 'a.page-link', async e => {
      this.query.Navigate(e, $(this).data('page'));
    });
  }
}

class Renderer {
  Filters() {
    const $container = $('#divFilterOptions').empty();
    $container.append(
      Render.Select('cmbFilterFuncao', 'Todas as Funções')
    );
    this.FiltersItems();
  }

  FiltersItems() {
    Render.Enum('#cmbFilterFuncao', FuncaoUnidade);
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
          <td>${u.funcao === FuncaoUnidade.NaoInformada.Key ? '' : FuncaoUnidade.ValueFromKey(u.funcao)}</td>
          <td>${u.sigla}</td>
          <td>${u.nome}</td>
          <td>${u.IbgeId}</td>
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