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

export const Orgao = Object.freeze({
  CREAS   : 'creas',
  DISEFI  : 'disefi',
  SUBSAS  : 'subsas',
  OUTRO   : 'outro'
});

const servidorCom = async(orgao) => {
  const data = await fetchServidores();
  switch (orgao) {
    case Orgao.CREAS: return data.find(s => s.unidade.startsWith('CREAS'));
    case Orgao.SUBSAS: return data.find(s => s.unidade === 'GERVIS' || s.unidade === 'SUBSAS');
    case Orgao.DISEFI: return data.find(s => s.unidade === 'DISEFI' || s.unidade === 'CPSM');
    default: return null;
  }
};

const getFakeUser = async(orgao) => {
  const servidor  = await servidorCom(orgao);
  if (!servidor) return null;

  return {
    nome    : servidor.nome,
    unidade : servidor.unidade,
    login   : servidor.login
  };
}

export const AuthService = {
  async EmulateLogin(orgao) {
    if (orgao === Orgao.OUTRO) {
      Session.Clear();    
      return null;
    }
    const user = await getFakeUser(orgao);
    if (user) {
      Session.Set('currentUser', user);
    }
    return user;
  },

  GetCurrentUser() {
    return Session.Get('currentUser');
  }
};

