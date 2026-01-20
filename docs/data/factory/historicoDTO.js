// docs/data/factory/historicoDTO.js
import { BaseDTO }    from './BaseDTO.js';
import * as Spec      from './_omSpec.js';
import schema         from '../contracts/historicoSchema.json' assert { type: 'json' };

const _token = Symbol('HistoricoDTO');

export class HistoricoDTO extends BaseDTO {
  constructor(token, data) {
    if (token !== _token) throw new Error('Use HistoricoDTO.CreateInstance() para criar instâncias');

    super(schema, audit);

    this.userID         = data.userID;
    this.catalogoID     = data.catalogoID;
    this.dataHora       = data.dataHora;
    this.tipo           = data.tipo;
    this.acao           = data.acao;
    this.descricao      = data.descricao      ?? null;
    this.justificativa  = data.justificativa  ?? null;
    this.diff           = data.diff;
  }
  static CreateInstance(data) {
    return new HistoricoDTO(_token, data)
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

  validateDTO() {
    const schemaOk  = super.validate(this.toJSON());
    const spec      = Spec.Tabela.Historico.Campos;

    if (!this.acao && spec.Acao.Required) {
      this.errors.push('Ação obrigatória');
      return false;
    }
    if (this.acao && (this.acao.length < spec.Acao.MinLength || this.acao.length > spec.Acao.MaxLength)) {
      this.errors.push(`Ação inválida: tamanho ${this.acao.length}`);
      return false;
    }
    // TODO: Validate other fields

    return schemaOk;
  }
}