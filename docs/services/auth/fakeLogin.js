import { Session } from '../storage.js';
 
const fetchUnidades = async () => {
  const response = await fetch('/mockPAEFI/data/mock/unidades.json');
  const result   = await response.json();
  return Array.isArray(result) ? result : result.unidades; 
};
 
const fetchServidores = async () => {
  const unidades = await fetchUnidades();
  const response = await fetch('/mockPAEFI/data/mock/usuariosServidores.json');
  const result   = await response.json();
  const lista    = Array.isArray(result) ? result : result.usuariosServidores; 

  return lista.map(s => {
    const unit = unidades.find(u => u.id === s.unidadeID);
    return {
      ...s,
      unidade: unit ? unit.sigla : 'Não localizada'
    }
  });
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
    case Papel.SUBSAS: return data.find(s => s.unidade === 'GERVIS' || s.unidade === 'SUBSAS');
    case Papel.DISEFI: return data.find(s => s.unidade === 'DISEFI' || s.unidade === 'CPSM');
    default: return null;
  }
  // TODO:
  // implementar os demais casos (gestor, equipe, especialista e agenteSocial),
  // depois de incluir outros servidores fakes
};

const getFakeUser = async(papel) => {
  const servidor  = await servidorCom(papel);
  if (!servidor) return null;

  return {
    nome    : servidor.nome,
    unidade : servidor.unidade,
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

