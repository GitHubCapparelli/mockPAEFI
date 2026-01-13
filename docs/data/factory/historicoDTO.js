import { BaseDTO } from './baseDTO.js';

export function HistoricoDTO(data, audit = {}) {
  return BaseDTO({
    userID         : data.userID,
    catalogoID     : data.catalogoID,
    sessionId      : data.sessionId,
    tipo           : data.tipo,
    nome           : data.nome,
    acao           : data.acao,
    diff           : data.diff,
    descricao      : data.descricao ?? null,
    justificativa  : data.justificativa ?? null,
    ...audit
  });
}