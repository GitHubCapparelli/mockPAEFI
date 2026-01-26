// ui paefi core leftSidebar

import { App }                         from './app.js';
import { Render }                      from './renderer.js';
import { Modulo, Dominio, Elemento }   from './omEnum.js';
import { Local, PreferencesKey }       from '../../../services/storage.js';

/* Preferences (storage) */
function getPreferences() { return Local.Get(PreferencesKey) || {}; }
function savePrefs(prefs) { Local.Set(PreferencesKey, prefs); }

/* Behavior */
function renderOpcoes(moduleKey) {
  const domains = (moduleKey === Modulo.Admin.Key) 
                ? [
                  Dominio.Unidades,
                  Dominio.Servicos,
                  Dominio.Processos,
                  Dominio.Objetivos,
                  Dominio.Riscos,
                  Dominio.Atividades,
                  Dominio.CasosDeUso,
                  Dominio.Database,
                  Dominio.Metadados,
                  Dominio.Interfaces,
                  Dominio.Anotacoes,
                  Dominio.Enderecos
                ]
                : (moduleKey === Modulo.Monitor.Key)
                ? [
                  Dominio.UsuariosServidores,
                  Dominio.Historico,
                  Dominio.Tarefas,
                  Dominio.Documentos,
                  Dominio.Violacoes,
                  Dominio.Legislacoes
                ]
                : [
                  Dominio.UsuariosCidadaos,
                  Dominio.Demandas,
                  Dominio.Atendimentos,
                  Dominio.Compromissos
                ];
  Render.Options(domains);
}

function renderPreferences() {
  const prefs = getPreferences();
  Render.Preferences(prefs);
  apply(prefs);
}

function wireOpcoes() {
  $(document).on('click', '[data-domain]', async function () {
    const domain = $(this).data('domain');
    App.SetDomain(domain);
  });
}

function wirePreferences() {
  $('#btnSidebarToggle').on('click', () => {
    const prefs = getPreferences();
    $('#leftSidebar').toggleClass('collapsed');
    prefs.sidebarCollapsed = $('#leftSidebar').hasClass('collapsed');
    savePrefs(prefs);
  });

  $('#chkDarkMode').on('change', function () {
    const prefs = getPreferences();
    prefs.theme = this.checked ? 'dark' : 'light';
    savePrefs(prefs);
    applyTheme(prefs.theme);
  });

  $('#chkResumeDomain').on('change', function () {
    const prefs = getPreferences();
    prefs.resumeLastDomain = this.checked;
    savePrefs(prefs);
  });
}

function apply(preferences) {
  if (preferences.sidebarCollapsed) {
    $('#leftSidebar').addClass('collapsed');
  }
  applyTheme(preferences.theme || 'light');
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
  renderOpcoes(moduleKey);
  renderPreferences();
  Render.OurDocs(); 

  wireAll();
  syncHeights();
  $(window).on('resize', syncHeights);
}

function wireAll() {
  wireOpcoes();
  wirePreferences();
  // wireOurDocs....
}

export const LeftSidebar = { Init };
