// ui/paefi/gateway/usuariosServidoresGateway.js

import { CoreAdmin }             from './coreAdmin.js';
import { QueryEngine }           from '../engine/queryEngine.js';
import { UnidadesAPI }           from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI } from '../../../services/api/usuariosServidoresAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../../objModel.js';

/* Filters & Columns (UI metadata only) */
export const Filters = [
  { id: 'filterUnidade',       label: 'Unidade',       type: 'select' },
  { id: 'filterEspecialidade', label: 'Especialidade', type: 'enum', enum: Especialidade },
  { id: 'filterFuncao',        label: 'Função',        type: 'enum', enum: FuncaoUsuario },
  { id: 'filterCargo',         label: 'Cargo',         type: 'enum', enum: CargoUsuario }
];

export const Columns = [
  { key: 'nome',          label: 'Nome' },
  { key: 'unidade',       label: 'Unidade' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'funcao',        label: 'Função' },
  { key: 'cargo',         label: 'Cargo' },
  { key: '__actions',     label: 'Ações' }
];

/* Internal state (gateway-owned) */
let queryEngine;
let unidades = [];

/* Lifecycle */
async function Init() {
  await loadUnidades();

  queryEngine = new QueryEngine({
    queryFn: ({ page, pageSize, filters }) =>
      UsuariosServidoresAPI.GetPaginated({
        page,
        pageSize,
        filters
      }),
    initialState: {
      pageSize: 10
    }
  });

  wireEvents();
  await load();
}

/* Data loading  */
async function loadUnidades() {
  unidades = await UnidadesAPI.GetAll();
  hydrateUnidadesSelect();
}

async function load() {
  const result = await queryEngine.execute();
  refreshTable(result.data);
  renderPagination();
}

/* Rendering  */
function refreshTable(list) {
  const $tbody = $('#dataRows').empty();

  if (!list || !list.length) {
    $tbody.append(
      '<tr><td colspan="6" class="text-center text-muted">Nenhum registro</td></tr>'
    );
    return;
  }

  list.forEach(u => {
    const unidade = unidades.find(x => x.id === u.unidadeID);
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

function renderPagination() {
  const { page, totalPages, totalItems } = queryEngine.pagination;

  $('#navInfo').text(
    `Página ${page} de ${totalPages} — ${totalItems} registros`
  );

  const $nav = $('#navControls').empty();

  $nav.append(`
    <li class="page-item ${page === 1 ? 'disabled' : ''}">
      <a class="page-link js-prev" href="#">Anterior</a>
    </li>
  `);

  for (let p = 1; p <= totalPages; p++) {
    $nav.append(`
      <li class="page-item ${p === page ? 'active' : ''}">
        <a class="page-link js-page" data-page="${p}" href="#">${p}</a>
      </li>
    `);
  }

  $nav.append(`
    <li class="page-item ${page === totalPages ? 'disabled' : ''}">
      <a class="page-link js-next" href="#">Próxima</a>
    </li>
  `);
}

/* Filters */
function applyFilters() {
  queryEngine.setFilters({
    unidadeID: $('#cmbFilterUnidade').val() || null,
    especialidade: $('#cmbFilterEspecialidade').val() || null,
    funcao: $('#cmbFilterFuncao').val() || null,
    cargo: $('#cmbFilterCargo').val() || null
  })
  .then(result => { 
    refreshTable(result.data);
    renderPagination();
  });
}

function clearFilters() {
  $('.filters-bar select').val('');

  queryEngine.reset()
  .then(result => { 
    refreshTable(result.data);
    renderPagination();
  });
}

/* Select hydration  */
function hydrateUnidadesSelect() {
  const $s = $('#cmbFilterUnidade').empty();
  $s.append('<option value="">Todas</option>');
  unidades.forEach(u => { $s.append(`<option value="${u.id}">${u.sigla}</option>`); });
}

/* Events */
function wireEvents() {
  $('#btnApplyFilter').on('click', applyFilters);
  $('#btnClearFilter').on('click', clearFilters);

  $(document).on('click', '.js-prev', e => {
    e.preventDefault();
    queryEngine.prev().then(r => {
      refreshTable(r.data);
      renderPagination();
    });
  });

  $(document).on('click', '.js-next', e => {
    e.preventDefault();
    queryEngine.next().then(r => {
      refreshTable(r.data);
      renderPagination();
    });
  });

  $(document).on('click', '.js-page', e => {
    e.preventDefault();
    const page = Number($(e.currentTarget).data('page'));
    queryEngine.goTo(page).then(r => {
      refreshTable(r.data);
      renderPagination();
    });
  });
}

/* Public API */
export const UsuariosServidoresGateway = {
  Init
};
