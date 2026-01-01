// authContext.js
// Canonical authorization result object
// This file defines what the rest of the system consumes.
// UI components must not care about funcao, cargo, especialidade. They only see AuthContext

import { PermissionLevel } from './permissionMatrix.js';

export function createAuthContext({ role, scope, unidadeSigla, permissions }) {
  return {
    role,           // Admin | CentralManager | UnitManager | Operator | etc.
    scope,          // Central | Unidade
    unidadeSigla,   // e.g. SUBSAS, CPSM, CREAS-XYZ

    permissions: {
      admin   : permissions.admin   ?? PermissionLevel.NONE,
      monitor : permissions.monitor ?? PermissionLevel.NONE,
      atender : permissions.atender ?? PermissionLevel.NONE
    }
  };
}
