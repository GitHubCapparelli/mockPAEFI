// ui paefi core omData

import * as API     from '../../../services/api/_index.js';
import * as Dados   from '../../../data/factory/_index.js';
import * as Enum    from './omEnum.js';

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
    static NomeCatalogo     = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Nome.Mandatory(),    dtoId:'nome',           uiFieldTitle: 'Nome' });
    static VersaoCatalogo   = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Versao.Mandatory(),  dtoId:'versao',         uiFieldTitle: 'Versão' });
    static FuncaoCatalogo   = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Nome.Mandatory(),    dtoId:'finalidade',     uiFieldTitle: 'Finalidade' });

    static Catalogo         = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.CatalogoID,       dtoId:'catalogoID',        uiFieldTitle: 'Tabela',         uiFilterKey:'#cmbCatalogos',        uiFilterTitle:'Todas as tabelas',           lookupId:'catalogos',           displayId: 'nome' });
    static Usuario          = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.UsuarioID,        dtoId:'userID',            uiFieldTitle: 'Usuario',        uiFilterKey:'#cmbUsuarios',         uiFilterTitle:'Todos os usuários',          lookupId:'usuarios',            displayId: 'login' });
    static SessionId        = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.SessionId,        dtoId:'sessionId',         uiFieldTitle: 'Session',        onGrid:false });
    static TipoRegistro     = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.TipoRegistro,     dtoId:'tipo',              uiFieldTitle: 'Tipo',           uiFilterKey:'#cmbTipoRegistro',     uiFilterTitle:'Todos os tipos',             lookup: Enum.TipoRegistro });
    static DataHora         = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.DataHora,         dtoId:'dataHora',          uiFieldTitle: 'Data Hora' });
    static Acao             = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Acao.Mandatory(), dtoId:'acao',              uiFieldTitle: 'Ação' });
    static Justificativa    = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Justificativa,    dtoId:'justificativa',     uiFieldTitle: 'Justificativa' });
    static Descricao        = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Descricao,        dtoId:'descricao',         uiFieldTitle: 'Descrição',      onGrid:false });
    static Diff             = new Binding({ key: crypto.randomUUID(), dbInfo: Metadata.Diff,             dtoId:'diff',              uiFieldTitle: 'Diff',           onGrid:false });

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

    static Historico = new DomainInfo('historico', 'Histórico', API.HistoricoAPI, Dados.HistoricoDTO, 
        Dados.Tabela.Historico, 'historicoSchema.json', { usuarios: API.UsuariosServidoresAPI, catalogos: API.CatalogosAPI });

    static Catalogos = new DomainInfo('catalogos', 'Catálogo', API.CatalogosAPI, Dados.CatalogoDTO,
        Dados.Tabela.Catalogos, 'catalogoSchema.json');

    static Unidades = new DomainInfo('unidades', 'Unidade', API.UnidadesAPI, Dados.UnidadeDTO, 
        Dados.Tabela.Unidades, 'unidadeSchema.json');
    
    static UsuariosServidores = new DomainInfo('usuarios-servidores', 'Usuário Servidor', API.UsuariosServidoresAPI, Dados.UsuarioServidorDTO, 
        Dados.Tabela.UsuariosServidores, 'usuarioServidorSchema.json', { unidades: API.UnidadesAPI });
};

///////////////////////////////////

