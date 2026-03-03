// packages/model/ddd/enums/funcaoUnidade.js
import { BaseEnum } from "./_baseEnum.js";
export class FuncaoUnidade extends BaseEnum {
    static All = [];

    static NaoInformada        = new FuncaoUnidade('NaoInformada','Não Informada', true);
    static Direcao             = new FuncaoUnidade('Direcao','Direção');
    static Coordenacao         = new FuncaoUnidade('Coordenacao','Coordenação');
    static Gestao              = new FuncaoUnidade('Gestao','Gestão');
    static Governanca          = new FuncaoUnidade('Governanca','Governança');
    static AssistenciaSocial   = new FuncaoUnidade('AssistenciaSocial','Assistencia Social');
    static Outra               = new FuncaoUnidade('Outra','Outra');

    constructor(key, value, isDefault = false) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        this.IsDefault  = isDefault;

        if (!FuncaoUnidade.All.some(x => x.Key === key)) {
            FuncaoUnidade.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(FuncaoUnidade.All);