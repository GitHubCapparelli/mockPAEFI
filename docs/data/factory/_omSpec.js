// docs data factory _omSpec

export class BaseEnum {
    static All = [];

    static FromKey(key) { return this.All.find(x => x.Key === key) ?? null; }
    static FromValue(value) { return this.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key) { return this.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return this.FromValue(value)?.Key ?? null; }
}

export class TipoCriptografia extends Enum.BaseEnum {
    static All = [];

    static Nenhuma              = new TipoCriptografia('nenhuma', 'Nenhuma');
    static Repouso              = new TipoCriptografia('repouso', 'Repouso');
    static Transito             = new TipoCriptografia('transito', 'Transito');
    static Total                = new TipoCriptografia('total', 'Total');

    constructor(key, value) {
        super();
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!TipoCriptografia.All.some(x => x.Key === key)) {
            TipoCriptografia.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(TipoCriptografia.All);

export class TipoAcesso extends Enum.BaseEnum {
    static All = [];

    static Interno          = new TipoAcesso('interno', 'Interno');
    static Privado          = new TipoAcesso('privado', 'Privado');
    static Publico          = new TipoAcesso('publico', 'Publico');
    static Sigiloso         = new TipoAcesso('sigiloso', 'Sigiloso');
    static Compartilhado    = new TipoAcesso('compartilhado', 'Compartilhado');
    static RBAC             = new TipoAcesso('rbac', 'RBAC');

    constructor(key, value) {
        super();
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!TipoAcesso.All.some(x => x.Key === key)) {
            TipoAcesso.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(TipoAcesso.All);

export class TipoLog extends Enum.BaseEnum {
    static All = [];

    static NaoInformado     = new TipoLog('naoInformado', 'Não informado');
    static Erro             = new TipoLog('erro', 'Erro');
    static Backend          = new TipoLog('backend', 'Backend');
    static Frontend         = new TipoLog('frontend', 'Frontend');
    static Qualidade        = new TipoLog('qualidade', 'Qualidade');
    static Compliance       = new TipoLog('compliance', 'Compliance');
    static Desempenho       = new TipoLog('desempenho', 'Desempenho');

    constructor(key, value) {
        super();
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!TipoLog.All.some(x => x.Key === key)) {
            TipoLog.All.push(this);
        }
        Object.freeze(this);
    }
};
Object.freeze(TipoLog.All);

//////////////////////////

export class Campo {         
    static All = [];
    constructor({ 
        key, 
        dbColName,                    
        type          = 'string', 
        pfKey         = '', 
        required      = false, 
        defaultValue  = null, 
        isUnique      = false, 
        minLen        = null, 
        maxLen        = null,
        cripto        = TipoCriptografia.Nenhuma, 
        access        = TipoAcesso.Interno,
        isSensitive   = false
    } ) {                                               
        this.Key            = key;

        this.DbColName      = dbColName;
        this.Type           = type;
        this.PfKey          = pfKey;
        this.Value          = defaultValue;
        this.IsUnique       = isUnique;
        this.MinLength      = minLen;
        this.MaxLength      = maxLen;
        this.Cripto         = cripto.Key;
        this.Access         = access.Key;
        this.IsSensitive    = isSensitive;

        if (!Campo.All.some(x => x.Key === key)) {
            Campo.All.push(this);
        }
    }

    Mandatory() {
        this.Required = true;
        return this;
    }

    static Id                  = new Campo({ key: crypto.randomUUID(), dbColName:'id'            , type:'UUID'               , pfKey:'PK' });
    static CriadoPor           = new Campo({ key: crypto.randomUUID(), dbColName:'criadoPorID'   , type:'UUID'               , pfKey:'FK' });
    static AlteradoPor         = new Campo({ key: crypto.randomUUID(), dbColName:'alteradoPorID' , type:'UUID'               , pfKey:'FK' });
    static DeletadoPor         = new Campo({ key: crypto.randomUUID(), dbColName:'deletadoPorID' , type:'UUID'               , pfKey:'FK' });
    static CriadoEm            = new Campo({ key: crypto.randomUUID(), dbColName:'criadoEm'      , type:'datetime UTC'       , defaultValue:'now' });
    static AlteradoEm          = new Campo({ key: crypto.randomUUID(), dbColName:'alteradoEm'    , type:'datetime UTC' });
    static DeletadoEm          = new Campo({ key: crypto.randomUUID(), dbColName:'deletadoEm'    , type:'datetime UTC' });
    static ExclusaoFisica      = new Campo({ key: crypto.randomUUID(), dbColName:'excFisica'     , type:'bool' });
    
    static Nome                = new Campo({ key: crypto.randomUUID(), dbColName:'nome'          , minLen: 15 , maxLen: 250 });
    static Descricao           = new Campo({ key: crypto.randomUUID(), dbColName:'descricao'     , minLen: 10 });
    static Acao                = new Campo({ key: crypto.randomUUID(), dbColName:'acao'          , minLen: 1  , maxLen: 10 });
    static Versao              = new Campo({ key: crypto.randomUUID(), dbColName:'versao'        , minLen: 1  , maxLen: 10 });
    static Finalidade          = new Campo({ key: crypto.randomUUID(), dbColName:'finalidade'    , minLen: 10 , maxLen: 150 });

    static DataHora            = new Campo({ key: crypto.randomUUID(), dbColName:'dataHora '     , type: 'datetime UTC' }); // text [20-20] 2025-12-01T00:00:00Z
    static Justificativa       = new Campo({ key: crypto.randomUUID(), dbColName:'justificativa' , type:'text' });
    static Diff                = new Campo({ key: crypto.randomUUID(), dbColName:'diff'          , type:'text' });
    
    static Sigla               = new Campo({ key: crypto.randomUUID(), dbColName:'sigla'         , minLen: 5 , maxLen: 250 });
    static IbgeId              = new Campo({ key: crypto.randomUUID(), dbColName:'ibgeId'        , minLen: 11, maxLen: 11 });
    static SessionId           = new Campo({ key: crypto.randomUUID(), dbColName:'sessionId'     , minLen: 36, maxLen: 36 });
    
    static Login               = new Campo({ key: crypto.randomUUID(), dbColName:'login'         , minLen: 5 , maxLen: 50        , isSensitive: true });
    static Matricula           = new Campo({ key: crypto.randomUUID(), dbColName:'matricula'     , minLen: 8 , maxLen: 8         , isSensitive: true });
    static CpfServidor         = new Campo({ key: crypto.randomUUID(), dbColName:'cpf'           , minLen: 11, maxLen: 11        , isSensitive: true , cripto: TipoCriptografia.Total, access: TipoAcesso.Sigiloso });

    static HierarquiaID        = new Campo({ key: crypto.randomUUID(), dbColName:'hierarquiaID'  , type:'UUID'   , pfKey:'FK' });
    static UnidadeID           = new Campo({ key: crypto.randomUUID(), dbColName:'unidadeID'     , type:'UUID'   , pfKey:'FK' });
    static CatalogoID          = new Campo({ key: crypto.randomUUID(), dbColName:'catalogoID'    , type:'UUID'   , pfKey:'FK' });
    static UsuarioID           = new Campo({ key: crypto.randomUUID(), dbColName:'userID'        , type:'UUID'   , pfKey:'FK' });
    
    static FuncaoUnidade       = new Campo({ key: crypto.randomUUID(), dbColName:'funcao'        , type:'enum' });
    static FuncaoUsuario       = new Campo({ key: crypto.randomUUID(), dbColName:'funcao'        , type:'enum' });
    static CargoUsuario        = new Campo({ key: crypto.randomUUID(), dbColName:'cargo'         , type:'enum' });
    static Especialidade       = new Campo({ key: crypto.randomUUID(), dbColName:'especialidade' , type:'enum' });

    static TipoRegistro        = new Campo({ key: crypto.randomUUID(), dbColName:'tipo'          , type:'enum' });
};

export class Tabela {          
    static All = [];

    static SharedFields = {
        Id              : Campo.Id,
        CriadoEm        : Campo.CriadoEm,
        CriadoPor       : Campo.CriadoPor,
        AlteradoEm      : Campo.AlteradoEm,
        AlteradoPor     : Campo.AlteradoPor,
        DeletadoEm      : Campo.DeletadoEm,
        DeletadoPor     : Campo.DeletadoPor,
        ExclusaoFisica  : Campo.ExclusaoFisica,
        Justificativa   : Campo.Justificativa
    };

    constructor(key, name, versao, finalidade, fields = [] ) {
        this.Key    = key;
        this.Name   = name;
        this.JQuery = `#${key}`;

        this.Versao     = { ...Campo.Versao      , Value: versao };
        this.Finalidade = { ...Campo.Finalidade  , Value: finalidade  };
        this.Campos     = [ ...Object.values(Tabela.SharedFields), ...fields];

        if (!Tabela.All.some(x => x.Key === key || x.Name === name)) {
            Tabela.All.push(this);
        }
    }

    static Catalogos = new Tabela(crypto.randomUUID(), 'Catalogos', '0.1', 'Armazenar metadados das tabelas (data sources)',
        [ Campo.Nome.Mandatory(), Campo.Funcao.Mandatory(), Campo.Versao.Mandatory() ]);

    static Historico = new Tabela(crypto.randomUUID(), 'Historico', '0.1', 'Armazenar dados de eventos operacionais',
        [ Campo.DataHora.Mandatory(), Campo.UsuarioID.Mandatory(), Campo.CatalogoID.Mandatory(), Campo.Acao.Mandatory(), Campo.Justificativa, Campo.TipoRegistro.Mandatory(), Campo.Descricao, Campo.SessionId.Mandatory(), Campo.Diff.Mandatory() ]);

    static Unidades           = new Tabela(crypto.randomUUID(), 'Unidades', '0.1', 'Armazenar dados de unidades organizacionais',
        [ Campo.HierarquiaID, Campo.Sigla.Mandatory(), Campo.Nome, Campo.FuncaoUnidade.Mandatory(), Campo.IbgeId ]);

    static UsuariosServidores = new Tabela(crypto.randomUUID(), 'UsuariosServidores', '0.1', 'Armazenar dados de servidores',
        [ Campo.UnidadeID.Mandatory(), Campo.Nome.Mandatory(), Campo.FuncaoUsuario.Mandatory(), Campo.CargoUsuario.Mandatory(), Campo.Especialidade.Mandatory(), Campo.Login.Mandatory(), Campo.Matricula.Mandatory(), Campo.CpfServidor ]);
};
