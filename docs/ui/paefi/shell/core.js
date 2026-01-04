// ui/paefi/shell/core.js
import { LeftSidebar }              from './leftSidebar.js';

/* Rendering */
function renderStructure(pageTitle) {
  const $appHeader = $('<div>', { id: 'app-header', class: 'app-header' });
  appendNavbar($appHeader);

  const $appMain  = $('<main>', { id: 'app-main', class: 'app-main' });
  const $appBody   = $('<div>', { id: 'app-body', class: 'app-body' });
  $appBody.append($appMain);
  appendContents($appMain, pageTitle);

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

function appendContents(container, pageTitle) {
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
    $('<span>', { id: 'page-title-text', class: 'page-title-text', text: pageTitle })
  );
  
  const $pageContents = $('<div>', { id: 'page-contents', 
    class: 'page-contents d-flex flex-column mb-3' }).append($titleBar);

  container.append($pageContents);
}

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

export function Init(pageTitle) {
  renderStructure(pageTitle);
  LeftSidebar.Init();
}

export const Core = { 
  Init,
  EnumToSelect
};
