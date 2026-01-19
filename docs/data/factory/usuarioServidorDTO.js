import { AuditDTO } from './BaseDTO.js';
import * as Spec    from './_omSpec.js';

export class UsuarioServidorDTO extends AuditDTO {
  constructor(data, audit = {}) {
    super('../contracts/usuarioServidorSchema.json', audit);

    this.unidadeID      = data.unidadeID;
    this.nome           = data.nome;
    this.login          = data.login;
    this.matricula      = data.matricula;
    this.cpf            = data.cpf;
    this.funcao         = data.funcao;
    this.cargo          = data.cargo;
    this.especialidade  = data.especialidade;
  }
  static Create(data, audit = {}) {
    return new UsuarioServidorDTO(data, audit)
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

  validate(acao, userID) {
    this.assign(acao, userID);
    const ok = super.validate(this.toJSON());
    if (!ok) return false;

    const spec = Spec.Tabela.UsuariosServidores.Campos;
    let result = true;
    result = result || isValidCPF(spec.CPF, this.cpf);
    // validate other fields
    return result;
  }

  isValidCPF(spec, value) {
    if (!value && spec.Required) {
      this.errors.push('CPF obrigatório');
      return false;
    }
    if (value && (value.length < spec.MinLength || value.length > spec.MaxLength)) {
      this.errors.push(`CPF inválido []: ${value.length}`);
      return false;
    }
    return true;
  }
}
