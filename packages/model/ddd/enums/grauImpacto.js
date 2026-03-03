// packages/model/ddd/enums/grauImpacto.js
import { BaseEnum } from "./_baseEnum.js";
export class GrauImpacto extends BaseEnum {
    static All = [];

    static Nenhum   = new GrauImpacto('nenhum', 'Nenhum');
    static Baixo    = new GrauImpacto('baixo', 'Baixo');
    static Moderado = new GrauImpacto('moderado', 'Moderado');
    static Alto     = new GrauImpacto('alto', 'Alto');
    static Critico  = new GrauImpacto('critico', 'Crítico');

    constructor(key, value) {
        super();
        this.Key    = key;
        this.Value  = value;
        this.JQuery = `#${key}`;

        if (!GrauImpacto.All.some(x => x.Key === key)) {
            GrauImpacto.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(GrauImpacto.All);