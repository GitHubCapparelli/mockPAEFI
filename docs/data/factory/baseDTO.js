export function CreateBaseDTO(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    criadoPor: '',
    alteradoEm: null,
    alteradoPor: null,
    excluidoEm: null,
    excluidoPor: null,
    exclusaoFisica: false,
    ...overrides
  };
}
