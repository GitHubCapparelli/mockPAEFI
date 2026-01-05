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
    await this.api.Init();                 // ✅ init main API
    await this.loadLookups();              // ✅ init lookups inside
    CoreAdmin.BuildTable(columns);
    this.wireEvents();
    await this.load();
  }

  async loadLookups() {
    await this.lookups.unidades.Init();    // ✅ init lookup API
    this.unidades = this.lookups.unidades.GetAll();
  }


  async load() {
    const response = await this.api.GetPaginated({
      page: this.state.page,
      pageSize: this.state.pageSize,
      filters: this.state.filters
    });

    this.state.lastData = response;
    this.render(response.data);
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

  wireEvents() {
    $('#btnApplyFilter').on('click', () => this.applyFilters());
    $('#btnClearFilter').on('click', () => this.clearFilters());
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
