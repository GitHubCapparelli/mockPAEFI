import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../objModel.js';
import { UsuariosServidoresAPI }                      from '../../services/api/usuariosServidoresAPI.js';
import { UnidadesAPI }                                from '../../services/api/unidadesAPI.js';

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

const divModalAddID        = "#divModalAdd";
const txtAddNomeID         = '#txtAddNome';
const txtAddLoginID        = '#txtAddLogin';
const cmbAddUnidadeID      = '#cmbAddUnidade';
const cmbAddFuncaoID       = '#cmbAddFuncao';
const cmbAddCargoID        = '#cmbAddCargo';
const cmbAddEspecialID     = '#cmbAddEspecialidade';
const btnAddSaveID         = '#btnAddSave';

const divModalEditID       = "#divModalEdit";
const hiddenEditID         = '#hiddenEditId';
const txtEditNomeID        = '#txtEditNome';
const txtEditLoginID       = '#txtEditLogin';
const cmbEditCargoID       = '#cmbEditCargo';
const cmbEditFuncaoID      = '#cmbEditFuncao';
const cmbEditEspecialID    = '#cmbEditEspecialidade';
const btnEditSaveID        = '#btnEditSave';

const pageTitle            = 'Admin';
const dataCaption          = "Usuários Servidores";
const confirmDeleteMSG     = 'Confirma exclusão lógica ?';

const divMensagemID        = $('#divMensagem');

const state = {
  page: 1,
  pageSize: 5,
  filters: {},
  lastData: null,
  editModal: null,
  addModal: null,
  currentUser: null,
  unidades: null
};

const columns = [
  { key: 'nome',          label: 'Nome' },
  { key: 'login',         label: 'Login' },
  { key: 'funcao',        label: 'Função' },
  { key: 'cargo',         label: 'Cargo' },
  { key: 'especialidade', label: 'Especialidadee' },
  { key: '__actions',     label: 'Ações' }
];
const thead   = columns.map(c => `<th>${c.label}</th>`).join('');
const colSpan = columns.length;

async function init(user) {
  state.currentUser = user;

  await Promise.all([
    UnidadesAPI.init(),
    UsuariosServidoresAPI.init()
  ]);

  renderPage();
  renderModals();
  bindEvents();
  await loadData();

  state.addModal  = new bootstrap.Modal(divModalAddID); 
  state.editModal = new bootstrap.Modal(divModalEditID);
  $(divMensagemID).text('done');
}

async function loadData() {
  state.unidades = await UnidadesAPI.getAll();

  populateSelectFromEnum(cmbFilterFuncaoID, FuncaoUsuario, true, 'Todas');
  populateSelectFromEnum(cmbFilterCargoID, CargoUsuario, true, 'Todos');
  populateSelectFromEnum(cmbFilterEspecialID, Especialidade, true, 'Todas');

  populateSelectFromEnum(cmbAddFuncaoID, FuncaoUsuario, false);
  populateSelectFromEnum(cmbAddCargoID, CargoUsuario, false);
  populateSelectFromEnum(cmbAddEspecialID, Especialidade, false);

  populateSelectFromEnum(cmbEditCargoID, CargoUsuario, false);
  populateSelectFromEnum(cmbEditFuncaoID, FuncaoUsuario, false);
  populateSelectFromEnum(cmbEditEspecialID, Especialidade, false);

  await load();
}

async function load() {
  const data = await UsuariosServidoresAPI.getPaginated({
    page: state.page,
    pageSize: state.pageSize,
    filters: state.filters
  });
  state.lastData = data;

  renderTable(data.data);
  renderPagination(data.pagination);
  
  populateUnidadesSelect(cmbAddUnidadeID, state.unidades);
}

/* ---------- Rendering ---------- */
function renderPage() {
  $('body').append(`
    <section class="mx-5rem top-options container-fluid d-flex justify-content-between align-items-center gap-3 bg-white">
      <div id="divMensagem">Carregando...</div>
      <a href="#" title="Documentação"><i class="fa fa-question"></i></a>
    </section>

    <section class="top-navbar d-flex justify-content-between align-items-center">
      <div class="mx-5rem d-flex align-items-center flex-grow-1 flex-nowrap gap-4">
          <span>Menu</span>
          <span>Home</span>
          <a href="../../">Assistência Social</a>
          <span>Segurança Alimentar</span>
          <span>Transferência de Renda</span>
          <span>Tutorial</span>
      </div>
      <span id="txtUser-login" class="mx-4rem">${state.currentUser.login}</span>
    </section>
    
    <section class="mx-5rem mt-2 d-flex flex-column">
      <div class="breadcrumbs d-flex justify-content-start align-items-center gap-2">
          <a href="#">Home</a>
          <i class="fa fa-angle-right fa-1x"></i>
          <a href="../../">Assistência Social </a>
          <i class="fa fa-angle-right fa-1x"></i>
          <span>Gestão do PAEFI</span>
          <i class="fa fa-angle-right fa-1x"></i>
      </div>
      <span class="page-title">${pageTitle}</span>
      <span id="txtUser-nome" class="mt-1 txtServidor-nome">${state.currentUser.nome}</span>
      <span id="txtUser-unidade" class="txtServidor-unidade">${state.currentUser.hierarquia}</span>
    </section>
    
    <section class="filters-bar mx-5rem mt-3 d-flex flex-column">
      <h3 class="w-100 mt-2 ms-2">${dataCaption}</h3>
      <div class="w-100 d-flex flex-column flex-wrap gap-1">
        <div class="filter-options w-100 p-2 d-flex gap-3 flex-nowrap">
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

        <div class="filter-buttons w-100 p-2 d-flex justify-content-between gap-3">
          <button class="btn btn-primary" id="btnApplyFilter">
            <i class="fas fa-filter"></i> Filtrar
          </button>
          <button class="btn btn-outline-secondary" id="btnClearFilter">
            <i class="fas fa-times"></i> Limpar
          </button>
        </div>
      </div>
    </section>
    
    <section class="mx-5rem data-section">
      <div class="mt-2 mx-2 action-buttons d-flex justify-content-between align-items-center gap-3">
        <div class="action-buttons-left d-flex align-items-center gap-3 flex-grow-1 flex-nowrap">
            <button class="btn btn-primary" id="btnAddNew">
                <i class="fas fa-plus"></i> Incluir
            </button>
        </div>
        <div class="action-buttons-right d-flex justify-content-end align-items-end gap-3">
            <button class="btn btn-secondary" id="btnExport">
                <i class="fas fa-download"></i> Exportar
            </button>
        </div>
      </div>

      <div class="mt-3 table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>${thead}</tr>
          </thead>
          <tbody id="dataRows">
            <tr>
              <td colspan="${colSpan}" class="text-center text-muted">Carregando...</td>
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
    </section>

  `);
}

function renderModals() {
  $('body').append(`
    <section>
      <div class="modal fade" id="divModalAdd" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title">Novo Usuário Servidor</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <form id="addForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Nome</label>
                    <input type="text" class="form-control" id="txtAddNome" required />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Login</label>
                    <input type="text" class="form-control" id="txtAddLogin" required />
                  </div>

                  <div class="col-md-12">
                    <label class="form-label">Unidade</label>
                    <select class="form-select" id="cmbAddUnidade"></select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Função</label>
                    <select class="form-select" id="cmbAddFuncao"></select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Cargo</label>
                    <select class="form-select" id="cmbAddCargo"></select>
                  </div>

                  <div class="col-md-12">
                    <label class="form-label">Especialidade</label>
                    <select class="form-select" id="cmbAddEspecialidade"></select>
                  </div>
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button class="btn btn-primary" id="btnAddSave" disabled>
                Salvar
              </button>
            </div>

          </div>
        </div>
      </div>


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
    </section>
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

function populateUnidadesSelect(selectId, list, selectedId = null, emptyLabel = 'Selecione...') {
  const $cmb = $(selectId);
  $cmb.empty();
  $cmb.append(`<option value="">${emptyLabel}</option>`);

  list.forEach(u => {
    const unidade = u.nome ? `${u.sigla} - ${u.nome}` : u.sigla;
    $cmb.append(`<option value="${u.id}" ${u.id === selectedId ? 'selected' : ''}>${unidade}</option>`);
  });
}

/* ---------- Events ---------- */
function bindEvents() {
  $(btnApplyFilterID).on('click', onBtnApplyFilters_clicked);
  $(btnClearFilterID).on('click', onBtnClearFilters_clicked);

  $(dataItemsID)
    .on('click', '.js-edit', onBtnEdit_clicked)
    .on('click', '.js-delete', onBtnDelete_clicked);

  $(navControlsID).on('click', 'a.page-link', onNavControl_clicked);  

  $(btnAddNewID).on('click', onBtnAdd_clicked);
  $(btnAddSaveID).on('click', onBtnSaveNew_clicked);
  $(addFormID).on('input change', onModalAdd_inputChanged);

  $(btnEditSaveID).on('click', onBtnUpdate_clicked);
}

async function onBtnAdd_clicked(e) {
    $(addFormID)[0].reset();
    $(btnAddSaveID).prop('disabled', true);

    populateUnidadesSelect(cmbAddUnidadeID, state.unidades);

    state.addModal.show();
}

async function onBtnEdit_clicked(e) {
  try {
    const id = $(e.currentTarget).data('id');
    const u = await UsuariosServidoresAPI.getById(id);
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

async function onBtnSaveNew_clicked() {
  await UsuariosServidoresAPI.create({
    unidadeID      : $(cmbAddUnidadeID).val(),
    nome           : $(txtAddNomeID).val(),
    login          : $(txtAddLoginID).val(),
    funcao         : $(cmbAddFuncaoID).val(),
    cargo          : $(cmbAddCargoID).val(),
    especialidade  : $(cmbAddEspecialID).val(),
    criadoPor      : state.currentUser.id,
    criadoEm       : new Date().toISOString()
  });

  state.addModal.hide();
  load();
}

async function onBtnUpdate_clicked() {
  const id = $(hiddenEditID).val();

  await UsuariosServidoresAPI.update(id, {
    nome          : $(txtEditNomeID).val(),
    login         : $(txtEditLoginID).val(),
    funcao        : $(cmbEditFuncaoID).val(),
    cargo         : $(cmbEditCargoID).val(),
    especialidade : $(cmbEditEspecialID).val(),
    alteradoPor   : state.currentUser.id,
    alteradoEm    : new Date().toISOString()
  });

  state.editModal.hide();
  load();
}

async function onBtnDelete_clicked(e) {
  const id = $(e.currentTarget).data('id');
  if (!confirm(confirmDeleteMSG)) return;

  await UsuariosServidoresAPI.softDelete(id, {
    excluidoPor   : state.currentUser.id,
    excluidoEm    : new Date().toISOString()
  });
  load();
}

async function onNavControl_clicked(e) {
    e.preventDefault();

    const page = Number($(this).data('page'));
    if (!page || page === state.page) return;

    state.page = page;
    load();
}

function onBtnApplyFilters_clicked() {
  state.filters = {
    cargo         : $(cmbFilterCargoID).val() || null,
    funcao        : $(cmbFilterFuncaoID).val() || null,
    especialidade : $(cmbFilterEspecialID).val() || null
  };
  state.page = 1;
  load();
}

function onBtnClearFilters_clicked() {
  $(cmbFilterCargoID).val('');
  $(cmbFilterFuncaoID).val('');
  $(cmbFilterEspecialID).val('');

  state.filters = {};
  state.page = 1;
  load();
}

function onModalAdd_inputChanged() {
  const valid = $(txtAddNomeID).val().trim().length > 0 &&
                $(txtAddLoginID).val().trim().length > 0;

  $(btnAddSaveID).prop('disabled', !valid);
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
