import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../objModel.js';
import { UsuariosServidoresAPI }                      from '../../services/api/usuariosServidoresAPI.js';
import { UnidadesAPI }                                from '../../services/api/unidadesAPI.js';

const pageTitle            = 'Admin';
const dataCaption          = "Usuários Servidores";
const confirmDeleteMSG     = 'Confirma exclusão lógica ?';

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

  appendHeaderContent();
  appendMainContent();
  appendModals();
}

async function init_old(user) {
  state.currentUser = user;

  await Promise.all([
    UnidadesAPI.init(),
    UsuariosServidoresAPI.init()
  ]);

  renderPage();
  renderModals();
  state.addModal  = new bootstrap.Modal('#divModalAdd'); 
  state.editModal = new bootstrap.Modal('#divModalEdit');

  bindEvents();
  await loadData();

  $('#divMensagem').text('done');
}

async function loadData() {
  state.unidades = await UnidadesAPI.getAll();

  populateSelectFromEnum('cmbFilterFuncao', FuncaoUsuario, true, 'Todas');
  populateSelectFromEnum('cmbFilterCargo', CargoUsuario, true, 'Todos');
  populateSelectFromEnum('cmbFilterEspecial', Especialidade, true, 'Todas');

  populateSelectFromEnum('cmbAddFuncao', FuncaoUsuario, false);
  populateSelectFromEnum('cmbAddCargo', CargoUsuario, false);
  populateSelectFromEnum('cmbAddEspecial', Especialidade, false);

  populateSelectFromEnum('cmbEditCargo', CargoUsuario, false);
  populateSelectFromEnum('cmbEditFuncao', FuncaoUsuario, false);
  populateSelectFromEnum('cmbEditEspecial', Especialidade, false);

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
  
  populateUnidadesSelect('cmbAddUnidade', state.unidades);
}

/* ---------- Rendering ---------- */
function appendHeaderContent() {
  // --- Top Options Section ---
  const $topOptions = $('<section>', { class: 'mx-5rem top-options container-fluid d-flex justify-content-between align-items-center gap-3 bg-white' }).append(
    $('<div>', { id: 'divMensagem', text: 'Carregando...' }),
    $('<a>', { href: '#', title: 'Documentação' }).append($('<i>', { class: 'fa fa-question' }))
  );

  // --- SIDS Top Navbar ---
  const $navbar = $('<section>', { class: 'top-navbar d-flex justify-content-between align-items-center' }).append(
    $('<div>', { class: 'mx-5rem d-flex align-items-center flex-grow-1 flex-nowrap gap-4' }).append(
      $('<span>', { text: 'Menu' }),
      $('<span>', { text: 'Home' }),
      $('<a>', { href: '../../', text: 'Assistência Social' }),
      $('<span>', { text: 'Segurança Alimentar' }),
      $('<span>', { text: 'Transferência de Renda' }),
      $('<span>', { text: 'Tutorial' })
    ),
    $('<span>', { id: 'txtUser-login', class: 'mx-4rem', text: state.currentUser.login })
  );

  // --- Breadcrumbs & Title Section ---
  const $header = $('<section>', { class: 'mx-5rem mt-2 d-flex flex-column' }).append(
    $('<div>', { class: 'breadcrumbs d-flex justify-content-start align-items-center gap-2' }).append(
      $('<a>', { href: '#', text: 'Home' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' }),
      $('<a>', { href: '../../', text: 'Assistência Social' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' }),
      $('<span>', { text: 'Gestão do PAEFI' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' })
    ),
    $('<span>', { class: 'page-title', text: pageTitle }),
    $('<span>', { id: 'txtUser-nome', class: 'mt-1 txtServidor-nome', text: state.currentUser.nome }),
    $('<span>', { id: 'txtUser-unidade', class: 'txtServidor-unidade', text: state.currentUser.hierarquia })
  );
  $('page-header').append($topOptions, $navbar, $header);
}

function appendMainContent() {
  // --- Filters Bar ---
  const createFilterItem = (id, label) => $('<div>', { class: 'filter-item' }).append(
    $('<label>', { for: id, text: label }),
    $('<select>', { class: 'form-select', id: id })
  );

  const $filters = $('<section>', { class: 'filters-bar mx-5rem mt-3 d-flex flex-column' }).append(
    $('<h3>', { class: 'w-100 mt-2 ms-2', text: dataCaption }),
    $('<div>', { class: 'w-100 d-flex flex-column flex-wrap gap-1' }).append(
      $('<div>', { class: 'filter-options w-100 p-2 d-flex gap-3 flex-nowrap' }).append(
        createFilterItem('cmbFilterFuncao', 'Função'),
        createFilterItem('cmbFilterCargo', 'Cargo'),
        createFilterItem('cmbFilterEspecialidade', 'Especialidade')
      ),
      $('<div>', { class: 'filter-buttons w-100 p-2 d-flex justify-content-between gap-3' }).append(
        $('<button>', { class: 'btn btn-primary', id: 'btnApplyFilter' }).append($('<i>', { class: 'fas fa-filter' }), ' Filtrar'),
        $('<button>', { class: 'btn btn-outline-secondary', id: 'btnClearFilter' }).append($('<i>', { class: 'fas fa-times' }), ' Limpar')
      )
    )
  );

  // --- Data Section (Table & Pagination) ---
  const $dataSection = $('<section>', { class: 'mx-5rem data-section' }).append(
    // Action Buttons
    $('<div>', { class: 'mt-2 mx-2 action-buttons d-flex justify-content-between align-items-center gap-3' }).append(
      $('<div>', { class: 'action-buttons-left d-flex align-items-center gap-3 flex-grow-1 flex-nowrap' }).append(
        $('<button>', { class: 'btn btn-primary', id: 'btnAddNew' }).append($('<i>', { class: 'fas fa-plus' }), ' Incluir')
      ),
      $('<div>', { class: 'action-buttons-right d-flex justify-content-end align-items-end gap-3' }).append(
        $('<button>', { class: 'btn btn-secondary', id: 'btnExport' }).append($('<i>', { class: 'fas fa-download' }), ' Exportar')
      )
    ),
    // Table
    $('<div>', { class: 'mt-3 table-responsive' }).append(
      $('<table>', { class: 'table table-striped table-hover' }).append(
        $('<thead>').append(thead), // Assuming thead is already a DOM element or valid HTML string
        $('<tbody>', { id: 'dataRows' }).append(
          $('<tr>').append($('<td>', { colspan: colSpan, class: 'text-center text-muted', text: 'Carregando...' }))
        )
      )
    ),
    // Pagination
    $('<div>', { class: 'pagination-section d-flex justify-content-between align-items-center' }).append(
      $('<div>', { class: 'pagination-info' }).append($('<span>', { id: 'navInfo' })),
      $('<nav>').append($('<ul>', { id: 'navControls', class: 'pagination mb-0' }))
    )
  );
  $('page-main').append($filters, $dataSection);
}

function appendModals() {
  const createModal = (id, title, formId, fields, isEdit = false) => {
    const $modal = $('<div>', { id: id, class: 'modal fade', tabindex: '-1', 'aria-hidden': 'true' });
    const $dialog = $('<div>', { class: 'modal-dialog modal-lg modal-dialog-centered' });
    const $content = $('<div>', { class: 'modal-content' });

    // Header
    const $header = $('<div>', { class: 'modal-header' }).append(
      $('<h5>', { class: 'modal-title', text: title }),
      $('<button>', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' })
    );

    // Body & Form
    const $form = $('<form>', { id: formId });
    const $row = $('<div>', { class: 'row g-3' });

    if (isEdit) {
      $form.append($('<input>', { type: 'hidden', id: 'hiddenEditId' }));
    }

    // Map through fields to create inputs/selects
    fields.forEach(field => {
      const $col = $('<div>', { class: field.col || 'col-md-6' });
      $col.append($('<label>', { class: 'form-label', text: field.label }));
      
      const elementProps = { id: field.id, class: field.class, required: field.required };
      const $input = field.type === 'select' ? $('<select>', elementProps) : $('<input>', { ...elementProps, type: 'text' });
      
      $col.append($input);
      $row.append($col);
    });

    $form.append($row);
    const $body = $('<div>', { class: 'modal-body' }).append($form);

    // Footer
    const $footer = $('<div>', { class: 'modal-footer' }).append(
      $('<button>', { class: 'btn btn-secondary', 'data-bs-dismiss': 'modal', text: 'Cancelar' }),
      $('<button>', { id: isEdit ? 'btnEditSave' : 'btnAddSave', class: 'btn btn-primary', text: 'Salvar', disabled: true })
    );

    return $modal.append($dialog.append($content.append($header, $body, $footer)));
  };

  const addFields = [
    { label: 'Nome', id: 'txtAddNome', class: 'form-control', required: true },
    { label: 'Login', id: 'txtAddLogin', class: 'form-control', required: true },
    { label: 'Unidade', id: 'cmbAddUnidade', class: 'form-select', type: 'select', col: 'col-md-12' },
    { label: 'Função', id: 'cmbAddFuncao', class: 'form-select', type: 'select' },
    { label: 'Cargo', id: 'cmbAddCargo', class: 'form-select', type: 'select' },
    { label: 'Especialidade', id: 'cmbAddEspecialidade', class: 'form-select', type: 'select', col: 'col-md-12' }
  ];

  const editFields = [
    { label: 'Nome', id: 'txtEditNome', class: 'form-control', required: true },
    { label: 'Login', id: 'txtEditLogin', class: 'form-control', required: true },
    { label: 'Função', id: 'cmbEditFuncao', class: 'form-select', type: 'select' },
    { label: 'Cargo', id: 'cmbEditCargo', class: 'form-select', type: 'select' },
    { label: 'Especialidade', id: 'cmbEditEspecialidade', class: 'form-select', type: 'select', col: 'col-md-12' }
  ];

  // Inject into Body
  //const $section = $('<section>');
  //$section.append(createModal('divModalAdd', 'Novo Usuário Servidor', 'addForm', addFields));
  //$section.append(createModal('divModalEdit', 'Editando Usuário Servidor', 'editForm', editFields, true));
  
  const $add  = createModal('divModalAdd', 'Novo Usuário Servidor', 'addForm', addFields);
  const $edit = createModal('divModalEdit', 'Editando Usuário Servidor', 'editForm', editFields, true);

  $('page-modals').append($add, $edit);
}


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
  const tbody = $('dataItems').empty();

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

  $('navInfo').text(
    `Mostrando ${start} - ${end} de ${p.totalRecords} registros`
  );

  renderPaginationControls(p);
}

function renderPaginationControls(p) {
  const $ul = $('navControls');
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
  $('btnApplyFilter').on('click', onBtnApplyFilters_clicked);
  $('btnClearFilter').on('click', onBtnClearFilters_clicked);

  $('dataItems')
    .on('click', '.js-edit', onBtnEdit_clicked)
    .on('click', '.js-delete', onBtnDelete_clicked);

  $('navControls').on('click', 'a.page-link', onNavControl_clicked);  

  $('btnAddNew').on('click', onBtnAdd_clicked);
  $('btnAddSave').on('click', onBtnSaveNew_clicked);
  $('addForm').on('input change', onModalAdd_inputChanged);

  $('btnEditSave').on('click', onBtnUpdate_clicked);
}

async function onBtnAdd_clicked(e) {
    $('addForm')[0].reset();
    $('btnAddSave').prop('disabled', true);

    state.addModal.show();
}

async function onBtnEdit_clicked(e) {
  try {
    const id = $(e.currentTarget).data('id');
    const u = await UsuariosServidoresAPI.getById(id);
    if (!u) return;

    $('hiddenEdit').val(u.id);
    $('txtEditNome').val(u.nome);
    $('txtEditLogin').val(u.login);
    $('cmbEditFuncao').val(u.funcao ?? '');
    $('cmbEditCargo').val(u.cargo ?? '');
    $('cmbEditEspecial').val(u.especialidade ?? '');

    $('btnEditSave').prop('disabled', false);

    state.editModal.show();
  } catch (err) {
    console.error('Erro ao abrir modal de edição:', err);
    alert('Erro ao abrir edição.');
  }
}

async function onBtnSaveNew_clicked() {
  await UsuariosServidoresAPI.create({
    unidadeID      : $('cmbAddUnidade').val(),
    nome           : $('txtAddNome').val(),
    login          : $('txtAddLogin').val(),
    funcao         : $('cmbAddFuncao').val(),
    cargo          : $('cmbAddCargo').val(),
    especialidade  : $('cmbAddEspecial').val(),
    criadoPor      : state.currentUser.id,
    criadoEm       : new Date().toISOString()
  });

  state.addModal.hide();
  load();
}

async function onBtnUpdate_clicked() {
  const id = $('hiddenEdit').val();

  await UsuariosServidoresAPI.update(id, {
    nome          : $('txtEditNome').val(),
    login         : $('txtEditLogin').val(),
    funcao        : $('cmbEditFuncao').val(),
    cargo         : $('cmbEditCargo').val(),
    especialidade : $('cmbEditEspecial').val(),
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
    cargo         : $('cmbFilterCargo').val() || null,
    funcao        : $('cmbFilterFuncao').val() || null,
    especialidade : $('cmbFilterEspecial').val() || null
  };
  state.page = 1;
  load();
}

function onBtnClearFilters_clicked() {
  $('cmbFilterCargo').val('');
  $('cmbFilterFuncao').val('');
  $('cmbFilterEspecial').val('');

  state.filters = {};
  state.page = 1;
  load();
}

function onModalAdd_inputChanged() {
  const valid = $('txtAddNome').val().trim().length > 0 &&
                $('txtAddLogin').val().trim().length > 0;

  $('btnAddSave').prop('disabled', !valid);
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
