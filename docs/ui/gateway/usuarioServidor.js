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
  { key: 'unidade',       label: 'Unidade' },
  { key: 'login',         label: 'Login' },
  { key: 'funcao',        label: 'Função' },
  { key: 'cargo',         label: 'Cargo' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: '__actions',     label: 'Ações' }
];
const thead   = $('<tr>').append(columns.map(c => $('<th>').text(c.label)));
const colSpan = columns.length;

/* ---------- Loading ---------- */
async function init(user) {
  state.currentUser = user;

  const [response] = await Promise.all([
    UnidadesAPI.getAll(),
    UnidadesAPI.init(),
    UsuariosServidoresAPI.init()
  ]);
  state.unidades = response[0];

  appendHeaderContent();
  appendMainContent();
  appendModals();

  state.addModal  = new bootstrap.Modal('#divModalAdd');
  state.editModal = new bootstrap.Modal('#divModalEdit');

  hydrateFilterSelects();
  hydrateModalSelects();

  await loadData();
  bindEvents();
}

async function loadData() {
  const response = await UsuariosServidoresAPI.getPaginated({
    page     : state.page,
    pageSize : state.pageSize,
    filters  : state.filters
  });
  state.lastData = response;
  refreshTable(response.data);
  refreshPagination(response.pagination);
}

/* ---------- Rendering ---------- */
function appendHeaderContent() {
  // --- Top Options Section ---
  const $topOptions = $('<section>', { class: 'mx-5rem top-options container-fluid d-flex justify-content-between align-items-center gap-3 bg-white' }).append(
    $('<div>', { id: 'divMensagem' }),
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
  const $header = $('<section>', { class: 'mx-5rem mt-2 ps-2 d-flex flex-column' }).append(
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
  $('#page-header').append($topOptions, $navbar, $header);
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
        createFilterItem('cmbFilterUnidade', 'Unidade'),
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
        $('<thead>').append(thead), 
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
  $('#page-main').append($filters, $dataSection);
}

function appendModals() {
  function createField(field) {
    const $col = $('<div>', { class: field.col || 'col-md-6' });

    if (field.label) {
      $col.append($('<label>', { for: field.id, class: 'form-label', text: field.label }));
    }

    const baseProps = { id: field.id, class: field.class || 'form-control', required: !!field.required };

    let $control;
    switch (field.type) {
      case 'select' : $control = $('<select>', baseProps); break;
      case 'hidden' : $control = $('<input>', { ...baseProps, type: 'hidden' }); break;
      default       : $control = $('<input>', { ...baseProps, type: field.type });
    }

    $col.append($control);
    return $col;
  }

  function createModal(id, title, formId, fields) {
    const $modal = $('<div>', { id, class: 'modal fade', tabindex: '-1', 'aria-hidden': 'true' });

    const $form = $('<form>', { id: formId });
    const $body = $('<div>', { class: 'modal-body' }).append($('<div>', { class: 'row g-3' }).append(fields.map(createField)));

    const $footer = $('<div>', { class: 'modal-footer' }).append(
      $('<button>', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal', text: 'Cancelar' }),
      $('<button>', { type: 'button', class: 'btn btn-primary', id: formId === 'addForm' ? 'btnAddSave' : 'btnEditSave', text: 'Salvar', disabled: true })
    );
    $form.append($body);

    const $content = $('<div>', { class: 'modal-content' }).append(
      $('<div>', { class: 'modal-header' }).append(
        $('<h5>', { class: 'modal-title', text: title }),
        $('<button>', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal' })
      ), $form, $footer
    );

    return $modal.append($('<div>', { class: 'modal-dialog modal-lg modal-dialog-centered' }).append($content));
  }

  const addFields = [
    { id: 'txtAddNome', label: 'Nome', type: 'text', required: true },
    { id: 'txtAddLogin', label: 'Login', type: 'text', required: true },
    { id: 'cmbAddUnidade', label: 'Unidade', type: 'select', col: 'col-md-12' },
    { id: 'cmbAddFuncao', label: 'Função', type: 'select' },
    { id: 'cmbAddCargo', label: 'Cargo', type: 'select' },
    { id: 'cmbAddEspecialidade', label: 'Especialidade', type: 'select', col: 'col-md-12' }
  ];

  const editFields = [
    { id: 'hiddenEditId', type: 'hidden' },
    { id: 'txtEditNome', label: 'Nome', type: 'text', required: true },
    { id: 'txtEditLogin', label: 'Login', type: 'text', required: true },
    { id: 'cmbEditUnidade', label: 'Unidade', type: 'select', required: true },
    { id: 'cmbEditFuncao', label: 'Função', type: 'select' },
    { id: 'cmbEditCargo', label: 'Cargo', type: 'select' },
    { id: 'cmbEditEspecialidade', label: 'Especialidade', type: 'select', col: 'col-md-12' }
  ];

  $('#page-modals')
    .append(createModal('divModalAdd', 'Novo Usuário Servidor', 'addForm', addFields))
    .append(createModal('divModalEdit', 'Editando Usuário Servidor', 'editForm', editFields));
}

function hydrateFilterSelects() {
  populateUnidadesSelect('#cmbFilterUnidade', state.unidades);  

  populateSelectFromEnum('#cmbFilterFuncao', FuncaoUsuario, true, 'Todas');
  populateSelectFromEnum('#cmbFilterCargo', CargoUsuario, true, 'Todos');
  populateSelectFromEnum('#cmbFilterEspecialidade', Especialidade, true, 'Todas');
}

function hydrateModalSelects() {
  populateSelectFromEnum('#cmbAddFuncao', FuncaoUsuario, false);
  populateSelectFromEnum('#cmbAddCargo', CargoUsuario, false);
  populateSelectFromEnum('#cmbAddEspecialidade', Especialidade, false);

  populateSelectFromEnum('#cmbEditFuncao', FuncaoUsuario, false);
  populateSelectFromEnum('#cmbEditCargo', CargoUsuario, false);
  populateSelectFromEnum('#cmbEditEspecialidade', Especialidade, false);
}

function refreshTable(list) {
  const tbody = $('#dataRows').empty();

  if (!list.length) {
    tbody.append('<tr><td colspan="6">Nenhum registro</td></tr>');
    return;
  }

  list.forEach(u => {
    tbody.append(`
      <tr>
        <td title="${u.nome}">${u.nome}</td>
        <td>${u.login}</td>
        <td>${u.sigla}</td>

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

function refreshPagination(p) {
  const start         = (p.page - 1) * p.pageSize + 1;
  const end           = Math.min(start + p.pageSize - 1, p.totalRecords);
  const prevDisabled  = p.page === 1 ? 'disabled' : '';
  const nextDisabled  = p.page === p.totalPages ? 'disabled' : '';

  const $navInfo  = $('#navInfo');
  const $ul       = $('#navControls');
  $ul.empty();

  $navInfo.text(
    `Mostrando ${start} - ${end} de ${p.totalRecords} registros`
  );

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
   if (!Array.isArray(list)) {
    $('#divMensagem').text(`[populateUnidadesSelect] Erro ao popular ${selectId}: lista vazia.`);
    return;
  }
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
  $('#btnApplyFilter').on('click', onBtnApplyFilters_clicked);
  $('#btnClearFilter').on('click', onBtnClearFilters_clicked);

  $('#dataRows')
    .on('click', '.js-edit', onBtnEdit_clicked)
    .on('click', '.js-delete', onBtnDelete_clicked);

  $('#navControls').on('click', 'a.page-link', onNavControl_clicked);  

  $('#btnAddNew').on('click', onBtnAdd_clicked);
  $('#btnAddSave').on('click', onBtnSaveNew_clicked);
  $('#addForm').on('input change', onModalAdd_inputChanged);

  $('#btnEditSave').on('click', onBtnUpdate_clicked);
}

async function onBtnAdd_clicked(e) {
  try {
    $('#addForm')[0].reset();
    $('#btnAddSave').prop('disabled', true);

    populateUnidadesSelect('#cmbAddUnidade', state.unidades);  

    state.addModal.show();
  } catch (err) {
    const msg = 'Erro ao abrir Modal de Adição';
    console.error(`${msg}: ${err}`);
    alert(`${msg}. `);
  }
}

async function onBtnEdit_clicked(e) {
  try {
    const id = $(e.currentTarget).data('id');
    const u = await UsuariosServidoresAPI.getById(id);
    if (!u) return;

    $('#hiddenEditId').val(u.id);
    $('#txtEditNome').val(u.nome);
    $('#txtEditLogin').val(u.login);
    $('#cmbEditUnidade').val(u.unidade);
    $('#cmbEditFuncao').val(u.funcao ?? '');
    $('#cmbEditCargo').val(u.cargo ?? '');
    $('#cmbEditEspecialidade').val(u.especialidade ?? '');

    $('#btnEditSave').prop('disabled', false);

    state.editModal.show();
  } catch (err) {
    const msg = 'Erro ao abrir Modal de Edição';
    console.error(`${msg}: ${err}`);
    alert(`${msg}. `);
  }
}

async function onBtnSaveNew_clicked() {
  const msg = validateNew();
  if (msg) {
    alert(msg);
    return;
  }

  await UsuariosServidoresAPI.create({
    unidadeID      : $('#cmbAddUnidade').val(),
    nome           : $('#txtAddNome').val(),
    login          : $('#txtAddLogin').val(),
    funcao         : $('#cmbAddFuncao').val(),
    cargo          : $('#cmbAddCargo').val(),
    especialidade  : $('#cmbAddEspecialidade').val(),
    criadoPor      : state.currentUser.id,
    criadoEm       : new Date().toISOString()
  });
  state.addModal.hide();
  loadData();
}

async function onBtnUpdate_clicked() {
  const id  = $('#hiddenEditId').val();
  const msg = validateEdit(id);
  if (msg) {
    alert(msg);
    return;
  }
  await UsuariosServidoresAPI.update(id, {
    nome          : $('#txtEditNome').val(),
    login         : $('#txtEditLogin').val(),
    hierarquiaID  : $('#cmbEditUnidade').val(),
    funcao        : $('#cmbEditFuncao').val(),
    cargo         : $('#cmbEditCargo').val(),
    especialidade : $('#cmbEditEspecialidade').val(),
    alteradoPor   : state.currentUser.id,
    alteradoEm    : new Date().toISOString()
  });
  state.editModal.hide();
  loadData();
}

async function onBtnDelete_clicked(e) {
  const id = $(e.currentTarget).data('id');
  if (!confirm(confirmDeleteMSG)) return;

  await UsuariosServidoresAPI.softDelete(id, {
    excluidoPor   : state.currentUser.id,
    excluidoEm    : new Date().toISOString()
  });
  loadData();
}

async function onNavControl_clicked(e) {
    e.preventDefault();

    const page = Number($(this).data('page'));
    if (!page || page === state.page) return;

    state.page = page;
    loadData();
}

function onBtnApplyFilters_clicked() {
  state.filters = {
    unidade       : $('#txtFilterUnidade').val() || null,
    cargo         : $('#cmbFilterCargo').val() || null,
    funcao        : $('#cmbFilterFuncao').val() || null,
    especialidade : $('#cmbFilterEspecialidade').val() || null
  };
  state.page = 1;
  loadData();
}

function onBtnClearFilters_clicked() {
  $('#cmbFilterCargo').val('');
  $('#cmbFilterFuncao').val('');
  $('#cmbFilterEspecialidade').val('');

  state.filters = {};
  state.page = 1;
  loadData();
}

function onModalAdd_inputChanged() {
  const valid = $('#txtAddNome').val().trim().length > 0 &&
                $('#txtAddLogin').val().trim().length > 0;

  $('#btnAddSave').prop('disabled', !valid);
}

function validateNew() {
  if (!$('#cmbAddUnidade').val())       { return 'Informe a unidade.'; } 
  if (!$('#txtAddNome').val())          { return 'Informe o nome.'; } 
  if (!$('#txtAddLogin').val())         { return 'Informe o login.'; } 
  if (!$('#cmbAddFuncao').val())        { return 'Informe uma função.'; } 
  if (!$('#cmbAddCargo').val())         { return 'Informe um cargo.'; } 
  if (!$('#cmbAddEspecialidade').val()) { return 'Informe uma especialidade.'; } 
  return '';
}

function validateEdit(id) {
  if (!$('#cmbEditUnidade').val())       { return 'Unidade inválida.'; } 
  if (!$('#txtEditNome').val())          { return 'Nome inválido.'; } 
  if (!$('#txtEditLogin').val())         { return 'Login inválido.'; } 
  if (!$('#cmbEditFuncao').val())        { return 'Função inválida.'; } 
  if (!$('#cmbEditCargo').val())         { return 'Cargo inválido.'; } 
  if (!$('#cmbEditEspecialidade').val()) { return 'Especialidade inválida.'; } 
  return '';
}

/* ---------- Public ---------- */
export const UsuarioServidorGateway = {
  init,
  applyFilter(filters) {
    state.filters = filters;
    state.page = 1;
    loadData();
  },
  refresh: loadData
};
