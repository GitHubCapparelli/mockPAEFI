// ui.paefi.core.app.js

import { Render }                    from './renderer.js';
import { LeftSidebar }               from './sidebarLeft.js';
import { Modulo, Dominio, Elemento } from './omEnum.js';
import { Session, CurrentUserKey,
         Local, LastModuleKey, //LastDomainKey,
         LastAtenderDomainKey, LastMonitorDomainKey, LastAdminDomainKey
       } from '../../../services/storage.js';

import { Orchestrator }              from '../domain/orchestrator.js';
import { DomainInfo }                from './omData.js';

let currentDomain;
let currentModule;

const currentUser = Session.Get(CurrentUserKey);

async function init() {
  resolvecurrentModule();
  resolvecurrentDomain();

  Render.PageStructure();
  $(Elemento.TextoLogin.JQuery).text(currentUser.login);
  $(Elemento.TextoTituloPagina.JQuery).text(currentModule.Value);
  $(Elemento.TextoOpcaoAtual.JQuery).text(currentDomain.Value);

  LeftSidebar.Init(currentModule.Key);

  await DomainInfo.Setup(); 
  initCurrentDomain();
}

function resolvecurrentModule() {
  const url     = window.location.href;
  currentModule = url.includes('index.html') || url.endsWith('paefi/')
               ? Modulo.Atender
               : url.includes('monitor.html') 
               ? Modulo.Monitor
               : url.includes('admin.html') 
               ? Modulo.Admin
               : Modulo.Nenhum; 
  Local.Set(LastModuleKey, currentModule.Key);
}

function resolvecurrentDomain() {
  const moduleKey     = currentModule.Key; 
  const moduleDomains = DomainsOf(moduleKey);
  
  const storageKeys   = {
    [Modulo.Atender.Key]: LastAtenderDomainKey,
    [Modulo.Monitor.Key]: LastMonitorDomainKey,
    [Modulo.Admin.Key]  : LastAdminDomainKey
  };

  const storageKey  = storageKeys[moduleKey];
  const storedValue = Local.Get(storageKey);
  const targetedKey = storedValue || moduleDomains[0].Key;

  currentDomain     = Dominio.All.find(x => x.Key === targetedKey);
  Local.Set(storageKey, currentDomain.Key);
}

function resolvecurrentDomain_deprecated() {
  const lastKey = Local.Get(LastDomainKey);
  currentDomain = Dominio.All.find(x => x.Key === lastKey);

  if (!currentDomain || currentDomain.Key === Dominio.Nenhum.Key) {
    if (currentModule == Modulo.Admin) {
      currentDomain = Dominio.UsuariosServidores;
    } 
    Local.Set(LastDomainKey, currentDomain.Key);
  }
}

function SetDomain(domainKey) {
  currentDomain   = Dominio.FromKey(domainKey);

  const currentKey = (currentModule.Key === Modulo.Atender.Key)
                   ? LastAtenderDomainKey
                   : (currentModule.Key === Modulo.Monitor.Key)
                   ? LastMonitorDomainKey
                   : LastAdminDomainKey;

  Local.Set(currentKey, currentDomain.Key);
  initCurrentDomain();
}

async function initCurrentDomain() {
  $('#page-body').empty();

  $('#modal-root').remove();
  $('body').append($('<div', { id:'modal-root', class:'modal-root' }));
  
  $(Elemento.TextoOpcaoAtual.JQuery).text(currentDomain.Value);
  await Orchestrator.CreateInstance(currentModule.Key, currentDomain.Key);
}

export function DomainsOf(moduleKey) {
  return (moduleKey === Modulo.Admin.Key)
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
        Dominio.RegistrosViolacao,
        Dominio.CatalogoViolacoes,
        Dominio.CatalogoLegislacoes
      ]
      : [
        Dominio.UsuariosCidadaos,
        Dominio.Demandas,
        Dominio.Atendimentos,
        Dominio.Compromissos
      ];
}

export const App = { SetDomain };

$(document).ready(async () => {
  if (!currentUser) {
      alert('Usuário não localizado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return;
  }
  await init(); 
});