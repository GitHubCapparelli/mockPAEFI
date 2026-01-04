// ui/paefi/gateway/coreGateway.js
import { LeftSidebar 
       } from '../shell/leftSidebar.js';
import { Local, Session, 
         CurrentUserKey, 
         UserPreferencesKey,
         LastAdminDomainKey 
       } from '../../../services/storage.js';

/* Internal State */
const state = {
  currentUser: null,
  currentAdminDomain: null,
  adminGateways: {},
};

/* Preferences */
function loadPrefs() {
  return Local.Get(UserPreferencesKey) || {};
}

function savePrefs(prefs) {
  Local.Set(UserPreferencesKey, prefs);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute(
    'data-bs-theme',
    theme === 'dark' ? 'dark' : 'light'
  );
}

function restoreTheme() {
  const prefs = loadPrefs();
  applyTheme(prefs.theme || 'light');
}

/* Admin Gateway Registry */
export function RegisterAdminGateway(domain, gateway) {
  if (!domain || !gateway?.Init) {
    throw new Error(`[coreGateway] Invalid gateway registration: ${domain}`);
  }
  state.adminGateways[domain] = gateway;
}

export async function ActivateAdminGateway(domain) {
  const gateway = state.adminGateways[domain];
  if (!gateway) {
    throw new Error(`[coreGateway] Gateway not registered: ${domain}`);
  }
  state.currentAdminDomain = domain;

  const prefs = loadPrefs();
  if (prefs.resumeLastDomain) {
    Local.Set(LastAdminDomainKey, domain);
  }

  await gateway.Init(state.currentUser);
}

/* Sidebar Integration */
function wireSidebarNavigation() {
  $(document).on('click', '[data-domain]', async function () {
    const domain = $(this).data('domain');
    if (!domain || domain === state.currentAdminDomain) return;

    try {
      await ActivateAdminGateway(domain);
    } catch (err) {
      console.error(`[coreAdminGateway] Failed to activate domain ${domain}`, err);
      alert('Erro ao navegar para a opção selecionada.');
    }
  });
}

/* Bootstrap */
async function resolveInitialDomain() {
  const prefs = loadPrefs();

  if (prefs.resumeLastDomain) {
    return Local.Get(LastAdminDomainKey);
  }
  return null;
}

export async function Init() {
  const user = Session.Get(CurrentUserKey);
  if (!user) {
    alert('Usuário não localizado. Redirecionando...');
    window.location.href = '/mockPAEFI/';
    return;
  }

  state.currentUser = user;
  LeftSidebar.init();
  restoreTheme();
  wireSidebarNavigation();

  const initialDomain = await resolveInitialDomain();
  if (initialDomain && state.adminGateways[initialDomain]) {
    console.log(initialDomain);
    await ActivateAdminGateway(initialDomain);
  }
}

/* Public interface */
export const CoreAdminGateway = {
  Init,
  RegisterAdminGateway,
  ActivateAdminGateway,
  GetCurrentAdminDomain() {
    return state.currentAdminDomain;
  },
  GetCurrentUser() {
    return state.currentUser;
  }
};