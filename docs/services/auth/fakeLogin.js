import { Session, CurrentUserKey } from '../storage.js';

const unidadesPATH    = '/mockPAEFI/data/mock/unidades.json';
const servodoresPATH  = '/mockPAEFI/data/mock/usuariosServidores.json';

const fetchUnidades = async () => {
  const response = await fetch(unidadesPATH);
  const result   = await response.json();
  return Array.isArray(result) ? result : result.unidades; 
};

const buildUnidadeHierarchy = (unit, unidades) => {
  const siglas = [];

  let current = unit;
  while (current) {
    siglas.unshift(current.sigla);

    if (!current.hierarquiaID) break;
    current = unidades.get(current.hierarquiaID);
  }
  siglas.unshift('SEEDS');
  siglas.unshift('SEDES');

  return siglas.join(' / ');
};

const fetchMappedServidores = async () => {
  const acesso       = 'SUBSAS,CPSM,DISEFI,GERVIS';
  const unidades     = await fetchUnidades();
  const unidadesById = new Map(unidades.map(u => [u.id, u])); 
  
  const response     = await fetch(servodoresPATH);
  const result       = await response.json();
  const servidores   = Array.isArray(result) ? result : result.usuariosServidores; 

  return servidores.map(servidor => {
    const unit           = unidades.find(u => u.id === servidor.unidadeID);
    const podeAcessar    = unit && (acesso.includes(unit.sigla) || unit.sigla.startsWith('CREAS'));
    const podeMonitorar  = unit && (acesso.includes(unit.sigla) || servidor.funcao === 'Gerente');
    const podeCadastrar  = unit && (unit.sigla === 'SUBSAS' || unit.sigla === 'GERVIS')

    return {
      ...servidor,
      unidade       : unit ? unit.sigla : 'Não localizada',
      hierarquia    : unit ? buildUnidadeHierarchy(unit, unidadesById) : 'Não localizada',
      podeAcessar   : podeAcessar,
      podeMonitorar : podeMonitorar,
      podeCadastrar : podeCadastrar
    }
  });
};

export const AuthService = {
  async EmulateLogin(userID) {
    Session.Clear();    

    const list = await fetchMappedServidores();
    const user = list.find(s => s.id === userID);

    if (user && user.podeAcessar) {
      Session.Set(CurrentUserKey, user);
    }
    return user;
  }
};

