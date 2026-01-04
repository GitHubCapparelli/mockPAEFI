//ui/paefi/shell/leftSidebar.js
import { Local, UserPreferencesKey } from '../../../services/storage.js';
import { CoreAdminGateway }          from '../gateway/coreAdminGateway.js';

/* Preferences (storage) */
function loadPrefs() { return Local.Get(UserPreferencesKey) || {}; }
function savePrefs(prefs) { Local.Set(UserPreferencesKey, prefs); }

/* Rendering */
function render() {
  const $sidebar = $('<aside>', { id: 'leftSidebar', class: 'leftSidebar' });
  const $header  = $('<div>', { 
    class: 'p-2 d-flex justify-content-between align-items-center'
  }).append(
    $('<button>', {
      id: 'btnSidebarToggle',
      class: 'btn btn-sm btn-outline-secondary',
      title: 'Expandir / Recolher'
    }).append($('<i>', { class: 'fas fa-bars' })),
    $('<span>', { id:'leftSidebar-title', class: 'leftSidebar-title fw-bold', text: 'PAEFI' })
  );

  const $body = $('<div>', { id:'leftSidebar-body', class: 'leftSidebar-body p-2' }).append(
    $('<div>', { class: 'leftSidebar-top' }).append(
      accordionSection('Opções', true, renderAdminOptions)
    ),
    $('<div>', { class: 'leftSidebar-bottom' }).append(
      accordionSection('Preferências', false, renderPreferences),
      accordionSection('Documentação')
    )
  );

  $sidebar.append($header, $body);
  $('#app-body').prepend($sidebar);

  syncHeights();
}

function renderAdminOptions($container) {
  const options = [
    { domain: 'usuariosServidores', label: 'Usuários Servidores' },
    { domain: 'unidades',           label: 'Unidades' }
  ];

  options.forEach(opt => {
    $('<button>', {
      class: 'btn btn-sm btn-outline-primary w-100 mb-2',
      text: opt.label,
      'data-domain': opt.domain
    }).appendTo($container);
  });
}

function accordionSection(title, expanded = false, contentRenderer) {
  const id = `ls-${title.toLowerCase()}`;

  const $body = $('<div>', { id, class: `accordion-collapse collapse ${expanded ? 'show' : ''}`
  }).append($('<div>', { class: 'accordion-body' }));

  if (contentRenderer) {
    contentRenderer($body.find('.accordion-body'));
  } else {
    $body.find('.accordion-body').text('[em breve]');
  }

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

function renderPreferences($container) {
  const prefs = loadPrefs();

  const $darkMode = $('<div>', { class: 'form-check form-switch mb-2' }).append(
    $('<input>', { id: 'chkDarkMode', type: 'checkbox', class: 'form-check-input', 
      checked: prefs.theme === 'dark'
    }), $('<label>', { class: 'form-check-label', for: 'chkDarkMode', text: 'Modo escuro' })
  );

  const $resumeDomain = $('<div>', { class: 'form-check form-switch' }).append(
    $('<input>', { id: 'chkResumeDomain', type: 'checkbox', class: 'form-check-input',
      checked: !!prefs.resumeLastDomain
    }), $('<label>', { class: 'form-check-label', for: 'chkResumeDomain', 
      text: 'Lembrar última opção'
    }));

  $container.append($darkMode, $resumeDomain);
}

/* Behavior */
function restoreState() {
  const prefs = loadPrefs();
  if (prefs.sidebarCollapsed) {
    $('#leftSidebar').addClass('collapsed');
  }
  applyTheme(prefs.theme || 'light');
}

function wireNavigation() {
  $(document).on('click', '[data-domain]', async function () {
    const domain = $(this).data('domain');

    try {
      await CoreAdminGateway.ActivateAdminGateway(domain);
    } catch (err) {
      console.error('[LeftSidebar] Navigation failed:', err);
      alert('Erro ao acessar a opção selecionada.');
    }
  });
}

function wirePreferences() {
  $('#btnSidebarToggle').on('click', () => {
    const prefs = loadPrefs();
    $('#leftSidebar').toggleClass('collapsed');
    prefs.sidebarCollapsed = $('#leftSidebar').hasClass('collapsed');
    savePrefs(prefs);
  });

  $('#chkDarkMode').on('change', function () {
    const prefs = loadPrefs();
    prefs.theme = this.checked ? 'dark' : 'light';
    savePrefs(prefs);
    applyTheme(prefs.theme);
  });

  $('#chkResumeDomain').on('change', function () {
    const prefs = loadPrefs();
    prefs.resumeLastDomain = this.checked;
    savePrefs(prefs);
  });
}

/* Theme */
function applyTheme(theme) {
  document.documentElement.setAttribute(
    'data-bs-theme',
    theme === 'dark' ? 'dark' : 'light'
  );
}

/* Layout */
function syncHeights() {
  const navbarHeight = $('#top-navbar').outerHeight() || 0;
  $('#leftSidebar').css('height', `calc(100vh - ${navbarHeight}px)`);
}

/* Public */
function Init() {
  render();
  restoreState();
  wireNavigation();
  wirePreferences();

  $(window).on('resize', syncHeights);
}

export const LeftSidebar = { Init };
