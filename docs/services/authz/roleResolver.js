// roleResolver.js
// Translates user + unidade into role, scope, and permissions
// This fully encodes the user hierarchy — explicitly, readably, auditable.

import { PermissionLevel } from './permissionMatrix.js';
import { createAuthContext } from './authContext.js';

// Central admin IDs (explicit governance exception)
const CENTRAL_ADMIN_IDS = new Set([
  '58a74744-5ddd-449a-85f6-686cc8d109c5',    // Capparelli
  '282a8197-3690-44d7-8cfc-b13095823a9a'     // Yuri
]);

export function resolveAuthContext(user) {
  if (!user || !user.unidade) return null;

  const { id, funcao, unidade } = user;
  const sigla = unidade;

  // -----------------------------
  // CENTRAL ADMINS (explicit IDs)
  // -----------------------------
  if (CENTRAL_ADMIN_IDS.has(id)) {
    return createAuthContext({
      role  : 'CentralAdmin',
      scope : 'Central',
      unidadeSigla: sigla,
      permissions: {
        admin   : PermissionLevel.MAINTAIN,
        monitor : PermissionLevel.MAINTAIN,
        atender : PermissionLevel.VIEW
      }
    });
  }

  const isCentralUnit = ['SUBSAS', 'GERVIS', 'CPSM', 'DISEFI'].includes(sigla);
  const isCREAS       = sigla.startsWith('CREAS');

  // -----------------------------
  // CENTRAL MANAGERS
  // -----------------------------
  if (isCentralUnit && ['Coordenador', 'Diretor'].includes(funcao)) {
    return createAuthContext({
      role  : 'CentralManager',
      scope : 'Central',
      unidadeSigla: sigla,
      permissions: {
        admin   : PermissionLevel.VIEW,
        monitor : sigla === 'DISEFI'
          ? PermissionLevel.MAINTAIN
          : PermissionLevel.VIEW,
        atender : PermissionLevel.VIEW
      }
    });
  }

  // -----------------------------
  // CENTRAL OPERATORS
  // -----------------------------
  if (isCentralUnit) {
    return createAuthContext({
      role  : 'CentralOperator',
      scope : 'Central',
      unidadeSigla: sigla,
      permissions: {
        admin   : PermissionLevel.VIEW,
        monitor : sigla === 'DISEFI'
          ? PermissionLevel.VIEW
          : PermissionLevel.NONE,
        atender : PermissionLevel.VIEW
      }
    });
  }

  // -----------------------------
  // UNIT MANAGERS (CREAS)
  // -----------------------------
  if (isCREAS && funcao === 'Gerente') {
    return createAuthContext({
      role  : 'UnitManager',
      scope : 'Unidade',
      unidadeSigla: sigla,
      permissions: {
        admin   : PermissionLevel.NONE,
        monitor : PermissionLevel.MAINTAIN,
        atender : PermissionLevel.VIEW
      }
    });
  }

  // -----------------------------
  // UNIT OPERATORS (default)
  // -----------------------------
  if (isCREAS) {
    return createAuthContext({
      role  : 'UnitOperator',
      scope : 'Unidade',
      unidadeSigla: sigla,
      permissions: {
        admin   : PermissionLevel.NONE,
        monitor : PermissionLevel.NONE,
        atender : PermissionLevel.MAINTAIN
      }
    });
  }

  return null;
}