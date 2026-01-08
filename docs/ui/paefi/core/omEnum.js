export class Elemento {
    static All = [];

    static FromKey(key)        { return Elemento.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return Elemento.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return Elemento.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return Elemento.FromValue(value)?.Key ?? null; }

    static TextoLogin          = new Elemento('txtUser-login','Login');
    static TextoTituloPagina   = new Elemento('page-title-text','Página');
    static TextoOpcaoAtual     = new Elemento('domain-title','Opção');
    static DivOpcoesDominio    = new Elemento('divOpcoes','Opções');
    static DivPreferencias     = new Elemento('divPreferencias','Preferências');
    static DivOurDocs          = new Elemento('divOurDocs','Documentos');
    static DivFilterOptions    = new Elemento('divFilterOptions','');
    static DataSection         = new Elemento('dataSection','');
    static PageBody            = new Elemento('page-body','');

    constructor(key, value) {
        this.Key    = key;
        this.Value  = value;
        this.JQuery = `#${key}`;

        if (!Elemento.All.some(x => x.Key === key)) {
            Elemento.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(Elemento.All);


export class DocLinks {
    static All = [];

    static FromKey(key)        { return DocLinks.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return DocLinks.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return DocLinks.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return DocLinks.FromValue(value)?.Key ?? null; }

    static DocExecutivo        = new DocLinks('docExecutivo','Documento Executivo');
    static DocTecnico          = new DocLinks('docTecnico','Documetação Técnica');
    static DocUsuario          = new DocLinks'docUsuario','Manual do Usuário');

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!DocLinks.All.some(x => x.Key === key)) {
            DocLinks.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(DocLinks.All);


export class Modulo {
    static All = [];

    static FromKey(key)        { return Modulo.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return Modulo.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return Modulo.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return Modulo.FromValue(value)?.Key ?? null; }

    static Nenhum       = new Modulo('','Módulo');
    static Admin        = new Modulo('admin','Administração');
    static Monitor      = new Modulo('monitor','Supervisão');
    static Atender      = new Modulo('atender','Atendimento');

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!Modulo.All.some(x => x.Key === key)) {
            Modulo.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(Modulo.All);


export class Dominio {
    static All = [];

    static FromKey(key)        { return Dominio.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return Dominio.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return Dominio.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return Dominio.FromValue(value)?.Key ?? null; }

    static Nenhum               = new Dominio('','Domínio');
    static Anotacoes            = new Dominio('anotacoes', 'Anotações');
    static Atendimentos         = new Dominio('atendimentos', 'Atendimentos');
    static Atividades           = new Dominio('atividades', 'Atividades');
    static CasosDeUso           = new Dominio('casos-de-uso', 'Casos de Uso');
    static Compromissos         = new Dominio('compromissos', 'Compromissos');
    static Demandas             = new Dominio('demandas','Demandas');
    static Denuncias            = new Dominio('denuncias', 'Denuncias');
    static Documentos           = new Dominio('documentos','Documentos');
    static Enderecos            = new Dominio('enderecos', 'Endereços');
    static Historico            = new Dominio('historico', 'Histórico de Operacoes');
    static Interfaces           = new Dominio('interfaces', 'Interfaces (wireframes)');
    static Objetivos            = new Dominio('objetivos', 'Objetivos');
    static Processos            = new Dominio('processos', 'Processos');
    static Riscos               = new Dominio('riscos', 'Riscos');
    static Servicos             = new Dominio('servicos', 'Serviços');
    static Tarefas              = new Dominio('tarefas', 'Tarefas');
    static Unidades             = new Dominio('unidades','Unidades');
    static usuariosCidadaos     = new Dominio('usuarios-cidadaos','Usuarios Cidadãos');
    static UsuariosServidores   = new Dominio('usuarios-servidores','Usuários Servidores');
    static Violações            = new Dominio('violacoes','Violações');

    constructor(key, value) {
        this.Key       = key;
        this.Value     = value;
        this.JQuery    = `#${key}`;

        if (!Dominio.All.some(x => x.Key === key)) {
            Dominio.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(Dominio.All);


export class FuncaoUnidade {
    static All = [];

    static FromKey(key)        { return FuncaoUnidade.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return FuncaoUnidade.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return FuncaoUnidade.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return FuncaoUnidade.FromValue(value)?.Key ?? null; }

    static NaoInformada        = new FuncaoUnidade('NaoInformada','Não Informada');
    static Direcao             = new FuncaoUnidade('Direcao','Direção');
    static Coordenacao         = new FuncaoUnidade('Coordenacao','Coordenação');
    static Gestao              = new FuncaoUnidade('Gestao','Gestão');
    static Governanca          = new FuncaoUnidade('Governanca','Governança');
    static AssistenciaSocial   = new FuncaoUnidade('AssistenciaSocial','Assistencia Social');
    static Outra               = new FuncaoUnidade('Outra','Outra');

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!FuncaoUnidade.All.some(x => x.Key === key)) {
            FuncaoUnidade.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(FuncaoUnidade.All);


export class FuncaoUsuario {
    static All = [];

    static FromKey(key)        { return FuncaoUsuario.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return FuncaoUsuario.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return FuncaoUsuario.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return FuncaoUsuario.FromValue(value)?.Key ?? null; }

    static NaoInformada        = new FuncaoUsuario('NaoInformada','Não Informada');
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

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!FuncaoUsuario.All.some(x => x.Key === key)) {
            FuncaoUsuario.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(FuncaoUsuario.All);


export class CargoUsuario {
    static All = [];

    static FromKey(key)        { return CargoUsuario.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return CargoUsuario.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return CargoUsuario.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return CargoUsuario.FromValue(value)?.Key ?? null; }

    static NaoInformado               = new CargoUsuario('NaoInformado','Não Informado');
    static AnalistaPlanejamento       = new CargoUsuario('AnalistaPlanejamento','Analista de Planejamento');
    static AnalistaPoliticasPublicas  = new CargoUsuario('AnalistaPoliticasPublicas','Analista de Políticas Públicas');
    static GestorPoliticasPublicas    = new CargoUsuario('GestorPoliticasPublicas','Gestor de Políticas Públicas');
    static AuxiliarAdministrativo     = new CargoUsuario('AuxiliarAdministrativo','Auxiliar Administrativo');
    static AuxiliarAssistenciaSocial  = new CargoUsuario('AuxiliarAssistenciaSocial','Auxiliar de Assistência Social');
    static Especialista               = new CargoUsuario('Especialista','Especialista');
    static Tecnico                    = new CargoUsuario('Tecnico','Técnico');
    static Outro                      = new CargoUsuario('Outro','Outro');

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!CargoUsuario.All.some(x => x.Key === key)) {
            CargoUsuario.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(CargoUsuario.All);


export class Especialidade {
    static All = [];

    static FromKey(key)        { return Especialidade.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return Especialidade.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return Especialidade.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return Especialidade.FromValue(value)?.Key ?? null; }

    static NaoInformada           = new Especialidade('NaoInformada','Não Informada');
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

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!Especialidade.All.some(x => x.Key === key)) {
            Especialidade.All.push(this);
        }
        Object.freeze(this);
    }
 
    toJSON() { return this.Key; }
}
Object.freeze(Especialidade.All);
