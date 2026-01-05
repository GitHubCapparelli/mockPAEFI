//ui/paefi/gateway/coreAdmin.js (module's orchestrator)
import { Session, CurrentUserKey,
         Local, LastModuleKey, LastDomainKey
       } from '../../../services/storage.js';
import { Core 
       } from '../shell/core.js';
import { UsuariosServidoresGateway } from './usuariosServidoresGateway.js';
import { CoreAPI }                   from '../../../services/api/coreAPI.js';

let activeGateway = null;

const currentUser = Session.Get(CurrentUserKey);

const Modules = [
  { key: 'admin',    title: 'Administração' },
  { key: 'atender',  title: 'Atendimento' },
  { key: 'monitor',  title: 'Supervisão' }
];

const Domains = [
  { key: 'unidades',             title: 'Unidades' },
  { key: 'usuarios-servidores',  title: 'Usuários Servidores' }
];

function init() {
  const currentModule = resolveCurrentModule();
  const currentDomain = resolveCurrentDomain(currentModule.key);
  
  Core.Init(currentUser, currentModule.title);
  $('#page-contents').append(
      domainTitleBar(), 
      filtersSection(),
      dataSection()
  );

  $('#domain-title').text(currentDomain.title);
  activateDomain(currentDomain.key);
}

function resolveCurrentDomain(currentModule) {
  if (currentModule === 'admin') {
    const lastKey = Local.Get(LastDomainKey);
    const domain  = Domains.find(x => x.key === lastKey) || 
                    Domains.find(x => x.key === 'usuarios-servidores');
    if (domain) {
      Local.Set(LastDomainKey, domain)
      return domain;
    }
  }
  throw new Error(`[resolveCurrentDomain] Erro: Domínio não localizado para o módulo: ${currentModule}`);
}

function resolveCurrentModule() {
  const url    = window.location.href;
  const module = url.includes('index.html') 
               ? Modules.find(x => x.key === 'atender')
               : url.includes('monitor.html') 
               ? Modules.find(x => x.key === 'monitor')
               : url.includes('admin.html') 
               ? Modules.find(x => x.key === 'admin')
               : null; 
    if (!module) {
      throw new Error("[resolveCurrentModule] Erro ao carregar página.");
    }
    Local.Set(LastModuleKey, module.key);
    return module;
}

async function activateDomain(domainKey) {
  if (activeGateway?.dispose) {
    activeGateway.dispose();
  }

  switch (domainKey) {
    case 'usuarios-servidores':
      activeGateway = new UsuariosServidoresGateway();
      await activeGateway.activate();
      break;

    default:
      console.warn('[CoreAdmin] No gateway for domain:', domainKey);
  }
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

export const CoreAdmin = { 
  BuildTable
};

$(document).ready(async () => {
  if (!currentUser) {
      alert('Usuário não localizado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return;
  }
  await CoreAPI.Init(); //currentUser);  
  init(); 
});