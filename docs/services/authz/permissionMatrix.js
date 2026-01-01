// permissionMatrix.js
// Defines the permission levels used across the platform
// This file defines what levels exist, not who gets them.

export const PermissionLevel = {
  NONE      : 'none',
  VIEW      : 'view',
  MAINTAIN  : 'maintain' // create, update, delete
};

// Helper: compare permission strength
export function hasAtLeast(current, required) {
  const order = [
    PermissionLevel.NONE,
    PermissionLevel.VIEW,
    PermissionLevel.MAINTAIN
  ];

  return order.indexOf(current) >= order.indexOf(required);
}
