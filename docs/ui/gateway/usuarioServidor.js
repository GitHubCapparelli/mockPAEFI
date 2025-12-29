import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../objModel.js';
import { UsuarioServidorAPI }                         from '../../services/api/usuarioServidorAPI.js';

const filtersSectionID     = '#sectionFilters';
const dataSectionID        = '#sectionData';
const modalsSectionID      = '#sectionModals';
const divivModalAddIDID    = '#divModalAdd';
const sectionModalEditID   = '#sectionModalEdit';

const btnApplyFilterID     = '#btnApplyFilter';
const btnClearFilterID     = '#btnClearFilter';
const cmbFilterEspecialID  = '#cmbcmbFilterEspecialIDade';
const cmbFilterCargoID     = '#cmbFilterCargo';
const cmbFilterFuncaoID    = '#cmbFilterFuncao';

const dataItemsID          = '#dataRows';
const navInfoID            = '#navInfo';
const navControlsID        = '#navControls';

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
  pageSize: 10,
  filters: {},
  lastResult: null,
  editModal: null,
  addModal: null
};

async function init() {
  renderEditModalSkeleton();
  state.editModal = new bootstrap.Modal(sectionModalEditID);

  renderfiltersSectionID(); 
  rendersectionDataID();

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
function renderfiltersSectionID() {
  const $section = $(filtersSectionID);
  $section.empty();

  $section.append(`
    <div class="filter-options d-flex align-items-center gap-3 flex-grow-1 flex-nowrap">
      <div class="filter-item">
        <label for="cmbFilterFuncao">Função</label>
        <select class="form-select" id="cmbFilterFuncao"></select>
      </div>

      <div class="filter-item">
        <label for="cmbFilterCargo">Cargo</label>
        <select class="form-select" id="cmbFilterCargo"></select>
      </div>

      <div class="filter-item">
        <label for="cmbcmbFilterEspecialIDade">Especialidade</label>
        <select class="form-select" id="cmbcmbFilterEspecialIDade"></select>
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
  populateSelectFromEnum($('#cmbFilterFuncao'), FuncaoUsuario, 'Todas');
  populateSelectFromEnum($('#cmbFilterCargo'), CargoUsuario, 'Todos');
  populateSelectFromEnum($('#cmbcmbFilterEspecialIDade'), Especialidade, 'Todas');  
}

function rendersectionDataID() {
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

function renderEditModalSkeleton() {
  const host = $(modalsSectionID);
  host.empty();

  host.append(`
    <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Editar Servidor</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <form id="editForm">

              <input type="hidden" id="editId" />

              <div class="row g-3">

                <div class="col-md-6">
                  <label class="form-label">Nome</label>
                  <input type="text" class="form-control" id="editNome" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Login</label>
                  <input type="text" class="form-control" id="editLogin" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Função</label>
                  <select class="form-select" id="editFuncao"></select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Cargo</label>
                  <select class="form-select" id="editCargo"></select>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Especialidade</label>
                  <select class="form-select" id="editEspecialidade"></select>
                </div>

              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button class="btn btn-primary" id="btnSaveEdit" disabled>
              Salvar
            </button>
          </div>

        </div>
      </div>
    </div>
  `);
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


function populateSelectFromEnum($select, enumType, allLabel) {
  $select.empty();
  $select.append(`<option value="">${allLabel}</option>`);

  enumType.All.forEach(item => {
    if (item.Key === 'NaoInformado') return; // optional UX decision
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

  $(btnSaveNewID).on('click', saveNew);
  $(btnSaveEditID).on('click', saveEdit);

//  $(navControlsID)
//    .on('click', '.js-page', e => {
//      state.page = Number($(e.target).data('page'));
//      load();
//    });

}

/* ---------- Actions ---------- */
async function openEdit(e) {
  const id = $(e.currentTarget).data('id');
  const u = await UsuarioServidorAPI.getById(id);

  if (!u) return;

  $(editIdID).val(u.id);
  $(editNomeID).val(u.nome);
  $(editLoginID).val(u.login);

  // selects will be populated later
  // for now, leave them empty

  state.editModal.show();
}

async function openEdit_OLD(e) {
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
