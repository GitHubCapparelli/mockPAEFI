/**
 * Domain scope resolver
 * ---------------------
 * Determines WHICH data the user can access, not WHAT they can do with it.
 * 
 * This will answer questions like: 
 * “Which unidades / registros can this user see?
 * “Which records belong to this user’s universe?”
 */

export function resolveDomainScope(context) {
  if (!context) return null;

  switch (context.scope) {
    case 'Central':
      return {
        type          : 'Central',
        unidadeSigla  : null   // unrestricted
      };

    case 'Unidade':
      return {
        type          : 'Unidade',
        unidadeSigla  : context.unidadeSigla
      };

    default:
      return null;
  }
}
