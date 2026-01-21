// ui paefi core omData

import * as API     from '../../../services/api/_index.js';
import * as Dados   from '../../../data/factory/_index.js';
import * as Enum    from './omEnum.js';
import { Tabela }   from '../../../data/factory/_omSpec.js'; 

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
    static NomeCatalogo     = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Catalogos.Campos.Nome,                     dtoId:'nome',               uiFieldTitle: 'Nome' });
    static VersaoCatalogo   = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Catalogos.Campos.Versao,                   dtoId:'versao',             uiFieldTitle: 'Versão' });
    static FuncaoCatalogo   = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Catalogos.Campos.Finalidade,               dtoId:'finalidade',         uiFieldTitle: 'Finalidade' });

    static Catalogo         = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.CatalogoID,               dtoId:'catalogoID',         uiFieldTitle: 'Tabela',             uiFilterKey:'#cmbCatalogos',        uiFilterTitle:'Todas as tabelas',           lookupId:'catalogos',           displayId: 'nome' });
    static Usuario          = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.UsuarioID,                dtoId:'userID',             uiFieldTitle: 'Usuario',            uiFilterKey:'#cmbUsuarios',         uiFilterTitle:'Todos os usuários',          lookupId:'usuarios',            displayId: 'login' });
    static SessionId        = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.SessionId,                dtoId:'sessionId',          uiFieldTitle: 'Session',            onGrid:false });
    static TipoRegistro     = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.TipoRegistro,             dtoId:'tipo',               uiFieldTitle: 'Tipo',               uiFilterKey:'#cmbTipoRegistro',     uiFilterTitle:'Todos os tipos',             lookup: Enum.TipoRegistro });
    static DataHora         = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.DataHora,                 dtoId:'dataHora',           uiFieldTitle: 'Data Hora' });
    static Acao             = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.Acao,                     dtoId:'acao',               uiFieldTitle: 'Ação' });
    static Justificativa    = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.Justificativa,            dtoId:'justificativa',      uiFieldTitle: 'Justificativa' });
    static Descricao        = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.Descricao,                dtoId:'descricao',          uiFieldTitle: 'Descrição',          onGrid:false });
    static Diff             = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Historico.Campos.Diff,                     dtoId:'diff',               uiFieldTitle: 'Diff',               onGrid:false });

    static FuncaoUnidade    = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Unidades.Campos.FuncaoUnidade,             dtoId:'funcao',             uiFieldTitle: 'Função',             uiFilterKey:'#cmbFuncao',           uiFilterTitle:'Todas as Funções',           lookup: Enum.FuncaoUnidade });
    static SiglaUnidade     = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Unidades.Campos.Sigla,                     dtoId:'sigla',              uiFieldTitle: 'Sigla' });
    static NomeUnidade      = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Unidades.Campos.Nome,                      dtoId:'nome',               uiFieldTitle: 'Nome' });
    static IbgeId           = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.Unidades.Campos.IbgeId,                    dtoId:'ibgeId',             uiFieldTitle: 'Cod. IBGE' });
    
    static NomeServidor     = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.Nome,            dtoId:'nome',               uiFieldTitle: 'Nome' });
    static Unidade          = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.UnidadeID,       dtoId:'unidadeID',          uiFieldTitle: 'Unidade',            uiFilterKey:'#cmbUnidades',         uiFilterTitle:'Todas as Unidades',          lookupId:'unidades',           displayId: 'sigla' });
    static FuncaoUsuario    = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.FuncaoUsuario,   dtoId:'funcao',             uiFieldTitle: 'Função',             uiFilterKey:'#cmbFuncao',           uiFilterTitle:'Todas as Funções',           lookup: Enum.FuncaoUsuario });
    static CargoUsuario     = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.CargoUsuario,    dtoId:'cargo',              uiFieldTitle: 'Cargo',              uiFilterKey:'#cmbCargo',            uiFilterTitle:'Todos os Cargos',            lookup: Enum.CargoUsuario });
    static Especialidade    = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.Especialidade,   dtoId:'especialidade',      uiFieldTitle: 'Especialidade',      uiFilterKey:'#cmbEspecialidade',    uiFilterTitle:'Todas as Especialidades',    lookup: Enum.Especialidade });
    static Login            = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.Login,           dtoId:'login',              uiFieldTitle: 'Login',              onGrid:false });
    static Matricula        = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.Matricula,       dtoId:'matricula',          uiFieldTitle: 'Matrícula',          onGrid:false });
    static CpfServidor      = new Binding({ key: crypto.randomUUID(), dbInfo: Tabela.UsuariosServidores.Campos.CpfServidor,     dtoId:'cpf',                uiFieldTitle: 'CPF',                onGrid:false });
}

export class DomainInfo {           
    static All  = [];
    
    static Keys = {
        Historico           : 'historico',
        Catalogos           : 'catalogos',
        Unidades            : 'unidades',
        UsuariosServidores  : 'usuarios-servidores'
    };

    static Historico;
    static Catalogos;
    static Unidades;
    static UsuariosServidores;

    constructor(key, name, api, dto, catalog, schema, lookups = {}) {
        this.Key        = key;
        this.Name       = name;
        this.Catalog    = catalog;
        this.Schema     = schema;
        this.API        = api;
        this.DTO        = dto;
        this.Lookups    = lookups;

        if (!DomainInfo.All.some(x => x.Key === key)) {
            DomainInfo.All.push(this);
        }
    }
    static async CreateInstance(key, name, api, dto, catalog, schema, lookups = {}) {
        const [resolvedApi, resolvedDto] = await Promise.all([
            Registry.getAPI(api),
            Registry.getDTO(dto)
        ]);
        const resolvedLookups = DomainInfo.resolveLookups(lookups);
        return new DomainInfo(key, name, resolvedApi, resolvedDto, catalog, schema, resolvedLookups);
    }
    static async resolveLookups(lookups) {
        const entries = await Promise.all(
            Object.entries(lookups).map(async ([k, x]) => [k, await Registry.getAPI(x)])
        );
        return Object.fromEntries(entries);
    }

    static async Setup() {
        if (DomainInfo.All.length > 0) return; // Prevent double init
        const [h, c, u, us] = await Promise.all([
            DomainInfo.CreateInstance(DomainInfo.Keys.Historico, 'Histórico', API.HistoricoAPI, Dados.HistoricoDTO, Dados.Tabela.Historico, 'historicoSchema.json', { usuarios: API.UsuariosServidoresAPI, catalogos: API.CatalogosAPI }),
            DomainInfo.CreateInstance(DomainInfo.Keys.Catalogos, 'Catálogo', API.CatalogosAPI, Dados.CatalogoDTO, Dados.Tabela.Catalogos, 'catalogoSchema.json'),
            DomainInfo.CreateInstance(DomainInfo.Keys.Unidades, 'Unidade', API.UnidadesAPI, Dados.UnidadeDTO, Dados.Tabela.Unidades, 'unidadeSchema.json'),
            DomainInfo.CreateInstance(DomainInfo.Keys.UsuariosServidores, 'Usuário Servidor', API.UsuariosServidoresAPI, Dados.UsuarioServidorDTO, Dados.Tabela.UsuariosServidores, 'usuarioServidorSchema.json', { unidades: API.UnidadesAPI })
        ]);
        DomainInfo.Historico            = h;
        DomainInfo.Catalogos            = c;
        DomainInfo.Unidades             = u;
        DomainInfo.UsuariosServidores   = us;
    }

    static Find(key) {
        return DomainInfo.All.find(x => x.Key === key);
    }
};

///////////////////////////////////

export class Registry {
    static #apis = new Map();
    static #dtos = new Map();

    static async getAPI(x) {
        if (!this.#apis.has(x)) {
            const instance = await x.CreateInstance();
            this.#apis.set(x, instance);
        }
        return this.#apis.get(x);
    }

    static async getDTO(x) {
        if (!this.#dtos.has(x)) {
            const instance = await x.CreateInstance();
            this.#dtos.set(x, instance);
        }
        return this.#dtos.get(x);
    }
}