//ui/paefi/gateway/coreAdmin.js (module)
import { Session, CurrentUserKey }  from '../../../services/storage.js';
import { Core }                     from '../shell/core.js';

const currentUser = Session.Get(CurrentUserKey);

function init() {
    const $container = $('#page-contents');
    renderDomainTitleBar($container, 'Current Domain');
    renderFiltersSection($container);
}

function renderDomainTitleBar(container, currentDomainTitle) {
  const $div = $('<div>', {
    class: 'domain-title-text mx-2 mt-2 ps-2 d-flex flex-column'
  }).append(
    $('<span>', { class: 'domain-title-text', text: currentDomainTitle })
  );
  container.append($div);
}

function renderFiltersSection(container) {
  const $div = $('<div>', { class: 'filters-bar mx-2' }).append(
    $('<div>', { class: 'filter-options p-2 d-flex gap-3' }),
    $('<div>', { class: 'filter-buttons p-2 d-flex gap-2' }).append(
      $('<button>', { id: 'btnApplyFilter', class: 'btn btn-primary btnApplyFilter', text: 'Filtrar' }),
      $('<button>', { id: 'btnClearFilter', class: 'btn btn-outline-secondary btnClearFilter', text: 'Limpar' })
    )
  );
  container.append($div);
}

$(document).ready(async () => {
    console.log(currentUser);
    if (!currentUser) {
        alert('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
    Core.Init(currentUser, 'Admin');
    init(); 
});
