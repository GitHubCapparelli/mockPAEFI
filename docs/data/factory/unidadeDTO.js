import { BaseDTO } from './BaseDTO.js';

export class UnidadeDTO extends AuditDTO {
  constructor(data, audit = {}) {
    super('../contracts/unidadeSchema.json', audit);

    this.hierarquiaID   = data.hierarquiaID ?? null;
    this.sigla          = data.sigla;
    this.nome           = data.nome;
    this.funcao         = data.funcao;
    this.ibgeId         = data.ibgeId ?? null;
  }
  static Create(data, audit = {}) {
    return new UnidadeDTO(data, audit)
  }

  validate(acao, userID) {
    this.assign(acao, userID);
    const ok = super.validate(this.toJSON());
    if (!ok) return false;

    const spec = Spec.Tabela.Unidades.Campos;
    if (spec.Nome.Required && !this.nome) return false;
    return true;
  }
}