//ui/paefi/gateway/coreAdmin.js (module)
import { Session, CurrentUserKey }  from '../../../services/storage.js';
import { Core }                     from '../shell/core.js';

const currentUser = Session.Get(CurrentUserKey);

function init() {
    Core.Init(currentUser, 'Admin');
    $('#page-contents').append(
        domainTitleBar(), 
        filtersSection(),
        dataSection()
    );
    $('#domain-title').text('Current Domain');
}

function sampleTable() {
    const columns = [
        { key: 'nome',          label: 'Nome' },
        { key: '__actions',     label: 'Ações' }
    ];
    const thead      = $('<tr>').append(columns.map(c => $('<th>').text(c.label)));
    const colSpan    = columns.length;
}

function domainTitleBar() {
  return $('<div>', { class: 'mx-2 mt-2 ps-2 d-flex flex-column' }).append(
    $('<span>', { id:'domain-title', class: 'domain-title', text: 'current DomainTitle' })
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
    return $('<section>', { id: 'dataSection', class: 'data-section mx-2' }).append(
    // Action Buttons
    $('<div>', { id: 'divDataActionButtons', 
        class: 'mt-4 ms-2 action-buttons d-flex justify-content-between align-items-center gap-3' }).append(
      $('<div>', { id: 'divDataActionButtons-left', 
        class: 'action-buttons-left d-flex align-items-center gap-3 flex-grow-1 flex-nowrap' }).append(
        $('<button>', { id: 'btnAddNew', 
        class: 'btn btn-primary' }).append($('<i>', { class: 'fas fa-plus' }), ' Incluir')
      ),
      $('<div>', { id: 'divDataActionButtons-right', 
        class: 'action-buttons-right d-flex justify-content-end align-items-end gap-3' })
    ),
    // Table
    $('<div>', { id: 'divDataTable', class: 'divDataTable mt-0 ms-2 table-responsive' })).append(
        $('<span>', { text: 'Inclua a tabela aqui'})
    ),
    // Pagination
    $('<div>', { id: 'divPagination-section', 
        class: 'pagination-section d-flex justify-content-between align-items-center' }).append(
      $('<div>', { id: 'divPagination-info', 
        class: 'pagination-info' }).append($('<span>', { id: 'navInfo' })),
      $('<nav>').append($('<ul>', { id: 'navControls', class: 'pagination mb-0' }))
    );
}

$(document).ready(async () => {
    console.log(currentUser);
    if (!currentUser) {
        alert('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
    init(); 
});
