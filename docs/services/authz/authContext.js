// authContext.js
// Canonical authorization result object

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
