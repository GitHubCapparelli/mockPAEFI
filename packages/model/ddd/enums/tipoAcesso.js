// packages/model/ddd/enums/tipoAcesso.js
import { BaseEnum } from "./_baseEnum.js";
export class TipoAcesso extends BaseEnum {
    static All = [];

    static Interno          = new TipoAcesso('interno', 'Interno');
    static Privado          = new TipoAcesso('privado', 'Privado');
    static Publico          = new TipoAcesso('publico', 'Publico');
    static Sigiloso         = new TipoAcesso('sigiloso', 'Sigiloso');
    static Compartilhado    = new TipoAcesso('compartilhado', 'Compartilhado');
    static RBAC             = new TipoAcesso('rbac', 'RBAC');

    constructor(key, value) {
        super();
        this.Key    = key;
        this.Value  = value;
        this.JQuery = `#${key}`;

        if (!TipoAcesso.All.some(x => x.Key === key)) {
            TipoAcesso.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(TipoAcesso.All);