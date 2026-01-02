// ui/paefi/shell/leftSidebar.js

export const LeftSidebar = { init };

function init() {
  renderSidebar();
  wireToggle();
  syncHeights();

  window.addEventListener('resize', syncHeights);
}

/* ---------- Sidebar ---------- */
function renderSidebar() {
  const $sidebar = $('<aside>', { id: 'leftSidebar' });

  const $header = $('<div>', { class: 'p-2 border-bottom d-flex justify-content-between align-items-center' }).append(
    $('<span>', { text: 'PAEFI', class: 'fw-bold' }),
    $('<button>', {
      class: 'btn btn-sm btn-outline-secondary',
      id: 'btnSidebarToggle',
      title: 'Expandir / Recolher'
    }).append($('<i>', { class: 'fas fa-bars' }))
  );

  const $body = $('<div>', { class: 'leftSidebar-body p-2' }).append(
    $('<div>', { class: 'leftSidebar-top' }).append(
      accordionSection('Navegação', true)
    ),
    $('<div>', { class: 'leftSidebar-bottom' }).append(
      accordionSection('Preferências'),
      accordionSection('Documentação')
    )
  );
  $sidebar.append($header, $body);
  $('#shell-left').append($sidebar);
}

/* ---------- Accordion ---------- */
function accordionSection(title, expanded = false) {
  const id = `ls-${title.toLowerCase()}`;

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
      $('<div>', {
        id,
        class: `accordion-collapse collapse ${expanded ? 'show' : ''}`
      }).append(
        $('<div>', { class: 'accordion-body text-muted', text: '[em breve]' })
      )
    )
  );
}

/* ---------- Behavior ---------- */
function wireToggle() {
  $('#btnSidebarToggle').on('click', () => {
    $('#leftSidebar').toggleClass('collapsed');
  });
}

function syncHeights() {
  const navbarHeight = $('#top-navbar').outerHeight() || 0;
  $('#leftSidebar').css('height', `calc(100vh - ${navbarHeight}px)`);
}
