// packages/model/ddd/enums/funcaoUsuario.js
import { BaseEnum } from "./_baseEnum.js";
export class FuncaoUsuario extends BaseEnum {
    static All = [];

    static NaoInformada        = new FuncaoUsuario('NaoInformada','Não Informada', true);
    static Assessor            = new FuncaoUsuario('Assessor','Assessor');
    static AssessorEspecial    = new FuncaoUsuario('AssessorEspecial','Assessor Especial');
    static AssessorTecnico     = new FuncaoUsuario('AssessorTecnico','Assessor Técnico');
    static Chefe               = new FuncaoUsuario('Chefe','Chefe');
    static ChefeGabinete       = new FuncaoUsuario('ChefeGabinete','Chefe de Gabinete');
    static Coordenador         = new FuncaoUsuario('Coordenador','Coordenador');
    static Diretor             = new FuncaoUsuario('Diretor','Diretor');
    static Gerente             = new FuncaoUsuario('Gerente','Gerente');
    static Ouvidor             = new FuncaoUsuario('Ouvidor','Ouvidor');
    static SecretarioAdjunto   = new FuncaoUsuario('SecretarioAdjunto','Secretário Adjunto');
    static SecretarioEstado    = new FuncaoUsuario('SecretarioEstado','Secretário de Estado');
    static SecretarioExecutivo = new FuncaoUsuario('SecretarioExecutivo','Secretário Executivo');
    static SubSecretario       = new FuncaoUsuario('SubSecretario','Sub-Secretário');
    static Outra               = new FuncaoUsuario('Outra','Outra');

    constructor(key, value, isDefault = false) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        this.IsDefault  = isDefault;

        if (!FuncaoUsuario.All.some(x => x.Key === key)) {
            FuncaoUsuario.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(FuncaoUsuario.All);