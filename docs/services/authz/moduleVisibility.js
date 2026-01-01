/**
 * Module visibility resolver
 * --------------------------
 * Decides which modules are visible based on AuthContext.
 */

export function resolveModuleVisibility(context) {
  if (!context || !context.permissions) {
    return {
      admin   : false,
      monitor : false,
      atender : false
    };
  }

  const canView = p => p === 'view' || p === 'maintain';

  return {
    admin   : canView(context.permissions.admin),
    monitor : canView(context.permissions.monitor),
    atender : canView(context.permissions.atender)
  };
}
