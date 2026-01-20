// docs/data/factory/unidadeDTO.js
import { AuditDTO }   from './BaseDTO.js';
import * as Spec      from './_omSpec.js';
import schema         from '../contracts/js/unidadeSchema.js';

const _token = Symbol('UnidadeDTO');

export class UnidadeDTO extends AuditDTO {
  constructor(token, data, audit = {}) {
    if (token !== _token) throw new Error('Use UnidadeDTO.CreateInstance() para criar instâncias');

    super(schema, audit);

    this.hierarquiaID   = data.hierarquiaID ?? null;
    this.sigla          = data.sigla;
    this.nome           = data.nome;
    this.funcao         = data.funcao;
    this.ibgeId         = data.ibgeId ?? null;
  }
  static CreateInstance(data, audit = {}) {
    return new UnidadeDTO(_token, data, audit)
  }

  toJSON() {
    return {
      id              : this.id, 
      sigla           : this.sigla,
      nome            : this.nome,
      funcao          : this.login,
      ibgeId          : this.ibgeId,
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
    const spec      = Spec.Tabela.Unidades.Campos;

    if (!this.sigla && spec.Sigla.Required) {
      this.errors.push('Sigla obrigatória');
      return false;
    }
    if (this.sigla && (this.sigla.length < spec.Sigla.MinLength || this.sigla.length > spec.Sigla.MaxLength)) {
      this.errors.push(`Sigla inválida: tamanho ${this.sigla.length}`);
      return false;
    }
    // TODO: Validate other fields
    
    return schemaOk;
  }
}