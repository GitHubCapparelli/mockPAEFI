// packages/model/ddd/enums/especialidade.js
import { BaseEnum } from "./_baseEnum.js";
export class Especialidade extends BaseEnum {
    static All = [];

    static NaoInformada           = new Especialidade('NaoInformada','Não Informada', true);
    static Administrador          = new Especialidade('Administrador','Administrador');
    static AgenteAdministrativo   = new Especialidade('AgenteAdministrativo','Agente Administrativo');
    static AgenteSocial           = new Especialidade('AgenteSocial','Agente Social');
    static AssistenteSocial       = new Especialidade('AssistenteSocial','Assistente Social');
    static ComunicadorSocial      = new Especialidade('ComunicadorSocial','Comunicador Social');
    static Contador               = new Especialidade('Contador','Contador');
    static CuidadorSocial         = new Especialidade('CuidadorSocial','Cuidador Social');
    static DireitoLegislativo     = new Especialidade('DireitoLegislativo','Direito Legislativo');
    static EducadorSocial         = new Especialidade('EducadorSocial','Educador Social');
    static Marceneiro             = new Especialidade('Marceneiro','Marceneiro');
    static Motorista              = new Especialidade('Motorista','Motorista');
    static Nutricionista          = new Especialidade('Nutricionista','Nutricionista');
    static OperadorGrafico        = new Especialidade('OperadorGrafico','Operador Gráfico');
    static Pedagogo               = new Especialidade('Pedagogo','Pedagogo');
    static Planejamento           = new Especialidade('Planejamento','Planejamento');
    static Psicologo              = new Especialidade('Psicologo','Psicologo');
    static TecnicoEducacaoFisica  = new Especialidade('TecnicoEducacaoFisica','Técnico em Educação Física');
    static TecnicoEducacional     = new Especialidade('TecnicoEducacional','Técnico Educacional');
    static Outra                  = new Especialidade('Outra','Outra');

    constructor(key, value, isDefault = false) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        this.IsDefault  = isDefault;

        if (!Especialidade.All.some(x => x.Key === key)) {
            Especialidade.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(Especialidade.All);