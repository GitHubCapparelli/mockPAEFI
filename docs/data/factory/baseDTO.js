// docs/data/factory/baseDTO.js 
import Ajv from 'https://cdn.jsdelivr.net/npm/ajv@8/dist/ajv.min.js';

export class BaseDTO { 
  static ajv = new Ajv({ allErrors: true });

  #_schema;
  #_validate;

  constructor(schema) {
    this.#_schema   = schema;
    this.#_validate = BaseDTO.ajv.compile(this.#_schema);
    this.errors     = [];
  }

  validate(data) {
    this.errors = [];
    const valid = this.#_validate(data);
    if (!valid && this.#_validate.errors) {
      this.errors.push(...this.#_validate.errors.map(e => `${e.instancePath || '/'} ${e.message}`));
    }
    return valid;
  }
}

export class AuditDTO extends BaseDTO {
  constructor(schema, overrides = {}) {
    super(schema);

    this.id             = null;
    this.criadoEm       = null;
    this.criadoPor      = '';
    this.alteradoEm     = null;
    this.alteradoPor    = '';
    this.excluidoEm     = null;
    this.excluidoPor    = '';
    this.exclusaoFisica = false;

    Object.assign(this, overrides);
  }

  prepare(acao, userID) {
    const now = new Date().toISOString();
    if (acao === 'create') {
      this.criadoEm     = now;
      this.criadoPor    = userID;
    }
    if (acao === 'update') {
      this.alteradoEm   = now;
      this.alteradoPor  = userID;
    }
    if (acao === 'delete') {
      this.excluidoEm   = now;
      this.excluidoPor  = userID;
    }
  }
}
