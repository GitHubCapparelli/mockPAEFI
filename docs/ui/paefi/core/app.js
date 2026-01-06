// ui.paefi.core.app

import { Render }                    from './renderer.js';
import { LeftSidebar }               from './leftSidebar.js';
import { Modulo, Dominio, Elemento } from './omEnum.js';
import { UsuariosServidoresDomain }  from '../domain/usuariosServidores.js';
import { Session, CurrentUserKey,
         Local, LastModuleKey, LastDomainKey
       } from '../../../services/storage.js';

let currentDomain;
let currentDomainEnum;
let currentModuleEnum;

const currentUser = Session.Get(CurrentUserKey);

function init() {
  resolvecurrentModuleEnum();
  resolvecurrentDomainEnum();

  Render.PageStructure();
  Render.DomainStructure(currentModuleEnum.Key);

  $(Elemento.TextoLogin.Key).text(currentUser.login);
  $(Elemento.TextoTituloPagina.Key).text(currentModuleEnum.Value);
  $(Elemento.TextoOpcaoAtual.Key).text(currentDomainEnum.Value);

  LeftSidebar.Init(currentModuleEnum.Key);
  initCurrentDomain();
}

function resolvecurrentModuleEnum() {
  const url     = window.location.href;
  currentModuleEnum = url.includes('index.html') 
               ? Modulo.Atender
               : url.includes('monitor.html') 
               ? Modulo.Monitor
               : url.includes('admin.html') 
               ? Modulo.Admin
               : Modulo.Nenhum; 
  Local.Set(LastModuleKey, currentModuleEnum.Key);
}

function resolvecurrentDomainEnum() {
  const lastKey = Local.Get(LastDomainKey);
  currentDomainEnum = Dominio.All.find(x => x.Key === lastKey);

  if (!currentDomainEnum || currentDomainEnum.Key === Dominio.Nenhum.Key) {
    if (currentModuleEnum == Modulo.Admin) {
      currentDomainEnum = Dominio.UsuariosServidores;
    }
    Local.Set(LastDomainKey, currentDomainEnum.Key);
  }
}

function SetDomain(domainKey) {
  $(Elemento.TextoOpcaoAtual.Key).text(domainKey);
}

function initCurrentDomain() {
  if (currentDomainEnum.Key === Dominio.UsuariosServidores.Key) {
    currentDomain = new UsuariosServidoresDomain(currentModuleEnum.Key);
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