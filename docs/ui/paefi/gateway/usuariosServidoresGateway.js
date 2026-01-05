// ui/paefi/gateway/usuariosServidoresGateway.js
import { CoreAdmin
       } from './coreAdmin.js';
import { UnidadesAPI 
       } from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI 
       } from '../../../services/api/usuariosServidoresAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade 
       } from '../../../objModel.js';

export const Filters = [
  { id: 'filterUnidade',       label: 'Unidade',       type:'select', provider: () => [] }, //state.unidades },
  { id: 'filterEspecialidade', label: 'Especialidade', type:'enum',   enum: Especialidade },
  { id: 'filterFuncao',        label: 'Função',        type:'enum',   enum: FuncaoUsuario },
  { id: 'filterCargo',         label: 'Cargo',         type:'enum',   enum: CargoUsuario}
];

export const Columns = [
  { key: 'nome',          label: 'Nome' },
  { key: 'unidade',       label: 'Unidade' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'funcao',        label: 'Função' },
  { key: 'cargo',         label: 'Cargo' },
  { key: '__actions',     label: 'Ações' }
];

function Init() {
  //await loadData();
}

async function loadData() {
  const response = await UsuariosServidoresAPI.GetPaginated({
    page     : state.page,
    pageSize : state.pageSize,
    filters  : state.filters
  });
  state.lastData = response;
  refreshTable(response.data);
}

function refreshTable(list) {
  const $tbody = $('#dataRows').empty();

  if (!list.length) {
    $tbody.append('<tr><td colspan="6">Nenhum registro</td></tr>');
    return;
  }

  list.forEach(u => {
    const unidade = state.unidades.find(x => x.id === u.unidadeID);
    const sigla   = unidade ? unidade.sigla : '';

    $tbody.append(`
      <tr>
        <td>${u.nome}</td>
        <td>${sigla}</td>
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

/* Wiring */

function wireEvents() {
  $('#btnApplyFilter').on('click', applyFilters);
  $('#btnClearFilter').on('click', clearFilters);
}

function applyFilters() {
  state.filters = {
    unidadeID     : $('#cmbFilterUnidade').val() || null,
    funcao        : $('#cmbFilterFuncao').val() || null,
    cargo         : $('#cmbFilterCargo').val() || null,
    especialidade : $('#cmbFilterEspecialidade').val() || null
  };

  state.page = 1;
  loadData();
}

function clearFilters() {
  $('.filters-bar select').val('');
  state.filters = {};
  loadData();
}

/* Select hydration */

function hydrateSelects() {
  populateUnidades('#cmbFilterUnidade');
  populateEnum('#cmbFilterFuncao', FuncaoUsuario);
  populateEnum('#cmbFilterCargo', CargoUsuario);
  populateEnum('#cmbFilterEspecialidade', Especialidade);
}

function populateEnum(selectId, enumType) {
  const $s = $(selectId).empty();
  $s.append('<option value="">Todos</option>');
  enumType.All.forEach(e =>
    $s.append(`<option value="${e.Key}">${e.Value}</option>`)
  );
}

function populateUnidades(selectId) {
  const $s = $(selectId).empty();
  $s.append('<option value="">Todas</option>');
  state.unidades.forEach(u =>
    $s.append(`<option value="${u.id}">${u.sigla}</option>`)
  );
}

/* Public interface */
export const UsuariosServidoresGateway = {
  Init
};