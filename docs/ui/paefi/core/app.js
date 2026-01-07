// ui.paefi.core.app

import { Render }                    from './renderer.js';
import { LeftSidebar }               from './leftSidebar.js';
import { Modulo, Dominio, Elemento } from './omEnum.js';
import { Session, CurrentUserKey,
         Local, LastModuleKey, LastDomainKey
       } from '../../../services/storage.js';

let currentDomain;
let currentModule;

const currentUser = Session.Get(CurrentUserKey);

function init() {
  resolvecurrentModule();
  resolvecurrentDomain();

  Render.PageStructure();
  Render.DomainStructure(currentModule.Key);

  $(Elemento.TextoLogin.JQuery).text(currentUser.login);
  $(Elemento.TextoTituloPagina.JQuery).text(currentModule.Value);
  $(Elemento.TextoOpcaoAtual.JQuery).text(currentDomain.Value);

  LeftSidebar.Init(currentModule.Key);
  initCurrentDomain();
}

function resolvecurrentModule() {
  const url     = window.location.href;
  currentModule = url.includes('index.html') 
               ? Modulo.Atender
               : url.includes('monitor.html') 
               ? Modulo.Monitor
               : url.includes('admin.html') 
               ? Modulo.Admin
               : Modulo.Nenhum; 
  Local.Set(LastModuleKey, currentModule.Key);
}

function resolvecurrentDomain() {
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
  if (domainKey === currentDomain.Key) return;

  currentDomain = Dominio.FromKey(domainKey);
  Local.Set(LastDomainKey, currentDomain.Key);

  $(Elemento.TextoOpcaoAtual.JQuery).text(currentDomain.Value);

  Render.DomainStructure(currentModule.Key);
  initCurrentDomain();
}

function initCurrentDomain() {
  switch (currentDomain.Key) {
    case Dominio.UsuariosServidores.Key  : UsuariosServidoresDomain.Create(currentModule); break;
    case Dominio.Unidades.Key            : UnidadesDomain.Create(currentModule); break;
  }
}

export const App = { SetDomain };

$(document).ready(async () => {
  if (!currentUser) {
      alert('Usuário não localizado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return;
  }
  init(); 
});