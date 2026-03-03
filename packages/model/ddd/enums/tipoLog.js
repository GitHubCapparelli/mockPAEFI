// packages/model/ddd/enums/tipoLog.js
import { BaseEnum } from "./_baseEnum.js";
export class TipoLog extends BaseEnum {
    static All = [];

    static NaoInformada     = new TipoLog('NaoInformado','Não Informado', true);
    static Erro             = new TipoLog('Erro','Erro');
    static Backend          = new TipoLog('Backend','Backend');
    static Frontend         = new TipoLog('Frontend','Frontend');
    static Qualidade        = new TipoLog('Qualidade','Qualidade');
    static Desempenho       = new TipoLog('Desempenho','Desempenho');
    static Compliance       = new TipoLog('Compliance','Compliance');

    constructor(key, value, isDefault = false) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        this.IsDefault  = isDefault;

        if (!TipoLog.All.some(x => x.Key === key)) {
            TipoLog.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(TipoLog.All);