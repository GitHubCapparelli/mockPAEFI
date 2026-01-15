// ui paefi core omData

import * as API from '../../../services/api/_index.js';
import * as DTO from '../../../data/factory/_index.js';
import * as Enum from './omEnum.js';

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

export class Metadata {         // fields, attribs (spec)
    static All = [];
    constructor({ 
        key, 
        dbColName,                    // db colName       (record attribute)
        uiKey,                        // ui rows and modals
        uiGroupKey,                   // ui filters
        uiTitle,                      // ui labels        (modal), columns (datagrid), ...
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
    } ) {                                               // origem?
        this.Key            = key;

        this.DbColName      = dbColName;
        this.UiKey          = uiKey;
        this.UiTitle        = uiTitle;
        this.UiGroupKey     = uiGroupKey;

        this.Type           = type;
        this.PfKey          = pfKey;
        this.Required       = required;
        this.Value          = defaultValue;
        this.IsUnique       = isUnique;
        this.MinLength      = minLen;
        this.MaxLength      = maxLen;
        this.Cripto         = cripto.Key;
        this.Access         = access.Key;
        this.IsSensitive    = isSensitive;

        if (!Metadata.All.some(x => x.Key === key)) {
            Metadata.All.push(this);
        }
    }

    Mandatory() {
        this.Required = true;
        return this;
    }

    static Id                  = new Metadata({ key: crypto.randomUUID(), dbColName:'id'            , uiKey:'#id'                , type:'UUID', pfKey:'PK' });
    static CriadoPor           = new Metadata({ key: crypto.randomUUID(), dbColName:'criadoPorID'   , uiKey:'#txtCriadoPorID'    , uiTitle: 'Criado Por'        , type:'UUID', pfKey:'FK'   , required: true });
    static AlteradoPor         = new Metadata({ key: crypto.randomUUID(), dbColName:'alteradoPorID' , uiKey:'#txtAlteradoPorID'  , uiTitle: 'Alterado Por'      , type:'UUID', pfKey:'FK'   , required: true });
    static DeletadoPor         = new Metadata({ key: crypto.randomUUID(), dbColName:'deletadoPorID' , uiKey:'#txtDeletadoPorID'  , uiTitle: 'Deletado Por'      , type:'UUID', pfKey:'FK'   , required: true });
    static CriadoEm            = new Metadata({ key: crypto.randomUUID(), dbColName:'criadoEm'      , uiKey:'#txtCriadoEm'       , uiTitle: 'Criado Em'         , type:'datetime UTC'       , required: true, defaultValue:'now' });
    static AlteradoEm          = new Metadata({ key: crypto.randomUUID(), dbColName:'alteradoEm'    , uiKey:'#txtAlteradoEm'     , uiTitle: 'Alterado Em'       , type:'datetime UTC' });
    static DeletadoEm          = new Metadata({ key: crypto.randomUUID(), dbColName:'deletadoEm'    , uiKey:'#txtDeletadoEm'     , uiTitle: 'Deletado Em'       , type:'datetime UTC' });
    static ExclusaoFisica      = new Metadata({ key: crypto.randomUUID(), dbColName:'excFisica'     , uiKey:'#chkExcFisica'      , uiTitle: 'Exclusão Física'   , type:'bool' });
    static Justificativa       = new Metadata({ key: crypto.randomUUID(), dbColName:'justificativa' , uiKey:'#txtJustificativa'  , uiTitle: 'Justificativa'     , type:'text' });
    
    static Nome                = new Metadata({ key: crypto.randomUUID(), dbColName:'nome'          , uiKey:'#txtNome'           , uiTitle: 'Nome'           , minLen: 15 , maxLen: 250 });
    static Descricao           = new Metadata({ key: crypto.randomUUID(), dbColName:'descricao'     , uiKey:'#txtDescricao'      , uiTitle: 'Descrição'      , minLen: 10 });
    static Versao              = new Metadata({ key: crypto.randomUUID(), dbColName:'versao'        , uiKey:'#txtVersao'         , uiTitle: 'Versão'         , minLen: 1  , maxLen: 10 });
    static Finalidade          = new Metadata({ key: crypto.randomUUID(), dbColName:'finalidade'    , uiKey:'#txtFinalidade'     , uiTitle: 'Finalidade'     , minLen: 10 , maxLen: 150 });
    
    static Sigla               = new Metadata({ key: crypto.randomUUID(), dbColName:'sigla'         , uiKey:'#txtSigla'          , uiTitle: 'Unidade'        , minLen: 5 , maxLen: 250, required: true     });
    static IbgeId              = new Metadata({ key: crypto.randomUUID(), dbColName:'ibgeId'        , uiKey:'#txtIbgeId'         , uiTitle: 'IBGE'           , minLen: 11, maxLen: 11 });
    
    static Login               = new Metadata({ key: crypto.randomUUID(), dbColName:'login'         , uiKey:'#txtLogin'          , uiTitle: 'Login'          , required: true   , minLen: 5 , maxLen: 50        , isSensitive: true });
    static Matricula           = new Metadata({ key: crypto.randomUUID(), dbColName:'matricula'     , uiKey:'#txtMatricula'      , uiTitle: 'Matrícula'      , required: true   , minLen: 8 , maxLen: 8         , isSensitive: true });
    static CpfServidor         = new Metadata({ key: crypto.randomUUID(), dbColName:'cpf'           , uiKey:'#txtCPF'            , uiTitle: 'CPF'            , required: true   , minLen: 11, maxLen: 11        , isSensitive: true , cripto: TipoCriptografia.Total, access: TipoAcesso.Sigiloso });

    static Hierarquia          = new Metadata({ key: crypto.randomUUID(), dbColName:'hierarquiaID'  , uiKey:'#hierarquiaID'      , uiTitle: 'Hierarquia'     , required: true   , type:'UUID'   , pfKey:'FK' });
    static UnidadeID           = new Metadata({ key: crypto.randomUUID(), dbColName:'unidadeID'     , uiKey:'#unidadeID'         , uiTitle: 'Unidade'        , required: true   , type:'UUID'   , pfKey:'FK'    , uiGroupKey:'#cmbFilterUnidade' });
    
    static FuncaoUnidade       = new Metadata({ key: crypto.randomUUID(), dbColName:'funcao'        , uiKey:'#funcao'            , uiTitle: 'Função'         , required: true   , type:'enum'   , uiGroupKey:'#cmbFilterFuncaoUnidade' });
    static FuncaoUsuario       = new Metadata({ key: crypto.randomUUID(), dbColName:'funcao'        , uiKey:'#funcao'            , uiTitle: 'Função'         , required: true   , type:'enum'   , uiGroupKey:'#cmbFilterFuncaoUsuario' });
    static CargoUsuario        = new Metadata({ key: crypto.randomUUID(), dbColName:'cargo'         , uiKey:'#cargo'             , uiTitle: 'Cargo'          , required: true   , type:'enum'   , uiGroupKey:'#cmbFilterCargo' });
    static Especialidade       = new Metadata({ key: crypto.randomUUID(), dbColName:'especialidade' , uiKey:'#especialidade'     , uiTitle: 'Especialidade'  , required: true   , type:'enum'   , uiGroupKey:'#cmbFilterEspecialidade' });
};

export class Binding {
    static All = [];
    constructor({ 
        key,
        dbInfo,
        dtoId,
        uiFieldTitle,
        uiFilterKey     = null, 
        uiFilterTitle   = null,
        lookup          = null,
        lookupId        = null,
        displayId       = null,
        onGrid          = true
    } ) {                      
        this.DbInfo         = dbInfo;
        this.DtoId          = dtoId;
        this.UiFieldTitle   = uiFieldTitle;
        this.UiFilterKey    = uiFilterKey;
        this.UiFilterTitle  = uiFilterTitle;
        this.Lookup         = lookup;
        this.LookupId       = lookupId;
        this.DisplayId      = displayId;
        this.OnGrid         = onGrid;

        if (!Binding.All.some(x => x.Key === key)) {
            Binding.All.push(this);
        }
    }

    static FuncaoUnidade    = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.FuncaoUnidade,    dtoId:'funcao',            uiFieldTitle: 'Função',         uiFilterKey:'#cmbFuncao',           uiFilterTitle:'Todas as Funções',           lookup: Enum.FuncaoUnidade });
    static SiglaUnidade     = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Sigla,            dtoId:'sigla',             uiFieldTitle: 'Sigla' });
    static NomeUnidade      = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Nome.Mandatory(), dtoId:'nome',              uiFieldTitle: 'Nome' });
    static IbgeId           = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.IbgeId,           dtoId:'ibgeId',            uiFieldTitle: 'Cod. IBGE' });
    
    static NomeServidor     = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Nome.Mandatory(), dtoId:'nome',              uiFieldTitle: 'Nome' });
    static Unidade          = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Especialidade,    dtoId:'unidadeID',         uiFieldTitle: 'Unidade',        uiFilterKey:'#cmbUnidades',         uiFilterTitle:'Todas as Unidades',          lookupId:'unidades',           displayId: 'sigla' });
    static FuncaoUsuario    = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.FuncaoUsuario,    dtoId:'funcao',            uiFieldTitle: 'Função',         uiFilterKey:'#cmbFuncao',           uiFilterTitle:'Todas as Funções',           lookup: Enum.FuncaoUsuario });
    static CargoUsuario     = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.CargoUsuario,     dtoId:'cargo',             uiFieldTitle: 'Cargo',          uiFilterKey:'#cmbCargo',            uiFilterTitle:'Todos os Cargos',            lookup: Enum.CargoUsuario });
    static Especialidade    = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Especialidade,    dtoId:'especialidade',     uiFieldTitle: 'Especialidade',  uiFilterKey:'#cmbEspecialidade',    uiFilterTitle:'Todas as Especialidades',    lookup: Enum.Especialidade });
    static Login            = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Login,            dtoId:'login',             uiFieldTitle: 'Login',          onGrid:false });
    static Matricula        = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Matricula,        dtoId:'matricula',         uiFieldTitle: 'Matrícula',      onGrid:false });
    static CpfServidor      = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.CpfServidor,      dtoId:'cpf',               uiFieldTitle: 'CPF',            onGrid:false });
}

export class Catalog {          // DatabaseTable, dataSource
    static All = [];

    static SharedFields = {
        Id              : Metadata.Id,
        CriadoEm        : Metadata.CriadoEm,
        CriadoPor       : Metadata.CriadoPor,
        AlteradoEm      : Metadata.AlteradoEm,
        AlteradoPor     : Metadata.AlteradoPor,
        DeletadoEm      : Metadata.DeletadoEm,
        DeletadoPor     : Metadata.DeletadoPor,
        ExclusaoFisica  : Metadata.ExclusaoFisica,
        Justificativa   : Metadata.Justificativa
    };

    constructor(key, name, versao, finalidade, fields = [] ) {
        this.Key    = key;
        this.Name   = name;
        this.JQuery = `#${key}`;

        this.Versao     = { ...Metadata.Versao      , Value: versao };
        this.Finalidade = { ...Metadata.Finalidade  , Value: finalidade  };
        this.Campos     = [ ...Object.values(Catalog.SharedFields), ...fields];

        this.Metadata   = this.Campos.filter(campo => campo instanceof Metadata);
        this.Bindings   = this.Campos.filter(campo => campo instanceof Binding);

        if (!Catalog.All.some(x => x.Key === key || x.Name === name)) {
            Catalog.All.push(this);
        }
    }

    static Unidades           = new Catalog(crypto.randomUUID(), 'Unidades', '0.1', 'Armazenar dados de unidades organizacionais',
        [Metadata.Hierarquia, Binding.SiglaUnidade, Binding.NomeUnidade, Binding.FuncaoUnidade, Binding.IbgeId ]);

    static UsuariosServidores = new Catalog(crypto.randomUUID(), 'UsuariosServidores', '0.1', 'Armazenar dados de servidores',
        [ Binding.Unidade, Binding.NomeServidor, Binding.FuncaoUsuario, Binding.CargoUsuario, Binding.Especialidade, Binding.Login, Binding.Matricula, Binding.CpfServidor ]);
};

export class DomainInfo {           
    static All = [];

    constructor(key, name, api, dto, catalog, schema, lookups = {}) {
        this.Key        = key;
        this.Name       = name;
        this.API        = api;
        this.DTO        = dto;
        this.Catalog    = catalog;
        this.Schema     = schema;
        this.Lookups    = lookups;

        if (!DomainInfo.All.some(x => x.Key === key || x.Name === name)) {
            DomainInfo.All.push(this);
        }
    }

    static Create(key) {
        const instance = DomainInfo.All.find(x => x.Key === key);
        if (!instance) {
            console.warn(`[DomainInfo.Create] Não localizado: key '${key}'`);
        }
        return instance;
    }

    static Unidades = new DomainInfo('unidades', 'Unidade', API.UnidadesAPI, DTO.UnidadeDTO, 
        Catalog.Unidades, 'unidadeSchema.json');
    
    static UsuariosServidores = new DomainInfo('usuarios-servidores', 'Usuário Servidor', API.UsuariosServidoresAPI, DTO.UsuarioServidorDTO, 
        Catalog.UsuariosServidores, 'usuarioServidorSchema.json', { unidades: API.UnidadesAPI });
};

///////////////////////////////////

