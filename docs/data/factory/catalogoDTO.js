// docs/data/factory/catalogoDTO.js
import { AuditDTO }   from './BaseDTO.js';
import * as Spec      from './_omSpec.js';
import schema         from '../contracts/js/catalogoSchema.js';

const _token = Symbol('CatalogoDTO');

export class CatalogoDTO extends AuditDTO {
  constructor(token, data, audit = {}) {
    if (token !== _token) throw new Error('Use CatalogoDTO.CreateInstance() para criar instâncias');

    super(schema, audit);

    this.nome       = data.nome;
    this.versao     = data.versao;
    this.finalidade = data.finalidade ?? null;
  }
  static CreateInstance(data, audit = {}) {
    return new CatalogoDTO(_token, data, audit)
  }

  toJSON() {
    return {
      id              : this.id,
      nome            : this.nome,
      versao          : this.versao,
      finalidade      : this.finalidade,
      criadoEm        : this.criadoEm,
      criadoPor       : this.criadoPor,
      alteradoEm      : this.alteradoEm,
      alteradoPor     : this.alteradoPor,
      excluidoEm      : this.excluidoEm,
      excluidoPor     : this.excluidoPor,
      exclusaoFisica  : this.exclusaoFisica
    };
  }

  validateDTO() {
    const schemaOk  = super.validate(this.toJSON());
    const spec      = Spec.Tabela.Catalogos.Campos;

    if (!this.nome && spec.Nome.Required) {
      this.errors.push('Nome obrigatório');
      return false;
    }
    if (this.nome && (this.nome.length < spec.Nome.MinLength || this.nome.length > spec.Nome.MaxLength)) {
      this.errors.push(`Nome inválido: tamanho ${this.nome.length}`);
      return false;
    }
    // TODO: Validate other fields

    return schemaOk;
  }
}