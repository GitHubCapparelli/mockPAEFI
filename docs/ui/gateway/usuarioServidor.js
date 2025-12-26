import { UsuarioServidorAPI } from '../../services/api/usuarioServidorAPI.js';

const popAddID             = '#addModal';
const popUpdateID          = '#editModal';

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

const state = {
  page: 1,
  pageSize: 10,
  filters: {},
  lastResult: null,
  editModal: null,
  addModal: null
};

async function init() {
  state.editModal = new bootstrap.Modal(popUpdateID);
  state.addModal  = new bootstrap.Modal(popAddID);

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
        <td>${u.funcao}</td>
        <td>${u.cargo}</td>
        <td>${u.especialidade}</td>
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
        $('<a>').addClass('page-link').attr('href', '#').text('Previous')
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
        $('<a>').addClass('page-link').attr('href', '#').text('Next')
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
