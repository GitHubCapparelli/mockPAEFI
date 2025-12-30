export function CreateBaseDTO(overrides = {}) {
  return {
    id             : crypto.randomUUID(),
    criadoEm       : null,
    criadoPor      : '',
    alteradoEm     : null,
    alteradoPor    : '',
    excluidoEm     : null,
    excluidoPor    : '',
    exclusaoFisica : false,
    ...overrides
  };
}
