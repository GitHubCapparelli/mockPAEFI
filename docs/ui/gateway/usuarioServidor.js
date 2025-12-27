import { FuncaoUsuario, 
         CargoUsuario, 
         Especialidade 
       } from '../../objModel.js';
import { UsuarioServidorAPI 
       } from '../../services/api/usuarioServidorAPI.js';

const filtersSECTION       = '#sectionFilters';
const dataSECTION          = '#sectionData';
const popAddID             = '#addModal';
const popUpdateID          = '#editModal';

const applyFilterBtnID     = '#btnApplyFilter';
const cleanFilterBtnID     = '#btnCleanFilter';
const filterEspecialID     = '#filterEspecialidade';
const filterCargoID        = '#filterCargo';
const filterFuncaoID       = '#filterFuncao';

const dataItemsID          = '#rowsServidores';
const navInfoID            = '#txtNavInfo';
const navControlsID        = '#ulNavControls';

const btnAddNewID          = '#btnAddNew';
const addFormID            = '#addForm';
const btnSaveNewID         = '#btnSaveNew';
const btnSaveEditID        = '#btnSaveEdit';

const addUnidadeID         = '#addUnidadeID';
const addNomeID            = '#editNome';
const addLoginID           = '#addLogin';
const addFuncaoID          = '#addFuncao';
const addCargoID           = '#addCargo';
const addEspecialidadeID   = '#addEspecialidade';

const editIdID             = '#editId';
const editNomeID           = '#editNome';
const editLoginID          = '#editLogin';
const editFuncaoID         = '#editFuncao';
const editCargoID          = '#editCargo';
const editEspecialidadeID  = '#editEspecialidade';

const confirmDeleteMSG     = 'Confirma exclusão lógica ?';
const naoInformado         = 'NaoInformado';

const state = {
  page: 1,
  pageSize: 4,
  filters: {},
  lastResult: null,
  editModal: null,
  addModal: null
};

async function init() {
  state.editModal = new bootstrap.Modal(popUpdateID);
  state.addModal  = new bootstrap.Modal(popAddID);

  renderFiltersSection(); 

  await UsuarioServidorAPI.init();
  bindEvents();
  load();
}


async function load() {
  const result = await UsuarioServidorAPI.getPaginated({
    page: state.page,
    pageSize: state.pageSize,
    filters: state.filters
  });

  state.lastResult = result;

  renderTable(result.data);
  renderPagination(result);
}

/* ---------- Rendering ---------- */
function renderFiltersSection() {
  const $section = $(filtersSECTION);
  $section.empty();

  $section.append(`
    <div class="filter-options d-flex align-items-center gap-3 flex-grow-1 flex-nowrap">
      <div class="filter-item">
        <label for="filterFuncao">Função</label>
        <select class="form-select" id="filterFuncao"></select>
      </div>

      <div class="filter-item">
        <label for="filterCargo">Cargo</label>
        <select class="form-select" id="filterCargo"></select>
      </div>

      <div class="filter-item">
        <label for="filterEspecialidade">Especialidade</label>
        <select class="form-select" id="filterEspecialidade"></select>
      </div>
    </div>

    <div class="filter-buttons d-flex justify-content-end align-items-end gap-3">
      <button class="btn btn-primary" id="btnApplyFilter">
        <i class="fas fa-filter"></i> Filtrar
      </button>
      <button class="btn btn-outline-secondary" id="btnClearFilter">
        <i class="fas fa-times"></i> Limpar
      </button>
    </div>
  `);
  populateSelectFromEnum($('#filterFuncao'), FuncaoUsuario, 'Todas');
  populateSelectFromEnum($('#filterCargo'), CargoUsuario, 'Todos');
  populateSelectFromEnum($('#filterEspecialidade'), Especialidade, 'Todas');  
}

function populateSelectFromEnum($select, enumType, allLabel) {
  $select.empty();
  $select.append(`<option value="">${allLabel}</option>`);

  enumType.All.forEach(item => {
    if (item.Key === 'NaoInformado') return; // optional UX decision
    $select.append(`<option value="${item.Key}">${item.Value}</option>`);
  });
}

function renderTable(list) {
  const tbody = $(dataItemsID).empty();

  if (!list.length) {
    tbody.append('<tr><td colspan="6">Nenhum registro</td></tr>');
    return;
  }

  list.forEach(u => {
    tbody.append(`
      <tr>
        <td>${u.nome}</td>
        <td>${u.login}</td>
        <td>${u.funcao === naoInformado ? '' : u.funcao}</td>
        <td>${u.cargo === naoInformado ? '' : u.cargo}</td>
        <td>${u.especialidade === naoInformado ? '' : u.especialidade}</td>
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
}

function renderPagination(result) {
    $(navInfoID).text(
        'Mostrando ' + result.startRecord + ' - ' + result.endRecord + 
        ' de ' + result.totalRecords + ' registros'
    );

    var pagination = $(navControlsID);
    pagination.empty();

    var prevLi = $('<li>').addClass('page-item' + (result.currentPage === 1 ? ' disabled' : ''));
    prevLi.append(
        $('<a>').addClass('page-link').attr('href', '#').text('Anterior')
            .on('click', function(e) {
                e.preventDefault();
                if (result.currentPage > 1) {
                    state.currentPage--;
                    loadUsers();
                }
            })
    );
    pagination.append(prevLi);

    var startPage = Math.max(1, result.currentPage - 2);
    var endPage   = Math.min(result.totalPages, result.currentPage + 2);

    if (startPage > 1) {
        pagination.append(createPageButton(1, result.currentPage));
        if (startPage > 2) {
            pagination.append(
                $('<li>').addClass('page-item disabled')
                    .append($('<a>').addClass('page-link').text('...'))
            );
        }
    }

    for (var i = startPage; i <= endPage; i++) {
        pagination.append(createPageButton(i, result.currentPage));
    }

    if (endPage < result.totalPages) {
        if (endPage < result.totalPages - 1) {
            pagination.append(
                $('<li>').addClass('page-item disabled')
                    .append($('<a>').addClass('page-link').text('...'))
            );
        }
        pagination.append(createPageButton(result.totalPages, result.currentPage));
    }

    var nextLi = $('<li>').addClass('page-item' + (result.currentPage === result.totalPages ? ' disabled' : ''));
    nextLi.append(
        $('<a>').addClass('page-link').attr('href', '#').text('Próxima')
            .on('click', function(e) {
                e.preventDefault();
                if (result.currentPage < result.totalPages) {
                    state.currentPage++;
                    loadUsers();
                }
            })
    );
    pagination.append(nextLi);
}

/* ---------- Events ---------- */
function bindEvents() {
  $(btnAddNewID).on('click', () => {
    $(addFormID)[0].reset();
    state.addModal.show();
  });

  $(btnSaveNewID).on('click', saveNew);
  $(btnSaveEditID).on('click', saveEdit);

  $(dataItemsID)
    .on('click', '.js-edit', openEdit)
    .on('click', '.js-delete', remove);

  $(navControlsID)
    .on('click', '.js-page', e => {
      state.page = Number($(e.target).data('page'));
      load();
    });

  $(applyFilterBtnID).on('click', applyFilters);
  $(cleanFilterBtnID).on('click', clearFilters);
}

/* ---------- Actions ---------- */
async function openEdit(e) {
  const id = $(e.currentTarget).data('id');
  const u = await UsuarioServidorAPI.getById(id);

  $(editIdID).val(u.id);
  $(editNomeID).val(u.nome);
  $(editLoginID).val(u.login);
  $(editFuncaoID).val(u.funcao);
  $(editCargoID).val(u.cargo);
  $(editEspecialidadeID).val(u.especialidade);

  state.editModal.show();
}

async function saveNew() {
  await UsuarioServidorAPI.create({
    unidadeID     : $(addUnidadeID).val(),
    nome          : $(addNomeID).val(),
    login         : $(addLoginID).val(),
    funcao        : $(addFuncaoID).val(),
    cargo         : $(addCargoID).val(),
    especialidade : $(addEspecialidadeID).val()
  });

  state.addModal.hide();
  load();
}


async function saveEdit() {
  const id = $(editIdID).val();

  await UsuarioServidorAPI.update(id, {
    nome          : $(editNomeID).val(),
    login         : $(editLoginID).val(),
    funcao        : $(editFuncaoID).val(),
    cargo         : $(editCargoID).val(),
    especialidade : $(editEspecialidadeID).val()
  });

  state.editModal.hide();
  load();
}

async function remove(e) {
  const id = $(e.currentTarget).data('id');
  if (!confirm(confirmDeleteMSG)) return;

  await UsuarioServidorAPI.softDelete(id);
  load();
}

function applyFilters() {
  state.filters = {
    cargo         : $(filterCargoID).val() || null,
    funcao        : $(filterFuncaoID).val() || null,
    especialidade : $(filterEspecialID).val() || null
  };
  state.page = 1;
  load();
}

function clearFilters() {
  $(filterCargoID).val('');
  $(filterFuncaoID).val('');
  $(filterEspecialID).val('');

  state.filters = {};
  state.page = 1;
  load();
}

/* ---------- Public ---------- */
export const UsuarioServidorGateway = {
  init,
  applyFilter(filters) {
    state.filters = filters;
    state.page = 1;
    load();
  },
  refresh: load
};
