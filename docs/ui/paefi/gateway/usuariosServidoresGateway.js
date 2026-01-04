// ui/paefi/gateway/usuariosServidoresGateway.js
import { UnidadesAPI 
       } from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI 
       } from '../../../services/api/usuariosServidoresAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade 
       } from '../../../objModel.js';

/* Internal State (private) */
const state = {
  initialized : false,
  currentUser : null,

  page        : 1,
  pageSize    : 5,
  filters     : {},

  unidades    : [],
  lastData    : null,

  addModal    : null,
  editModal   : null
};

/* Public Init */
async function Init(user) {
  if (!user) { throw new Error('[UsuariosServidoresGateway] User is required'); }

  state.currentUser = user;
  if (!state.initialized) {
    await bootstrap();
    state.initialized = true;
  }
  await loadData();
}

/* Bootstrap (executed once) */
async function bootstrap() {
  await Promise.all([
    UnidadesAPI.Init(),
    UsuariosServidoresAPI.Init()
  ]);

  state.unidades = UnidadesAPI.GetAll();

  render();
  wireEvents();

  state.addModal  = new bootstrap.Modal('#divModalAdd');
  state.editModal = new bootstrap.Modal('#divModalEdit');

  hydrateSelects();
}

/* Rendering */

function render() {
  console.log('rendering servidoresGateway...');
  const $container = $('#app-main').empty();
  $container.append(
    renderTitleBar(),
    renderFilters(),
    renderTableSection()
  );
  renderModals();
}

function renderTitleBar() {
  return $('<div>', {
    class: 'page-title mx-2 mt-2 ps-2 d-flex flex-column'
  }).append(
    $('<span>', { class: 'page-title', text: 'Usuários Servidores' })
  );
}

function renderFilters() {
  const createFilter = (id, label) =>
    $('<div>', { class: 'filter-item' }).append(
      $('<label>', { for: id, text: label }),
      $('<select>', { id, class: 'form-select' })
    );

  return $('<section>', { class: 'filters-bar mx-2' }).append(
    $('<div>', { class: 'filter-options p-2 d-flex gap-3' }).append(
      createFilter('cmbFilterUnidade', 'Unidade'),
      createFilter('cmbFilterEspecialidade', 'Especialidade'),
      createFilter('cmbFilterFuncao', 'Função'),
      createFilter('cmbFilterCargo', 'Cargo')
    ),
    $('<div>', { class: 'filter-buttons p-2 d-flex gap-2' }).append(
      $('<button>', { id: 'btnApplyFilter', class: 'btn btn-primary', text: 'Filtrar' }),
      $('<button>', { id: 'btnClearFilter', class: 'btn btn-outline-secondary', text: 'Limpar' })
    )
  );
}

function renderTableSection() {
  return $('<section>', { class: 'data-section mx-2 mt-3' }).append(
    $('<div>', { class: 'table-responsive' }).append(
      $('<table>', { class: 'table table-striped table-hover' }).append(
        $('<thead>').append(
          $('<tr>').append(
            ['Nome','Unidade','Especialidade','Função','Cargo','Ações']
              .map(h => $('<th>').text(h))
          )
        ),
        $('<tbody>', { id: 'dataRows' }).append(
          $('<tr>').append(
            $('<td>', {
              colspan: 6,
              class: 'text-center text-muted',
              text: 'Carregando...'
            })
          )
        )
      )
    )
  );
}

/* Data */

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