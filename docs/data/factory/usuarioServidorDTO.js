// docs/data/factory/usuarioServidorDTO.js
import { AuditDTO }   from './baseDTO.js';
import * as Spec      from './_omSpec.js';
import schema         from '../contracts/js/usuarioServidorSchema.js';

const _token = Symbol('UsuarioServidorDTO');

export class UsuarioServidorDTO extends AuditDTO {
  constructor(token, data = {}, audit = {}) {
    if (token !== _token) throw new Error('Use UsuarioServidorDTO.CreateInstance() para criar instâncias');

    super(schema, audit);

    this.unidadeID      = data.unidadeID;
    this.nome           = data.nome;
    this.login          = data.login;
    this.matricula      = data.matricula;
    this.cpf            = data.cpf;
    this.funcao         = data.funcao;
    this.cargo          = data.cargo;
    this.especialidade  = data.especialidade;
  }

  static CreateInstance(data, audit = {}) {
    return new UsuarioServidorDTO(_token, data, audit);
  }

  toJSON() {
    return {
      id              : this.id,
      unidadeID       : this.unidadeID,
      nome            : this.nome,
      login           : this.login,
      matricula       : this.matricula,
      cpf             : this.cpf,
      funcao          : this.funcao,
      cargo           : this.cargo,
      especialidade   : this.especialidade,
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
    const spec      = Spec.Tabela.UsuariosServidores.Campos;

    const cpf       = spec.find(x => x.DbColName === Spec.Campo.CpfServidor.DbColName);
    if (!this.cpf && cpf.Required) {
      this.errors.push('CPF obrigatório');
      return false;
    }
    if (this.cpf && (this.cpf.length < cpf.MinLength || this.cpf.length > cpf.MaxLength)) {
      this.errors.push(`CPF inválido: tamanho ${this.cpf.length}`);
      return false;
    }
    // TODO: Validate other fields

    //return schemaOk;
    return true;
  }
}