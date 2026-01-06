//ui.paefi.core.leftSidebar

import { Render }                      from './renderer.js';
import { Modulo, Dominio, Elemento }   from './omEnum.js';
import { Local, PreferencesKey }       from '../../../services/storage.js';

/* Preferences (storage) */
function loadPrefs()      { return Local.Get(PreferencesKey) || {}; }
function savePrefs(prefs) { Local.Set(PreferencesKey, prefs); }

/* Behavior */
function loadOpcoes(moduleKey) {
  if (moduleKey === Modulo.Admin.Key) {
    const options = Dominio.All.filter(x => x.Key !== Dominio.Nenhum.Key);
    Render.Options(options);
  }
}

function loadPreferences() {
  const prefs = loadPrefs();
  if (prefs.sidebarCollapsed) {
    $('#leftSidebar').addClass('collapsed');
  }
  applyTheme(prefs.theme || 'light');
}

function wireNavigation() {
  $(document).on('click', '[data-domain]', async function () {
    const domain = $(this).data('domain');

    //try {
    //  await CoreAdminGateway.ActivateAdminGateway(domain);
    //} catch (err) {
    //  console.error('[LeftSidebar] Navigation failed:', err);
    //  alert('Erro ao acessar a opção selecionada.');
    // }
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
export function Init(moduleKey) {
  loadOpcoes(moduleKey);
  loadPreferences();

  wireNavigation();
  wirePreferences();

  syncHeights();
  $(window).on('resize', syncHeights);
}

export const LeftSidebar = { Init };
