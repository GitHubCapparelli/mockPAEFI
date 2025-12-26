import { UsuarioServidorAPI } from '../../services/api/usuarioServidorAPI.js';

const state = {
  page: 1,
  pageSize: 10,
  filters: {},
  lastResult: null,
  editModal: null,
  addModal: null
};

function init() {
  state.editModal = new bootstrap.Modal('#editModal');
  state.addModal  = new bootstrap.Modal('#addModal');

  bindEvents();
  load();
}

async function load() {
  const result = await UsuarioServidorAPI.search({
    page: state.page,
    pageSize: state.pageSize,
    filters: state.filters
  });

  state.lastResult = result;

  renderTable(result.data);
  renderPagination(result);
}

/* ---------- Rendering ---------- */
function renderTable(usuarios) {
  const tbody = $('#rowsServidores').empty();

  if (!usuarios.length) {
    tbody.append('<tr><td colspan="6">Nenhum registro</td></tr>');
    return;
  }

  usuarios.forEach(u => {
    tbody.append(`
      <tr>
        <td>${u.nome}</td>
        <td>${u.login}</td>
        <td>${u.funcao}</td>
        <td>${u.cargo}</td>
        <td>${u.especialidade}</td>
        <td>
          <button class="btn btn-sm btn-primary js-edit" data-id="${u.id}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger js-delete" data-id="${u.id}">
            Excluir
          </button>
        </td>
      </tr>
    `);
  });
}

function renderPagination(p) {
  const ul = $('#ulNavControls').empty();

  for (let i = 1; i <= p.totalPages; i++) {
    ul.append(`
      <li class="page-item ${i === p.page ? 'active' : ''}">
        <a class="page-link js-page" data-page="${i}">${i}</a>
      </li>
    `);
  }
}

/* ---------- Events ---------- */
function bindEvents() {
  $('#btnAddNew').on('click', () => {
    $('#addForm')[0].reset();
    state.addModal.show();
  });

  $('#btnSaveNew').on('click', saveNew);
  $('#btnSaveEdit').on('click', saveEdit);

  $('#dataTableBody')
    .on('click', '.js-edit', openEdit)
    .on('click', '.js-delete', remove);

  $('#paginationControls')
    .on('click', '.js-page', e => {
      state.page = Number($(e.target).data('page'));
      load();
    });
}

/* ---------- Actions ---------- */
async function openEdit(e) {
  const id = $(e.currentTarget).data('id');
  const u = await UsuarioServidorAPI.getById(id);

  $('#editId').val(u.id);
  $('#editNome').val(u.nome);
  $('#editLogin').val(u.login);
  $('#editFuncao').val(u.funcao);
  $('#editCargo').val(u.cargo);
  $('#editEspecialidade').val(u.especialidade);

  state.editModal.show();
}

async function saveNew() {
  const dto = CreateUsuarioServidorDTO({
    unidadeID: $('#addUnidadeID').val(),
    nome: $('#addNome').val(),
    login: $('#addLogin').val(),
    funcao: $('#addFuncao').val(),
    cargo: $('#addCargo').val(),
    especialidade: $('#addEspecialidade').val()
  });

  await UsuarioServidorAPI.create(dto);
  state.addModal.hide();
  load();
}

async function saveEdit() {
  const id = $('#editId').val();

  await UsuarioServidorAPI.update(id, {
    nome: $('#editNome').val(),
    login: $('#editLogin').val(),
    funcao: $('#editFuncao').val(),
    cargo: $('#editCargo').val(),
    especialidade: $('#editEspecialidade').val()
  });

  state.editModal.hide();
  load();
}

async function remove(e) {
  const id = $(e.currentTarget).data('id');
  if (!confirm('Confirma exclusão lógica?')) return;

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
