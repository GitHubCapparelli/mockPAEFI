// ui/paefi/gateway/usuariosServidoresGateway.js

import { DomainGateway }                              from './domainGateway.js';
import { UsuariosServidoresAPI }                      from '../../../services/api/usuariosServidoresAPI.js';
import { UnidadesAPI }                                from '../../../services/api/unidadesAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../../objModel.js';
import { CoreAdmin } from './coreAdmin.js';

const columns = [
  { label: 'Nome', field: 'nome' },
  { label: 'Unidade', field: 'unidade' },
  { label: 'Especialidade', field: 'especialidade' },
  { label: 'Função', field: 'funcao' },
  { label: 'Cargo', field: 'cargo' },
  { label: 'Ações', field: 'acoes' }
];

export class UsuariosServidoresGateway extends DomainGateway {
  constructor() {
    super({
      api: UsuariosServidoresAPI,
      lookups: {
        unidades: UnidadesAPI
      }
    });

    this.unidades = [];
  }

  async activate() {
    await this.api.Init();                 
    await this.loadLookups();
    
    this.renderFilters();
    this.hydrateFilters();
    this.renderPagination();

    CoreAdmin.BuildTable(columns);
    this.wireEvents();
    await this.load();
  }

  async loadLookups() {
    await this.lookups.unidades.Init();    
    this.unidades = this.lookups.unidades.GetAll();
  }


//  async load() {
//    const response = await this.api.GetPaginated({
//      page: this.state.page,
//      pageSize: this.state.pageSize,
//      filters: this.state.filters
//    });

//    this.state.lastData = response;
//    this.render(response.data);
//  }

  async load() {
    const result = await this.query.execute();

    CoreAdmin.RenderRows(result.data);
    this.updatePaginationInfo(result.pagination);
  }


  renderFilters() {
    const $container = $('#divFilterOptions').empty();

    $container.append(`
      <select id="cmbFilterUnidade" class="form-select form-select-sm">
        <option value="">Todas as Unidades</option>
      </select>

      <select id="cmbFilterEspecialidade" class="form-select form-select-sm">
        <option value="">Todas as Especialidades</option>
      </select>

      <select id="cmbFilterFuncao" class="form-select form-select-sm">
        <option value="">Todas as Funções</option>
      </select>

      <select id="cmbFilterCargo" class="form-select form-select-sm">
        <option value="">Todos os Cargos</option>
      </select>
    `);
  }

  hydrateFilters() {
    const $u = $('#cmbFilterUnidade');
    this.unidades.forEach(u =>
      $u.append(`<option value="${u.id}">${u.sigla}</option>`)
    );

    Especialidade.All.forEach(e =>
      $('#cmbFilterEspecialidade').append(`<option value="${e.Key}">${e.Value}</option>`)
    );

    FuncaoUsuario.All.forEach(e =>
      $('#cmbFilterFuncao').append(`<option value="${e.Key}">${e.Value}</option>`)
    );

    CargoUsuario.All.forEach(e =>
      $('#cmbFilterCargo').append(`<option value="${e.Key}">${e.Value}</option>`)
    );
  }

  render(list) {
    const $tbody = $('#dataRows').empty();

    if (!list || !list.length) {
      $tbody.append(
        '<tr><td colspan="6" class="text-center text-muted">Nenhum registro</td></tr>'
      );
      return;
    }

    list.forEach(u => {
      const unidade = this.unidades.find(x => x.id === u.unidadeID);

      $tbody.append(`
        <tr>
          <td>${u.nome}</td>
          <td>${unidade?.sigla || ''}</td>
          <td>${Especialidade.ValueFromKey(u.especialidade) || ''}</td>
          <td>${FuncaoUsuario.ValueFromKey(u.funcao) || ''}</td>
          <td>${CargoUsuario.ValueFromKey(u.cargo) || ''}</td>
          <td>
            <button class="btn btn-sm btn-primary js-edit" data-id="${u.id}">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      `);
    });
  }

  renderPagination() {
    const $container = $('#divPagination').empty();

    $container.append(`
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item">
            <a class="page-link" href="#" data-page="prev">«</a>
          </li>

          <li class="page-item disabled">
            <span class="page-link" id="lblPaginationInfo"></span>
          </li>

          <li class="page-item">
            <a class="page-link" href="#" data-page="next">»</a>
          </li>
        </ul>
      </nav>
    `);
  }

  updatePaginationInfo({ page, totalPages, totalRecords }) {
    $('#lblPaginationInfo').text(
      `Página ${page} de ${totalPages} (${totalRecords} registros)`
    );
  }

  wireEvents() {
    // $('#btnApplyFilter').on('click', () => this.applyFilters());
    // $('#btnClearFilter').on('click', () => this.clearFilters());

    $('#btnApplyFilter').on('click', async () => {
      this.query.resetPage();
      await this.load();
    });

    $('#btnClearFilter').on('click', async () => {
      this.query.clearFilters();
      this.query.resetPage();
      await this.load();
    });

    $('#divPagination').on('click', 'a[data-page]', async e => {
      e.preventDefault();

      const action = $(e.currentTarget).data('page');
      if (action === 'prev') this.query.prevPage();
      if (action === 'next') this.query.nextPage();

      await this.load();
    });
  }

  applyFilters() {
    this.state.filters = {
      unidadeID: $('#cmbFilterUnidade').val() || null,
      funcao: $('#cmbFilterFuncao').val() || null,
      cargo: $('#cmbFilterCargo').val() || null,
      especialidade: $('#cmbFilterEspecialidade').val() || null
    };

    this.state.page = 1;
    this.load();
  }

  clearFilters() {
    $('.filters-bar select').val('');
    this.state.filters = {};
    this.load();
  }
}
