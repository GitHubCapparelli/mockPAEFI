import { BaseDTO } from './BaseDTO.js';

export class CatalogoDTO extends AuditDTO {
  constructor(data, audit = {}) {
    super('../contracts/catalogoSchema.json', audit);

    this.nome       = data.nome;
    this.versao     = data.versao;
    this.finalidade = data.finalidade ?? null;
  }
  static Create(data, audit = {}) {
    return new CatalogoDTO(data, audit)
  }

  validate(acao, userID) {
    this.assign(acao, userID);
    const ok = super.validate(this.toJSON());
    if (!ok) return false;

    const spec = Spec.Tabela.Catalogos.Campos;
    if (spec.Nome.Required && !this.nome) return false;
    if (spec.Versao.Required && !this.versao) return false;
    if (spec.Finalidade.Required && !this.finalidade) return false;
    return true;
  }
}