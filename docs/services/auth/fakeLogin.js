/**
 * AuthService
 * ----------
 * Resolves identity + authorization ONCE per session.
 * The returned user object MUST contain `context`,
 * which becomes the single source of truth for access control.
 *
 * UI must NOT rely on legacy flags (podeAcessar, etc.).
 * 
 * Every logged-in user has identity, context, domainScope.
 * This mirrors enterprise IAM systems.
 * 
 * Using 
 * const { context, domainScope } = Session.Get(CurrentUserKey);
 * Answers questions like:
 * Can I see this (Admin) module ?
 * Can I edit this ?
 * Which Unidades can I see ?
 * Should I see this row (or column?) ?
 * 
 */
import { resolveDomainScope } from '../authz/domainScope.js';
import { resolveAuthContext } from '../authz/index.js';
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
    const unit = unidades.find(u => u.id === servidor.unidadeID);
    return {
      ...servidor,
      unidade       : unit ? unit.sigla : 'Não localizada',
      hierarquia    : unit ? buildUnidadeHierarchy(unit, unidadesById) : 'Não localizada'
    }
  });
};

export const AuthService = {
  async EmulateLogin(userID) {
    Session.Clear();    

    const list = await fetchMappedServidores();
    const user = list.find(s => s.id === userID);

    if (user) {
      const context = resolveAuthContext(user);
      if (context) {
        const enrichedUser = {
          ...user,
          context,
          domainScope: resolveDomainScope(context)
        };

        Session.Set(CurrentUserKey, enrichedUser);
        return enrichedUser;
      }
    }
    return null;
  }
};

