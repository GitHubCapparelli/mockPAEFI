// ui.paefi.core.renderer

import { Modulo, Elemento } from './omEnum.js';

// Layout structure //
export function PageStructure() {
  const $appHeader = $('<div>', { id: 'app-header', class: 'app-header' })
    .append(navbar());

  const $appBody = $('<div>', { id: 'app-body', class: 'app-body' })
    .append(leftSidebar(), pageContents());

  $('#app-shell').append($appHeader, $appBody);
}

export function DomainStructure(moduleKey) {
  const $pageBody = $('#page-body').empty();
  if (moduleKey == Modulo.Admin.Key) {
    $pageBody.append(
      divFilters(),
      datagrid()
    );
  }
}

function navbar() {
  // --- SIDS Top Navbar ---
  return $('<div>', { id: 'top-navbar', class: 'top-navbar d-flex justify-content-between align-items-center' }).append(
    $('<div>', { class: 'mx-5rem d-flex align-items-center flex-grow-1 flex-nowrap gap-4' }).append(
      $('<span>', { text: 'Menu' }),
      $('<span>', { text: 'Home' }),
      $('<a>', { href: '../../', text: 'Assistência Social' }),
      $('<span>', { text: 'Segurança Alimentar' }),
      $('<span>', { text: 'Transferência de Renda' }),
      $('<span>', { text: 'Tutorial' })
    ),
    $('<span>', { id: 'txtUser-login', class: 'mx-4rem', text: 'user.login' })
  );
}

function pageContents() {
  // --- Title bar : breadcrumbs & page info ---
  const $pageTop = $('<div>', { id: 'page-title-bar', class: 'page-title-bar mx-2 mt-2 ps-2 d-flex justify-content-between' })
    .append($('<div>', { class: 'breadcrumbs d-flex justify-content-start align-items-center gap-2' })
      .append(
        $('<a>', { href: '#', text: 'Home' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' }),
        $('<a>', { href: '../../', text: 'Assistência Social' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' }),
        $('<span>', { text: 'Gestão do PAEFI' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' })
      ),
      $('<span>', { id: 'page-title-text', class: 'page-title-text', text: 'Página | Módulo' })
    );

  const $pageHeader   = $('<div>', { id: 'page-header', class: 'page-header mx-2 mt-2 ps-2 d-flex flex-column' })
    .append(
      $pageTop,
      $('<span>', { id: 'domain-title', class: 'mx-2 ps-1 domain-title', text: 'Opção | Domínio' }));

  const $pageBody     = $('<div>', { id: 'page-body', class: 'page-body mx-2 mt-2 ps-2 d-flex flex-column' });

  const $pageContents = $('<div>', { id: 'page-contents', class: 'page-contents d-flex flex-column mb-3' });
  $pageContents.append($pageHeader, $pageBody);

  return $pageContents;
}


// left sidebar //
function leftSidebar() {
  const $sidebar = $('<aside>', { id: 'leftSidebar', class: 'leftSidebar' });

  const $header = $('<div>', { class: 'p-2 d-flex justify-content-between align-items-center' })
    .append($('<button>', {
      id: 'btnSidebarToggle',
      class: 'btn btn-sm btn-outline-secondary',
      title: 'Expandir / Recolher'
    }
    ).append($('<i>', { class: 'fas fa-bars' }))
      ,
      $('<span>', { id: 'leftSidebar-title', class: 'leftSidebar-title fw-bold', text: 'PAEFI' })
    );

  const $body = $('<div>', { id: 'leftSidebar-body', class: 'leftSidebar-body p-2 overflow-auto' })
    .append($(' <div>', { class: 'leftSidebar-top' }
    ).append(accordion(Elemento.DivOpcoesDominio, true))
      ,
      $(' <div>', { class: 'leftSidebar-bottom' }
      ).append(accordion(Elemento.DivPreferencias)
        , accordion(Elemento.DivOurDocs)
      )
    );
  $sidebar.append($header, $body);
  return $sidebar;
}

function accordion(elemento, expanded = false) {
  const $body = $('<div>', {
    class: `accordion-collapse collapse ${expanded ? 'show' : ''}`
  }).append($('<div>', { id: `collapse-${elemento.Key}`, 
    class: 'accordion-body', text: '[em breve]' }));

  return $('<div>', { class: 'accordion accordion-flush mb-2' }).append(
    $('<div>', { class: 'accordion-item' }).append(
      $('<h2>', { class: 'accordion-headers shadow-none' }).append(
        $('<button>', {
          class: `accordion-button ${expanded ? '' : 'collapsed'}`,
          'data-bs-toggle': 'collapse',
          'data-bs-target': `#collapse-${elemento.Key}`,
          type: 'button',
          text: elemento.Value
        })
      ),
      $body
    )
  );
}

export function Options(options) {
  const container = $(Elemento.DivOpcoesDominio.JQuery).empty();
  options.forEach(opt => {
    container.append($('<button>', { class: 'btn btn-sm btn-outline-primary border-0 w-100 mb-2', text: opt.Value, 'data-domain': opt.Key }));
  });
}

function Preferences(prefs) {
  const $darkMode = $('<div>', { class: 'form-check form-switch mb-2' }).append(
    $('<input>', {
      id: 'chkDarkMode', type: 'checkbox', class: 'form-check-input',
      checked: prefs.theme === 'dark'
    }), $('<label>', { class: 'form-check-label', for: 'chkDarkMode', text: 'Modo escuro' })
  );

  const $resumeDomain = $('<div>', { class: 'form-check form-switch' }).append(
    $('<input>', {
      id: 'chkResumeDomain', type: 'checkbox', class: 'form-check-input',
      checked: !!prefs.resumeLastDomain
    }), $('<label>', {
      class: 'form-check-label', for: 'chkResumeDomain',
      text: 'Lembrar última opção'
    }));

  const container = $(`#${Elemento.DivPreferencias.Key}`).empty();
  container.append($darkMode, $resumeDomain);
}

function OurDocs() {
  const container = $(Elemento.DivOurDocs.JQuery).empty();
  OurDocs.All.forEach(opt => {
    container.append($('<button>', { id: opt.Key, class: 'btn btn-sm btn-outline-primary border-0 w-100 mb-2', text: opt.Value }));
  });
}

// filters and tables (admin) //
function divFilters() {
  return $('<div>', { class: 'filters-bar mx-1' }).append(
    $('<div>', { id: 'divFilterOptions', class: 'filter-options p-2 d-flex gap-3' }).append(
      $('<span>', { text: 'Filtros' })
    )
  );
}

function datagrid() {
  const $actions = $('<div>', { id: 'divDataActionButtons', class: 'mt-4 ms-2 divDataActionButtons d-flex justify-content-between align-items-center gap-3' }).append(
    $('<div>', { id: 'divDataActionButtons-left', class: 'action-buttons-left d-flex align-items-center gap-3' }).append(
      $('<button>', { id: 'btnAddNew', class: 'btn btn-primary' }).append(
        $('<i>', { class: 'fas fa-plus' }), ' Incluir')
    ),
    $('<div>', { id: 'divDataActionButtons-right', class: 'action-buttons-right d-flex align-items-center gap-3' }).append(
      $('<button>', { class: 'btn btn-terciary', id: 'btnExport' }).append(
        $('<i>', { class: 'fas fa-download' }), ' Exportar')
    ));

  const $table = $('<div>', { id: 'divdataTable', class: 'divdataTable mt-2 ms-2 table-responsive' }).append(
    $('<span>', { text: 'Dados' })
  );

  const $nav = $('<div>', { id: 'divPagination-section', class: 'pagination-section d-flex justify-content-between align-items-center' }).append(
    $('<div>', { id: 'divPagination-info', class: 'pagination-info' }).append(
      $('<span>', { id: 'navInfo', text: 'nav info' })
    ),
    $('<nav>').append(
      $('<ul>', { id: 'navControls', class: 'pagination mb-0' })
    ));

  return $('<section>', { id: 'dataSection', class: 'data-section mx-2' })
    .append($actions, $table, $nav);
}

export function Table(columns) {
  const thead = columns.map(c => `<th>${c.label}</th>`).join('');
  const colSpan = columns.length;

  const $table = $('<table>', { class: 'table table-striped table-hover' }).append(
    $('<thead>').append(thead),
    $('<tbody>', { id: 'dataRows' }).append(
      $('<tr>').append($('<td>', {
        colspan: colSpan,
        class: 'text-center text-muted', text: 'Carregando...'
      }))
    )
  );
  const $container = $('#divdataTable').empty();
  $container.append($table);
}

export function Select(id, value) {
  return $('<select>', { id,  class: 'form-select form-select-sm'})
  .append($('<option>', { value: '', text: value }));
}

export function Info(p) {
  const start = (p.page - 1) * p.pageSize + 1;
  const end = Math.min(start + p.pageSize - 1, p.totalRecords);
  const prevDisabled = p.page === 1 ? 'disabled' : '';
  const nextDisabled = p.page === p.totalPages ? 'disabled' : '';

  const $navInfo = $('#navInfo');
  $navInfo.text(`Mostrando ${start} - ${end} de ${p.totalRecords} registros`);

  const $ul = $('#navControls').empty();
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

export function Enum(selector, enumType) {
  const $select = $(selector);
  enumType.All.forEach(e => $select.append($('<option>', { value: e.Key, text: e.Value })));
}

// Public interface //
export const Render = {
  PageStructure,
  DomainStructure,
  Options,
  Preferences,
  OurDocs,
  Select,
  Enum,
  Table,
  Info
};