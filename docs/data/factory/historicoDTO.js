export function HistoricoDTO(data) {
  return {
    userID         : data.userID,
    catalogoID     : data.catalogoID,
    sessionId      : data.sessionId,
    dataHora       : data.dataHora,
    tipo           : data.tipo,
    acao           : data.acao,
    descricao      : data.descricao ?? null,
    justificativa  : data.justificativa ?? null,
    diff           : data.diff
  };
}