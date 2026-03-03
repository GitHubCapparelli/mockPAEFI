// packages/model/ddd/enums/cargoUsuario.js
import { BaseEnum } from "./_baseEnum.js";
export class CargoUsuario extends BaseEnum {
    static All = [];

    static NaoInformado               = new CargoUsuario('NaoInformado','Não Informado', true);
    static AnalistaPlanejamento       = new CargoUsuario('AnalistaPlanejamento','Analista de Planejamento');
    static AnalistaPoliticasPublicas  = new CargoUsuario('AnalistaPoliticasPublicas','Analista de Políticas Públicas');
    static GestorPoliticasPublicas    = new CargoUsuario('GestorPoliticasPublicas','Gestor de Políticas Públicas');
    static AuxiliarAdministrativo     = new CargoUsuario('AuxiliarAdministrativo','Auxiliar Administrativo');
    static AuxiliarAssistenciaSocial  = new CargoUsuario('AuxiliarAssistenciaSocial','Auxiliar de Assistência Social');
    static Especialista               = new CargoUsuario('Especialista','Especialista');
    static Tecnico                    = new CargoUsuario('Tecnico','Técnico');
    static Outro                      = new CargoUsuario('Outro','Outro');

    constructor(key, value, isDefault = false) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        this.IsDefault  = isDefault;

        if (!CargoUsuario.All.some(x => x.Key === key)) {
            CargoUsuario.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(CargoUsuario.All);