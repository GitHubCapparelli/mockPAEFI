// ui.paefi.core.utils

import { Modulo, Elemento } from './omEnum.js';

/* Helper shared global methods */

// previously PopulateSelectFromEnum()
export function EnumToSelect(selectId, enumType, includeEmpty = true, emptyLabel = 'Selecione...', excludeKeys = []) {
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

export function PageStructure() {
  const $appHeader = $('<div>', { id: 'app-header', class: 'app-header' })
    .append(navbar());

  const $appBody = $('<div>', { id: 'app-body', class: 'app-body' })
    .append(leftSidebar() , pageContents());

  $('#app-shell').append($appHeader, $appBody);
}

export function DomainStructure(moduleKey) {
  if (moduleKey == Modulo.Admin.Key) {
    $('#page-contents').append(
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
  const $moduleInfo = $('<div>', { id: 'page-title-bar', class: 'page-title-bar mx-2 mt-2 ps-2 d-flex flex-column' })
    .append($('<div>', { class: 'breadcrumbs d-flex justify-content-start align-items-center gap-2' })
      .append(
        $('<a>', { href: '#', text: 'Home' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' }),
        $('<a>', { href: '../../', text: 'Assistência Social' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' }),
        $('<span>', { text: 'Gestão do PAEFI' }),
        $('<i>', { class: 'fa fa-angle-right fa-1x' })
      ),
      $('<span>', { id: 'page-title-text', class: 'page-title-text', text: 'Página' })
    );

  const $domainTitle = $('<div>', { class: 'mx-2 mt-2 ps-2 d-flex flex-column' }).append(
    $('<span>', { id: 'domain-title', class: 'domain-title', text: 'Opção' })
  );

  return $('<div>', { id: 'page-contents', class: 'page-contents d-flex flex-column mb-3' })
    .append($moduleInfo, $domainTitle);
}

function divFilters() {
  return $('<div>', { class: 'filters-bar mx-2' }).append(
    $('<div>', { id: 'divFilterOptions', class: 'filter-options p-2 d-flex gap-3' }).append(
      $('<span>', { text: 'Filtros' })
    ),
    $('<div>', { id: 'divFilterButtons', class: 'filter-buttons p-2 d-flex gap-2' }).append(
      $('<button>', { id: 'btnApplyFilter', class: 'btn btn-primary btnApplyFilter', text: 'Filtrar' }),
      $('<button>', { id: 'btnClearFilter', class: 'btn btn-outline-secondary btnClearFilter', text: 'Limpar' })
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

  const $table = $('<div>', { id: 'divdataTable', class: 'divdataTable mt-0 ms-2 table-responsive' }).append(
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

function leftSidebar() {
  const $sidebar = $( '<aside>', { id: 'leftSidebar', class: 'leftSidebar' });

  const $header  = $( '<div>', { class: 'p-2 d-flex justify-content-between align-items-center' })
                    .append($('<button>', { id: 'btnSidebarToggle', 
                                            class: 'btn btn-sm btn-outline-secondary',
                                            title: 'Expandir / Recolher' }
                            ).append( $( '<i>', { class: 'fas fa-bars' } ))
                            ,
                            $( '<span>', { id: 'leftSidebar-title', class: 'leftSidebar-title fw-bold', text: 'PAEFI' })
                    );

  const $body = $( '<div>', { id: 'leftSidebar-body', class: 'leftSidebar-body p-2' })
                .append( $(' <div>', { class: 'leftSidebar-top' }
                          ).append( accordionOptions( true ))
                          ,
                          $(' <div>', { class: 'leftSidebar-bottom' }
//                          ).append(accordionSection('Preferências', false, renderPreferences)
                           ).append( accordionSection( 'Preferências' )
                                   , accordionSection( 'Documentação' )
    )
  );
  $sidebar.append($header, $body);
  return $sidebar;
}

export function Options(options) {
  const container = $(Elemento.DivOpcoesDominio.Key);
  options.forEach(opt => {
    $('<button>', {
      class: 'btn btn-sm btn-outline-primary w-100 mb-2',
      text: opt.Value,
      'data-domain': opt.Key
    }).appendTo(container);
  });
}

function accordionOptions(expanded = false) {
  const $body = $('<div>', {
    class: `accordion-collapse collapse ${expanded ? 'show' : ''}`
  }).append($('<div>', { id: Elemento.DivOpcoesDominio.Key, class: 'accordion-body', text: '[em breve]' }));

  return $('<div>', { class: 'accordion mb-2' }).append(
    $('<div>', { class: 'accordion-item' }).append(
      $('<h2>', { class: 'accordion-header' }).append(
        $('<button>', {
          class: `accordion-button ${expanded ? '' : 'collapsed'}`,
          'data-bs-toggle': 'collapse',
          'data-bs-target': `#${Elemento.DivOpcoesDominio.Key}`,
          type: 'button',
          text: Elemento.DivOpcoesDominio.Value
        })
      ),
      $body
    )
  );
}

function accordionSection(title, expanded = false, contentRenderer) {
  const id = `ls-${title.toLowerCase()}`;

  const $body = $('<div>', {
    id, class: `accordion-collapse collapse ${expanded ? 'show' : ''}`
  }).append($('<div>', { class: 'accordion-body' }));

//  if (contentRenderer) {
//    contentRenderer($body.find('.accordion-body'));
//  } else {
//    $body.find('.accordion-body').text('[em breve]');
//  }

  $body.find('.accordion-body').text('[em breve]');

  return $('<div>', { class: 'accordion mb-2' }).append(
    $('<div>', { class: 'accordion-item' }).append(
      $('<h2>', { class: 'accordion-header' }).append(
        $('<button>', {
          class: `accordion-button ${expanded ? '' : 'collapsed'}`,
          'data-bs-toggle': 'collapse',
          'data-bs-target': `#${id}`,
          type: 'button',
          text: title
        })
      ),
      $body
    )
  );
}

function renderPreferences($container, prefs) {
//  const prefs = loadPrefs();
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

  $container.append($darkMode, $resumeDomain);
}


export function BuildTable(columns) {
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

export const Render = { 
  Options,
  EnumToSelect,
  PageStructure,
  DomainStructure,
  BuildTable
};
