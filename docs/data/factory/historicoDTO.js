import { BaseDTO } from './BaseDTO.js';

export class HistoricoDTO extends BaseDTO {
  constructor(data) {
    super('../contracts/historicoSchema.json');

    this.userID         = data.userID;
    this.catalogoID     = data.catalogoID;
    this.dataHora       = data.dataHora;
    this.tipo           = data.tipo;
    this.acao           = data.acao;
    this.descricao      = data.descricao      ?? null;
    this.justificativa  = data.justificativa  ?? null;
    this.diff           = data.diff;
  }

  toJSON() {
    return {
      id            : this.id,
      userID        : this.userID,
      catalogoID    : this.catalogoID,
      dataHora      : this.dataHora,
      tipo          : this.tipo,
      acao          : this.acao,
      descricao     : this.descricao,
      justificativa : this.justificativa,
      diff          : this.diff
    };
  }

  validate(acao, userID) {
    this.assign(acao, userID);
    const ok = super.validate(this.toJSON());
    if (!ok) return false;

    if (acao !== 'create') return false;

    const spec = Spec.Tabela.Unidades.Campos;
    if (spec.userID.Required && !this.userID) return false;
    return true;
  }

  validate() {
    return super.validate(this.toJSON());
  }
}