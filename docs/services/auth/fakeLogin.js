import { Session } from '../storage.js';
 
const fetchUnidades = async () => {
  const response = await fetch('/mockPAEFI/data/mock/unidades.json');
  const result   = await response.json();
  return Array.isArray(result) ? result : result.unidades; 
};
 
const fetchServidores = async () => {
  const response = await fetch('/mockPAEFI/data/mock/usuariosServidores.json');
  const result   = await response.json();
  return Array.isArray(result) ? result : result.usuariosServidores; 
};

export const Papel = Object.freeze({
  GESTOR         : 'gestor',
  EQUIPE         : 'equipe',
  ESPECIALISTA   : 'especialista',
  AGENTE_SOCIAL  : 'agenteSocial',
  DISEFI         : 'disefi',
  SUBSAS         : 'subsas',
  OUTRO          : 'outro'
});

const servidorCom = async(papel) => {
  const data = await fetchServidores();
  switch (papel) {
    case Papel.SUBSAS: return data.find(u => u.sigla === 'GERVIS' || u.sigla === 'SUBSAS');
    case Papel.DISEFI: return data.find(u => u.sigla === 'DISEFI' || u.sigla === 'CPSM');
    default: return null;
  }
  // TODO:
  // implementar os demais casos (gestor, equipe, especialista e agenteSocial),
  // depois de incluir outros servidores fakes
};

const getFakeUser = async(papel) => {
  const servidor  = await servidorCom(papel);
  if (!servidor) return null;

  const units = await fetchUnidades();
  const unit  = units.find(u => u.id === servidor.unidadeID);
  return {
    nome    : servidor.nome,
    unidade : unit ? unit.sigla : 'Unidade não localizada',
    login   : servidor.login,
    perfil  : papel
  };
}

export const AuthService = {
  async EmulateLogin(perfil) {
    if (perfil === Papel.OUTRO) {
      Session.Clear();    
      return null;
    }
    const user = await getFakeUser(perfil);
    if (user) {
      Session.Set('currentUser', user);
    }
    return user;
  },

  GetCurrentUser() {
    return Session.Get('currentUser');
  }
};

