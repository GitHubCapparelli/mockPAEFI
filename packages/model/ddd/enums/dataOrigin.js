// packages/model/ddd/enums/dataOrigin.js
import { BaseEnum } from "./_baseEnum.js";
export class DataOrigin extends BaseEnum {
    static All = [];

    static NaoInformado = new DataOrigin('NaoInformado', 'Não Informado', true);
    static Producao = new DataOrigin('Producao', 'Produção');
    static Homolog = new DataOrigin('Homolog', 'Homologação');
    static Research = new DataOrigin('Research', 'Pesquisa e desenvolvimento (interno)');
    static RemotePoC = new DataOrigin('RemotePoC', 'Pesquisa e desenvolvimento (remoto)')

    constructor(key, value, isDefault = false) {
        super();
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;
        this.IsDefault = isDefault;

        if (!DataOrigin.All.some(x => x.Key === key)) {
            DataOrigin.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(DataOrigin.All);