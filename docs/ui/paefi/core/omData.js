// ui paefi core omData

import * as API from '../../../services/api/_index.js';
import * as DTO from '../../../data/factory/_index.js';
import * as Enum from './omEnum.js';

export class Metadata {         // fields, attribs (spec)
    static All = [];
    constructor({ 
        key, 
        dbColName,                    // db colName       (record attribute)
        uiKey,                        // ui control Id    (modal)
        uiTitle,                      // ui labels        (modal), columns (datagrid), ...
        type          = 'string', 
        pfKey         = '', 
        required      = false, 
        defaultValue  = null, 
        isUnique      = false, 
        minLen        = null, 
        maxLen        = null,
        cripto        = TipoCriptografia.Nenhuma.Key, 
        access        = TipoAcesso.Interno.Key,
        lookup        = lookup,
        domain        = domain
    } ) {                                               // origem?
        this.Key            = key;
        this.DbColName      = dbColName;
        this.UiKey          = uiKey;
        this.UiTitle        = uiTitle;
        this.JQuery         = `#${key}`;

        this.Type           = type;
        this.PfKey          = pfKey;
        this.Required       = required;
        this.Value          = defaultValue;
        this.IsUnique       = isUnique;
        this.MinLength      = minLen;
        this.MaxLength      = maxLen;
        this.Cripto         = cripto;
        this.Access         = access;
        
        this.Dominio        = domain;
        this.Lookup         = lookup

        if (!Metadata.All.some(x => x.Key === key)) {
            Metadata.All.push(this);
        }
    }

    static Id                  = new Metadata({ key: crypto.randomUUID(), dbColName:'id'            , uiKey:'id', type:'UUID', pfKey:'PK' });
    static CriadoPor           = new Metadata({ key: crypto.randomUUID(), dbColName:'criadoPorID'   , uiKey:'#txtCriadoPorID'    , uiTitle: 'Criado Por'         , type:'UUID', pfKey:'FK'   , required: true });
    static AlteradoPor         = new Metadata({ key: crypto.randomUUID(), dbColName:'alteradoPorID' , uiKey:'#txtAlteradoPorID'  , uiTitle: 'Alterado Por'       , type:'UUID', pfKey:'FK'   , required: true });
    static DeletadoPor         = new Metadata({ key: crypto.randomUUID(), dbColName:'deletadoPorID' , uiKey:'#txtDeletadoPorID'  , uiTitle: 'Deletado Por'       , type:'UUID', pfKey:'FK'   , required: true });
    static CriadoEm            = new Metadata({ key: crypto.randomUUID(), dbColName:'criadoEm'      , uiKey:'#txtCriadoEm'       , uiTitle: 'Criado Em'          , type:'datetime UTC'       , required: true, defaultValue:'now' });
    static AlteradoEm          = new Metadata({ key: crypto.randomUUID(), dbColName:'alteradoEm'    , uiKey:'#txtAlteradoEm'     , uiTitle: 'Alterado Em'        , type:'datetime UTC' });
    static DeletadoEm          = new Metadata({ key: crypto.randomUUID(), dbColName:'deletadoEm'    , uiKey:'#txtDeletadoEm'     , uiTitle: 'Deletado Em'        , type:'datetime UTC' });
    static ExclusaoFisica      = new Metadata({ key: crypto.randomUUID(), dbColName:'excFisica'     , uiKey:'#chkExcFisica'      , uiTitle: 'Exclusão Física'    , type:'bool' });
    
    static Nome                = new Metadata({ key: crypto.randomUUID(), dbColName:'nome'          , uiKey:'#txtNome'           , uiTitle: 'Nome'       , minLen: 15 , maxLen: 250 });
    static Descricao           = new Metadata({ key: crypto.randomUUID(), dbColName:'descricao'     , uiKey:'#txtDescricao'      , uiTitle: 'Descrição'  , minLen: 10 });
    static Versao              = new Metadata({ key: crypto.randomUUID(), dbColName:'versao'        , uiKey:'#txtVersao'         , uiTitle: 'Versão'     , minLen: 1  , maxLen: 10 });
    static Finalidade          = new Metadata({ key: crypto.randomUUID(), dbColName:'finalidade'    , uiKey:'#txtFinalidade'     , uiTitle: 'Finalidade' , minLen: 10 , maxLen: 150 });
    
    static Hierarquia          = new Metadata({ key: crypto.randomUUID(), dbColName:'hierarquiaID'  , uiKey:'#txtHierarquiaID'   , uiTitle: 'Hierarquia'     , type:'UUID', pfKey:'FK', required: true });
    static Sigla               = new Metadata({ key: crypto.randomUUID(), dbColName:'sigla'         , uiKey:'#txtSigla'          , uiTitle: 'Sigla'          , minLen: 5 , maxLen: 250, required: true     });
    static IbgeId              = new Metadata({ key: crypto.randomUUID(), dbColName:'ibgeId'        , uiKey:'#txtIbgeId'         , uiTitle: 'IBGE'           , minLen: 11, maxLen: 11 });
    
    static UnidadeID           = new Metadata({ key: crypto.randomUUID(), dbColName:'unidadeID'     , uiKey:'#cmbFilterUnidade'  , uiTitle: 'Unidade'        , type:'UUID'       , pfKey:'FK', required: true, domain: 'unidades' });
    static Login               = new Metadata({ key: crypto.randomUUID(), dbColName:'login'         , uiKey:'#txtLogin'          , uiTitle: 'Login'          , required: true    , minLen: 5 , maxLen: 50 });
    static Matricula           = new Metadata({ key: crypto.randomUUID(), dbColName:'matricula'     , uiKey:'#txtMatricula'      , uiTitle: 'Matrícula'      , required: true    , minLen: 8 , maxLen: 8 });
    static CPF                 = new Metadata({ key: crypto.randomUUID(), dbColName:'cpf'           , uiKey:'#txtCPF'            , uiTitle: 'CPF'            , required: true    , minLen: 11, maxLen: 11 });
    
    static UnidadeFuncao       = new Metadata({ key: crypto.randomUUID(), dbColName:'funcao'        , uiKey:'#cmbFilterFuncao'          , uiTitle: 'Função'         , required: true, type:'enum', lookup: Enum.FuncaoUnidade });
    static UsuarioFuncao       = new Metadata({ key: crypto.randomUUID(), dbColName:'funcao'        , uiKey:'#cmbFilterFuncao'          , uiTitle: 'Função'         , required: true, type:'enum', lookup: Enum.FuncaoUsuario });
    static UsuarioCargo        = new Metadata({ key: crypto.randomUUID(), dbColName:'cargo'         , uiKey:'#cmbFilterCargo'           , uiTitle: 'Cargo'          , required: true, type:'enum', lookup: Enum.CargoUsuario });
    static Especialidade       = new Metadata({ key: crypto.randomUUID(), dbColName:'especialidade' , uiKey:'#cmbFilterEspecialidade'   , uiTitle: 'Especialidade'  , required: true, type:'enum', lookup: Enum.Especialidade });
};


//
export class UsuariosServidoresSpecs {
    constructor() {
        this.api            = UsuariosServidoresAPI;
        this.lookups        = { unidades: UnidadesAPI.GetAll() };
        this.gridColumns    = [
            { title: 'Nome',            dto: 'nome' },
            { title: 'Unidade',         dto: 'unidade' },
            { title: 'Especialidade',   dto: 'especialidade' },
            { title: 'Função',          dto: 'funcao' },
            { title: 'Cargo',           dto: 'cargo' }
        ];
        Object.freeze(this);
    }

    apiFilters() {
        return {
        unidadeID      : $('#cmbFilterUnidade').val()       || null,
        especialidade  : $('#cmbFilterEspecialidade').val() || null,
        funcao         : $('#cmbFilterFuncao').val()        || null,
        cargo          : $('#cmbFilterCargo').val()         || null
        };
    }
  
    modalRequested(action, data, id = null) {
        if (action === 'create') {
            this.command.Create(data);
        } 
        if (action === 'update') {
            this.command.Update(id, data);
        } 
    }
};


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
        ExclusaoFisica  : Metadata.ExclusaoFisica
    };

    constructor(key, name, versao, finalidade, fields = [] ) {
        this.Key    = key;
        this.Name   = name;
        this.JQuery = `#${key}`;

        this.Versao     = { ...Metadata.Versao      , Value: versao };
        this.Finalidade = { ...Metadata.Finalidade  , Value: finalidade  };
        this.Campos     = [ ...Catalog.SharedFields, ...fields];

        if (!Catalog.All.some(x => x.Key === key || x.Name === name)) {
            Catalog.All.push(this);
        }
    }

    static Unidades           = new Catalog(crypto.randomUUID(), 'Unidades', '0.1', 'Armazenar dados de unidades organizacionais',
        [ Metadata.Hierarquia, Metadata.Sigla, Metadata.Nome, Metadata.FuncaoUnidade, Metadata.IbgeId ]);

    static UsuariosServidores = new Catalog(crypto.randomUUID(), 'UsuariosServidores', '0.1', 'Armazenar dados de servidores',
        [ Metadata.UnidadeID, Metadata.Nome, Metadata.Login, Metadata.Matricula, Metadata.CPF, Metadata.FuncaoUsuario, Metadata.CargoUsuario, Metadata.Especialidade ]);
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

    static async Create(key) {
        const info = DomainInfo.All.find(x => x.Key === key);
        if (!info) return null;

        const lookups = Object.values(info.Lookups);
        const allAPIs = [...new Set([info.API, ...lookups])]; // no duplicates

        await Promise.all(allAPIs.map(x => {
            if (typeof x.Init === 'function') {
                return x.Init();
            }
            return Promise.resolve(); // Fallback if Init doesn't exist
        }));

        return info;
    }

    static Unidades = new DomainInfo('unidades', 'Unidade', API.UnidadesAPI, DTO.CreateUnidadeDTO, 
        Catalog.Unidades, 'unidadeSchema.json');
    
    static UsuariosServidores = new DomainInfo('usuarios-servidores', 'Usuário Servidor', API.UsuariosServidoresAPI, DTO.CreateUsuarioServidorDTO, 
        Catalog.UsuariosServidores, 'usuarioServidorSchema.json', { unidades: API.UnidadesAPI });
};

///////////////////////////////////

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

        if ( TipoAcesso.All.some(x => x.Key === key)) {
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

