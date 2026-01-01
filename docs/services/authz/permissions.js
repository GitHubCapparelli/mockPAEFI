/**
 * Authorization helpers
 * ---------------------
 * These helpers abstract permission semantics and MUST be used by UI and gateways.
 */

export function canView(level)     { return level === 'view' || level === 'maintain'; }
export function canMaintain(level) { return level === 'maintain'; }
