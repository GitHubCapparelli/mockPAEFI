// packages/model/ddd/entities/appDominio.js
import { BaseEnum } from "../enums/_baseEnum.js";

export class AppDominio extends BaseEnum {
    static All = [];

    static Nenhum               = new AppDominio('','Domínio');
    static Anotacoes            = new AppDominio('anotacoes', 'Anotações');
    static Atendimentos         = new AppDominio('atendimentos', 'Atendimentos');
    static Atividades           = new AppDominio('atividades', 'Atividades');
    static CasosDeUso           = new AppDominio('casosDeUso', 'Casos de Uso');
    static CatalogoLegislacoes  = new AppDominio('catalogoLegislacoes','Catálogo de Legislações');
    static CatalogoViolacoes    = new AppDominio('catalogoViolacoes','Catálogo de Violações');
    static Compromissos         = new AppDominio('compromissos', 'Compromissos');
    static Database             = new AppDominio('catalogos', 'Banco de Dados (Tabelas)');
    static Demandas             = new AppDominio('demandas','Demandas');
    static Documentos           = new AppDominio('documentos','Documentos');
    static Enderecos            = new AppDominio('enderecos', 'Endereços');
    static Historico            = new AppDominio('historico', 'Histórico de eventos');
    static Interfaces           = new AppDominio('interfaces', 'Interfaces (wireframes)');
    static Metadados            = new AppDominio('metadados','Metadados (Dicionário de termos)');
    static Objetivos            = new AppDominio('objetivos', 'Objetivos');
    static Processos            = new AppDominio('processos', 'Processos');
    static RegistrosViolacao    = new AppDominio('registrosViolacao', 'Registros de Violação');
    static Riscos               = new AppDominio('riscos', 'Riscos');
    static Servicos             = new AppDominio('servicos', 'Serviços');
    static Tarefas              = new AppDominio('tarefas', 'Tarefas');
    static Unidades             = new AppDominio('unidades','Unidades');
    static UsuariosCidadaos     = new AppDominio('usuariosCidadaos','Usuarios Cidadãos');
    static UsuariosServidores   = new AppDominio('usuariosServidores','Usuários Servidores');

    constructor(key, value) {
        super();
        this.Key       = key;
        this.Value     = value;
        this.JQuery    = `#${key}`;

        if (!AppDominio.All.some(x => x.Key === key)) {
            AppDominio.All.push(this);
        }
        Object.freeze(this);
    }
}
Object.freeze(AppDominio.All);