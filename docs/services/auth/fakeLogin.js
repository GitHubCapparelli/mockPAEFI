import { Session, CurrentUserKey } from '../storage.js';

const fetchUnidades = async () => {
  const response = await fetch('/mockPAEFI/data/mock/unidades.json');
  const result   = await response.json();
  return Array.isArray(result) ? result : result.unidades; 
};

export const Perfil = Object.freeze({
  CREAS   : 'creas',
  DISEFI  : 'disefi',
  SUBSAS  : 'subsas',
  OUTRO   : 'outro'
});

function mapPerfil(unidade) {
  if(unidade.sigla.startsWith('CREAS')) {
    return Perfil.CREAS;
  } else if (unidade.sigla === 'DISEFI' || unidade.sigla === 'CPSM') {
    return Perfil.DISEFI;
  } else if (unidade.sigla === 'GERVIS' || unidade.sigla === 'SUBSAS') {
    return Perfil.SUBSAS;
  } 
  return Perfil.OUTRO;
}

const buildUnidadeHierarchy = (unit, unidadesById) => {
  const siglas = [];

  let current = unit;
  while (current) {
    siglas.unshift(current.sigla);

    if (!current.hierarquiaID) break;
    current = unidadesById.get(current.hierarquiaID);
  }

  return siglas.join('/');
};

const fetchMappedServidores = async () => {
  const unidades     = await fetchUnidades();
  const unidadesById = new Map(unidades.map(u => [u.id, u])); // for fast lookup
  const response     = await fetch('/mockPAEFI/data/mock/usuariosServidores.json');
  const result       = await response.json();
  const servidores   = Array.isArray(result) ? result : result.usuariosServidores; 

  return servidores.map(s => {
    const unit = unidadesById.get(u => u.id === s.unidadeID);
    const role = mapPerfil(unit);
    return {
      ...s,
      unidade : unit ? buildUnidadeHierarchy(unit, unidadesById) : 'Não localizada',
      perfil  : role
    }
  });
};

export const AuthService = {
  async EmulateLogin(perfil) {
    Session.Clear();    

    const list = await fetchMappedServidores();
    const user = list.find(s => s.perfil === perfil);

    if (user && user.perfil !== Perfil.OUTRO) {
      Session.Set(CurrentUserKey, user);
    }
    return user;
  },

  GetCurrentUser() {
    return Session.Get(CurrentUserKey);
  }
};

