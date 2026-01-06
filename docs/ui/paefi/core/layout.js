// ui.paefi.core.layout

import { Session, CurrentUserKey,
         Local, LastModuleKey, LastDomainKey
       } from '../../../services/storage.js';
import { LeftSidebar }               from './leftSidebar.js';
import { Modulo, Dominio } from './enums.js';

let currentModule;
let currentDomain;
const currentUser = Session.Get(CurrentUserKey);

function init() {
  resolveCurrentModule();
  resolveCurrentDomain();

  renderStructure();
  LeftSidebar.Init();
//  activateDomain(currentDomain.key);
}

function resolveCurrentDomain() {
  const lastKey = Local.Get(LastDomainKey);
  currentDomain = Dominio.All.find(x => x.Key === lastKey);

  if (!currentDomain || currentDomain.Key === Dominio.Nenhum.Key) {
    if (currentModule == Modulo.Admin) {
      currentDomain = Dominio.UsuariosServidores;
    }
    // resolver valor default para os outros módulos...
  }
}

function resolveCurrentModule() {
  const url     = window.location.href;
  currentModule = url.includes('index.html') 
               ? Modulo.Atender
               : url.includes('monitor.html') 
               ? Modulo.Monitor
               : url.includes('admin.html') 
               ? Modulo.Admin
               : Modulo.Nenhum; 
  Local.Set(LastModuleKey, currentModule.Key);
}

/* Rendering */
function renderStructure() {
  const $appHeader = $('<div>', { id: 'app-header', class: 'app-header' });
  appendNavbar($appHeader);

  const $appMain  = $('<main>', { id: 'app-main', class: 'app-main' });
  const $appBody   = $('<div>', { id: 'app-body', class: 'app-body' });
  $appBody.append($appMain);
  appendContents($appMain);

  $('#app-shell').append($appHeader, $appBody);
}

function appendNavbar(container) {

  // --- SIDS Top Navbar ---
  const $topNavbar = $('<div>', { id: 'top-navbar', class: 'top-navbar d-flex justify-content-between align-items-center' }).append(
    $('<div>', { class: 'mx-5rem d-flex align-items-center flex-grow-1 flex-nowrap gap-4' }).append(
      $('<span>', { text: 'Menu' }),
      $('<span>', { text: 'Home' }),
      $('<a>', { href: '../../', text: 'Assistência Social' }),
      $('<span>', { text: 'Segurança Alimentar' }),
      $('<span>', { text: 'Transferência de Renda' }),
      $('<span>', { text: 'Tutorial' })
    ),
    $('<span>', { id: 'txtUser-login', class: 'mx-4rem', text: currentUser.login })
  );
  container.append($topNavbar)
}

function appendContents(container) {
  // --- Title bar : breadcrumbs & page info ---
  const $titleBar = $('<div>', { id: 'page-title-bar', 
    class: 'page-title-bar mx-2 mt-2 ps-2 d-flex flex-column' }).append(
    $('<div>', { 
      class: 'breadcrumbs d-flex justify-content-start align-items-center gap-2' }).append(
      $('<a>', { href: '#', text: 'Home' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' }),
      $('<a>', { href: '../../', text: 'Assistência Social' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' }),
      $('<span>', { text: 'Gestão do PAEFI' }),
      $('<i>', { class: 'fa fa-angle-right fa-1x' })
    ),
    $('<span>', { id: 'page-title-text', class: 'page-title-text', text: currentModule.Value })
  );
  
  const $pageContents = $('<div>', { id: 'page-contents', 
    class: 'page-contents d-flex flex-column mb-3' })
    .append($titleBar);

  container.append($pageContents);
}

function renderDomain() {
  $('#page-contents').append(domainTitleBar());

  if (currentModule == Modulo.Admin) {
    $('#page-contents').append(
        filtersSection(),
        dataSection()
    );
  }
}

function domainTitleBar() {
  return $('<div>', { class: 'mx-2 mt-2 ps-2 d-flex flex-column' }).append(
    $('<span>', { id:'domain-title', class: 'domain-title', text: currentDomain.Value })
  );
}

function filtersSection() {
  return $('<div>', { class: 'filters-bar mx-2' }).append(
    $('<div>', { id:'divFilterOptions', class: 'filter-options p-2 d-flex gap-3' }).append(
        $('<span>', { text: 'Inclua os filtros aqui'})
    ),
    $('<div>', { id:'divFilterButtons', class: 'filter-buttons p-2 d-flex gap-2' }).append(
      $('<button>', { id: 'btnApplyFilter', class: 'btn btn-primary btnApplyFilter', text: 'Filtrar' }),
      $('<button>', { id: 'btnClearFilter', class: 'btn btn-outline-secondary btnClearFilter', text: 'Limpar' })
    )
  );
}

function dataSection() {
    const $actions = $('<div>', { id: 'divDataActionButtons', class: 'mt-4 ms-2 divDataActionButtons d-flex justify-content-between align-items-center gap-3' }).append(
        $('<div>', { id: 'divDataActionButtons-left', class: 'action-buttons-left d-flex align-items-center gap-3' }).append(
            $('<button>', { id: 'btnAddNew', class: 'btn btn-primary' }).append(
                $('<i>', { class: 'fas fa-plus' }), ' Incluir')
        ),
        $('<div>', { id: 'divDataActionButtons-right', class: 'action-buttons-right d-flex align-items-center gap-3' }).append(
            $('<button>', { class: 'btn btn-terciary', id: 'btnExport' }).append(
                $('<i>', { class: 'fas fa-download' }), ' Exportar')
    ));
    
    const $table = $('<div>', { id:'divdataTable', class: 'divdataTable mt-0 ms-2 table-responsive' }).append(
        $('<span>', { text: 'Inclua a tabela aqui' })
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

export function BuildTable(columns) {
   const $table = $('<table>', { class: 'table table-striped table-hover' }).append(
   $('<thead>').append(thead), 
    $('<tbody>', { id: 'dataRows' }).append(
      $('<tr>').append($('<td>', { colspan: colSpan, 
        class: 'text-center text-muted', text: 'Carregando...' }))
    )
  );
  const $container = $('#divdataTable').empty();
  $container.append($table);
}

$(document).ready(async () => {
  if (!currentUser) {
      alert('Usuário não localizado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return;
  }
  init(); 
});