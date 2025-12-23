import { Session }        from '../storage.js';
import unidades           from '../../data/mock/unidades.json'           assert { type: 'json' };
import usuariosServidores from '../../data/mock/usuariosServidores.json' assert { type: 'json' };

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
  if (unidade === 'DISEFI') { 
    return Papel.DISEFI;

  } else if (unidade.startsWith('CREAS')) { 
    return Papel.GESTOR; 
  } 
  return Papel.OUTRO; 
}

function getFakeUser(perfil) {
  const user = usuariosServidores[0];
  const unit = unidades.find(u => u.id === user.unidadeID);

  let result = {
    nome    : user.nome,
    unidade : unit ? unit.sigla : 'Unidade não localizada',
    perfil  : getRoleFor(unit ? unit.sigla : null),
    login   : user.login
  };
  return result;
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

