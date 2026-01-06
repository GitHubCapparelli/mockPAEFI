// ui.paefi.core.layout

import { Render }                    from './renderer.js';
import { Modulo, Dominio }           from './omEnum.js';
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
  Render.DomainStructure();

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
    // resolver valor default para os outros módulos...
  }
}

function initCurrentDomain() {
  if (currentDomainEnum.Key === Dominio.UsuariosServidores.Key) {
    currentDomain = new UsuariosServidoresDomain();
  }  
}

$(document).ready(async () => {
  if (!currentUser) {
      alert('Usuário não localizado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return;
  }
  init(); 
});