import { Session } from '../storage.js';
 
const fetchUnidades   = async () => (await fetch('/mockPAEFI/data/mock/unidades.json')).json();
const fetchServidores = async () => (await fetch('/mockPAEFI/data/mock/usuariosServidores.json')).json();

export const Papel = Object.freeze({
  GESTOR         : 'gestor',
  EQUIPE         : 'equipe',
  ESPECIALISTA   : 'especialista',
  AGENTE_SOCIAL  : 'agenteSocial',
  DISEFI         : 'disefi',
  SUBSAS         : 'subsas',
  OUTRO          : 'outro'
});

function getRoleFor(siglaUnidade) {
  if (!siglaUnidade) return Papel.OUTRO;

  const unidade = siglaUnidade.toUpperCase();
  if (unidade === 'DISEFI' || unidade === 'CPSM') { 
    return Papel.DISEFI;

  } else if (unidade === 'GERVIS' || unidade === 'SUBSAS') { 
    return Papel.SUBSAS; 

  } else if (unidade.startsWith('CREAS')) { 
    return Papel.OUTRO; 
  } 
  return Papel.OUTRO; 
}

const getFakeUser  = async(perfil) => {
  const unidades   = await fetchUnidades();
  const servidores = await fetchServidores();

  const user = servidores()[0];
  const unit = unidades().find(u => u.id === user.unidadeID);

  return {
    nome    : user.nome,
    unidade : unit ? unit.sigla : 'Unidade não localizada',
    perfil  : getRoleFor(unit ? unit.sigla : null),
    login   : user.login
  };
}

export const AuthService = {
  EmulateLogin(perfil) {
    const user = getFakeUser(perfil);
    if (user.perfil == Papel.OUTRO) {
      Session.Clear();
    } else {
      Session.Set('currentUser', user);
    }
    return user;
  },

  GetCurrentUser() {
    return Session.Get('currentUser');
  }
};

