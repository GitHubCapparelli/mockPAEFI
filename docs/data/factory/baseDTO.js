// docs data factory baseDTO

import Ajv from 'ajv'; 

export class BaseDTO {
  #_ajv      = null;
  #_schema   = null;
  #_validate = null;

  constructor(schema) {
    this.#_schema   = schema;
    this.#_ajv      = new Ajv({allErrors: true});
    this.#_validate = this.#_ajv.compile(this.#_schema);
    this.errors     = null;
  }

  validate(data) {
    const valid = this.#_validate(data);
    this.errors = this.#_validate.errors
      ? this.#_ajv.errorsText(this.#_validate.errors)
      : null;
    return valid;
  }
}

export class AuditDTO extends BaseDTO {
  constructor(schemaPath, overrides = {}) {
    super(schemaPath);

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

  assign(acao, userID) {
    if (acao === 'create') {
      this.criadoEm     = new Date().toISOString();
      this.criadoPor    = userID;
    } else if (acao === 'update') {
      this.alteradoEm   = new Date().toISOString();
      this.alteradoPor  = userID;
    } else if (acao === 'delete') {
      this.excluidoEm   = new Date().toISOString();
      this.excluidoPor  = userID;
    }
  }
}

