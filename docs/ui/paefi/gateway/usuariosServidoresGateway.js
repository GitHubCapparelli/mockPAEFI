// ui/paefi/gateway/usuariosServidoresGateway.js

import { QueryEngine } from '../engine/queryEngine.js';
import { UsuariosServidoresAPI } from '../api/usuariosServidoresAPI.js';
import { Local } from '../../services/storage.js';

const LAST_DOMAIN_KEY = 'lastDomain';

export const UsuariosServidoresGateway = {
  activate
};

/* =========================================================
 * Public entrypoint
 * ========================================================= */
function activate({ module }) {
  persistDomain('usuarios-servidores');

  const engine = buildQueryEngine({ module });

  engine.load();
}

/* =========================================================
 * Engine composition
 * ========================================================= */
function buildQueryEngine({ module }) {
  return QueryEngine({
    fetch: ({ page, pageSize, filters }) =>
      UsuariosServidoresAPI.getPaginated({
        page,
        pageSize,
        filters
      }),

    onData: (data) => render(module, data),

    onPagination: (pagination) =>
      renderPagination(module, pagination),

    onError: handleError,

    pageSize: 10
  });
}

/* =========================================================
 * Rendering delegation (gateway-owned)
 * ========================================================= */
function render(module, data) {
  switch (module) {
    case 'admin':
      renderAdminTable(data);
      break;

    case 'atender':
      renderAtenderCards(data);
      break;

    case 'monitor':
      renderMonitorView(data);
      break;

    default:
      console.warn('[UsuariosServidoresGateway] Unknown module:', module);
  }
}

/* =========================================================
 * Admin rendering (table)
 * ========================================================= */
function renderAdminTable(rows) {
  const tbody = document.querySelector('#tblUsuariosServidores tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  for (const row of rows) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${row.nome}</td>
      <td>${row.matricula}</td>
      <td>${row.unidade}</td>
      <td>${row.status}</td>
    `;

    tbody.appendChild(tr);
  }
}

/* =========================================================
 * Future module renderers (placeholders)
 * ========================================================= */
function renderAtenderCards(data) {
  console.info('[UsuariosServidoresGateway] atender renderer not implemented', data);
}

function renderMonitorView(data) {
  console.info('[UsuariosServidoresGateway] monitor renderer not implemented', data);
}

/* =========================================================
 * Pagination (UI-neutral hook)
 * ========================================================= */
function renderPagination(module, pagination) {
  console.debug(
    `[UsuariosServidoresGateway] pagination (${module})`,
    pagination
  );

  // Hook only — actual controls already exist or will be wired later
}

/* =========================================================
 * Error handling
 * ========================================================= */
function handleError(err) {
  console.error('[UsuariosServidoresGateway]', err);
}

/* =========================================================
 * Persistence
 * ========================================================= */
function persistDomain(domain) {
  Local.Set(LAST_DOMAIN_KEY, domain);
}
