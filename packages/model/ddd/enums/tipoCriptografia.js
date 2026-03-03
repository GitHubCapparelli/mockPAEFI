// packages/model/ddd/enums/tipoCriptografia.js
import { BaseEnum } from "./_baseEnum.js";
export class TipoCriptografia extends BaseEnum {
    static All = [];

    static Nenhuma              = new TipoCriptografia('nenhuma', 'Nenhuma');
    static Repouso              = new TipoCriptografia('repouso', 'Repouso');
    static Transito             = new TipoCriptografia('transito', 'Transito');
    static Total                = new TipoCriptografia('total', 'Total');

    constructor(key, value) {
        super();
        this.Key    = key;
        this.Value  = value;
        this.JQuery = `#${key}`;

        if (!TipoCriptografia.All.some(x => x.Key === key)) {
            TipoCriptografia.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(TipoCriptografia.All);