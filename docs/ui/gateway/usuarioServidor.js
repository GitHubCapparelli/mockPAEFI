import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../objModel.js';
import { UsuarioServidorAPI }                         from '../../services/api/usuarioServidorAPI.js';

const sectionFiltersID     = '#sectionFilters';
const sectionDataID        = '#sectionData';
const sectionModelsID      = '#sectionModals';

const btnApplyFilterID     = '#btnApplyFilter';
const btnClearFilterID     = '#btnClearFilter';
const cmbFilterCargoID     = '#cmbFilterCargo';
const cmbFilterFuncaoID    = '#cmbFilterFuncao';
const cmbFilterEspecialID  = '#cmbFilterEspecialidade';

const dataItemsID          = '#dataRows';
const navInfoID            = '#navInfo';
const navControlsID        = '#navControls';

const btnAddNewID          = '#btnAddNew';
const addFormID            = '#addForm';

const divModalAddID        = '#divModalAdd';
const hiddenAddUnidadeID   = '#hiddenAddUnidadeId';
const txtAddNomeID         = '#txtAddNome';
const txtAddLoginID        = '#txtAddLogin';
const cmbAddFuncaoID       = '#cmbAddFuncao';
const cmbAddCargoID        = '#cmbAddCargo';
const cmbAddEspecialID     = '#cmbAddEspecialidade';
const btnAddSaveID         = '#btnAddSave';

const divModalEditID       = '#divModalEdit';
const hiddenEditID         = '#hiddenEditId';
const txtEditNomeID        = '#txtEditNome';
const txtEditLoginID       = '#txtEditLogin';
const cmbEditCargoID       = '#cmbEditCargo';
const cmbEditFuncaoID      = '#cmbEditFuncao';
const cmbEditEspecialID    = '#cmbEditEspecialidade';
const btnEditSaveID        = '#btnEditSave';

const confirmDeleteMSG     = 'Confirma exclusão lógica ?';

const state = {
  page: 1,
  pageSize: 5,
  filters: {},
  lastResult: null,
  editModal: null,
  addModal: null,
  currentUserID: null
};

async function init(currentUserID) {
  state.currentUserID = currentUserID;

  renderModalEdit();
  state.editModal = new bootstrap.Modal(divModalEditID);

  renderFilters(); 
  renderData();

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
  renderPagination(result.pagination);
}

/* ---------- Rendering ---------- */
function renderFilters() {
  const $section = $(sectionFiltersID);
  $section.empty();

  $section.append(`
    <div class="w-100 d-flex flex-column flex-wrap">
      <div class="filter-options w-100 d-flex gap-3 flex-nowrap">
        <div class="filter-item">
          <label for="cmbFilterFuncao">Função</label>
          <select class="form-select" id="cmbFilterFuncao"></select>
        </div>

        <div class="filter-item">
          <label for="cmbFilterCargo">Cargo</label>
          <select class="form-select" id="cmbFilterCargo"></select>
        </div>

        <div class="filter-item">
          <label for="cmbFilterEspecialidade">Especialidade</label>
          <select class="form-select" id="cmbFilterEspecialidade"></select>
        </div>
      </div>

      <div class="filter-buttons w-100 d-flex gap-3">
        <button class="btn btn-primary" id="btnApplyFilter">
          <i class="fas fa-filter"></i> Filtrar
        </button>
        <button class="btn btn-outline-secondary" id="btnClearFilter">
          <i class="fas fa-times"></i> Limpar
        </button>
      </div>
    </div>
  `);
  populateSelectFromEnum(cmbFilterFuncaoID, FuncaoUsuario, 'Todas');
  populateSelectFromEnum(cmbFilterCargoID, CargoUsuario, 'Todos');
  populateSelectFromEnum(cmbFilterEspecialID, Especialidade, 'Todas');  
}

function renderData() {
  $(sectionDataID).html(`
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Login</th>
            <th>Função</th>
            <th>Cargo</th>
            <th>Especialidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="dataRows">
          <tr>
            <td colspan="6" class="text-center text-muted">Carregando...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-section d-flex justify-content-between align-items-center">
      <div class="pagination-info">
        <span id="navInfo"></span>
      </div>
      <nav>
        <ul id="navControls" class="pagination mb-0"></ul>
      </nav>
    </div>
  `);
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
        <td title="${u.nome}">${u.nome}</td>
        <td>${u.login}</td>

        <td>${u.funcao === FuncaoUsuario.NaoInformada.Key        ? '' : FuncaoUsuario.ValueFromKey(u.funcao)}</td>
        <td>${u.cargo === CargoUsuario.NaoInformado.Key          ? '' : CargoUsuario.ValueFromKey(u.cargo)}</td>
        <td>${u.especialidade === Especialidade.NaoInformada.Key ? '' : Especialidade.ValueFromKey(u.especialidade)}</td>
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

function renderModalEdit() {
  const host = $(sectionModelsID);
  host.empty();

  host.append(`
    <div class="modal fade" id="divModalEdit" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Editando Usuário Servidor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <form id="editForm">
              <input type="hidden" id="hiddenEditId" />
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nome</label>
                  <input type="text" class="form-control" id="txtEditNome" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Login</label>
                  <input type="text" class="form-control" id="txtEditLogin" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Função</label>
                  <select class="form-select" id="cmbEditFuncao"></select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Cargo</label>
                  <select class="form-select" id="cmbEditCargo"></select>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Especialidade</label>
                  <select class="form-select" id="cmbEditEspecialidade"></select>
                </div>

              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button class="btn btn-primary" id="btnEditSave" disabled>
              Salvar
            </button>
          </div>

        </div>
      </div>
    </div>
  `);
//  populateSelectFromEnum(cmbEditCargoID, CargoUsuario, 'Selecione o cargo');
//  populateSelectFromEnum(cmbEditFuncaoID, FuncaoUsuario, 'Selecione a função');
//  populateSelectFromEnum(cmbEditEspecialID, Especialidade, 'Selecione a especialidade');

  populateSelectFromEnum(cmbEditCargoID, CargoUsuario, false);
  populateSelectFromEnum(cmbEditFuncaoID, FuncaoUsuario, false);
  populateSelectFromEnum(cmbEditEspecialID, Especialidade, false);
}


/* TODO: refactor into a baseRenderer.js shared file  */
function renderPagination(p) {
  const start = (p.page - 1) * p.pageSize + 1;
  const end   = Math.min(start + p.pageSize - 1, p.totalRecords);

  $(navInfoID).text(
    `Mostrando ${start} - ${end} de ${p.totalRecords} registros`
  );

  renderPaginationControls(p);
}

function renderPaginationControls(p) {
  const $ul = $(navControlsID);
  $ul.empty();

  const prevDisabled = p.page === 1 ? 'disabled' : '';
  const nextDisabled = p.page === p.totalPages ? 'disabled' : '';

  $ul.append(`
    <li class="page-item ${prevDisabled}">
      <a class="page-link" href="#" data-page="${p.page - 1}">Anterior</a>
    </li>
  `);

  for (let i = 1; i <= p.totalPages; i++) {
    const active = i === p.page ? 'active' : '';
    $ul.append(`
      <li class="page-item ${active}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `);
  }

  $ul.append(`
    <li class="page-item ${nextDisabled}">
      <a class="page-link" href="#" data-page="${p.page + 1}">Próxima</a>
    </li>
  `);
}

function populateSelectFromEnum(selectId, enumType, includeEmpty = true, emptyLabel = 'Selecione...', excludeKeys = []) {
  const $select = $(selectId);
  $select.empty();

  if (includeEmpty) {
    $select.append(`<option value="">${emptyLabel}</option>`);
  }

  enumType.All.forEach(item => {
    if (excludeKeys.includes(item.Key)) return;

    $select.append(`<option value="${item.Key}">${item.Value}</option>`);
  });
}


/* ---------- Events ---------- */
function bindEvents() {
  $(btnApplyFilterID).on('click', applyFilters);
  $(btnClearFilterID).on('click', clearFilters);

  $(navControlsID).on('click', 'a.page-link', function (e) {
    e.preventDefault();

    const page = Number($(this).data('page'));
    if (!page || page === state.page) return;

    state.page = page;
    load();
  });  

  $(dataItemsID)
    .on('click', '.js-edit', openEdit)
    .on('click', '.js-delete', remove);

  $(btnAddNewID).on('click', () => {
    $(addFormID)[0].reset();
    state.addModal.show();
  });

  $(btnAddSaveID).on('click', saveNew);
  $(btnEditSaveID).on('click', saveEdit);
}

/* ---------- Actions ---------- */
async function openEdit(e) {
  try {
    const id = $(e.currentTarget).data('id');
    const u = await UsuarioServidorAPI.getById(id);

    if (!u) return;

    $(hiddenEditID).val(u.id);
    $(txtEditNomeID).val(u.nome);
    $(txtEditLoginID).val(u.login);
    $(cmbEditFuncaoID).val(u.funcao ?? '');
    $(cmbEditCargoID).val(u.cargo ?? '');
    $(cmbEditEspecialID).val(u.especialidade ?? '');

    $(btnEditSaveID).prop('disabled', false);

    state.editModal.show();
  } catch (err) {
    console.error('Erro ao abrir modal de edição:', err);
    alert('Erro ao abrir edição.');
  }
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
  const id = $(hiddenEditID).val();

  await UsuarioServidorAPI.update(id, {
    nome          : $(txtEditNomeID).val(),
    login         : $(txtEditLoginID).val(),
    funcao        : $(cmbEditFuncaoID).val(),
    cargo         : $(cmbEditCargoID).val(),
    especialidade : $(cmbEditEspecialID).val(),
    alteradoPor   : state.currentUserID
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
    cargo         : $(cmbFilterCargoID).val() || null,
    funcao        : $(cmbFilterFuncaoID).val() || null,
    especialidade : $(cmbFilterEspecialID).val() || null
  };
  state.page = 1;
  load();
}

function clearFilters() {
  $(cmbFilterCargoID).val('');
  $(cmbFilterFuncaoID).val('');
  $(cmbFilterEspecialID).val('');

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
