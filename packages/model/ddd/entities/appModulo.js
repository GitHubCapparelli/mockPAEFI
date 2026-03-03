// packages/model/ddd/entities/appModulo.js
import { BaseEnum }     from "../enums/_baseEnum.js";
import { AppDominio }   from "./appDominio.js";

export class AppModulo extends BaseEnum {
    static All      = [];

    static Nenhum       = new AppModulo('','Módulo');
    static Admin        = new AppModulo('admin','Administração');
    static Monitor      = new AppModulo('monitor','Supervisão e Monitoramento');
    static Atender      = new AppModulo('atender','Atendimentos, Acolhimentos e Acompanhamentos');

    constructor(key, value) {
        super();
        this.Key        = key;
        this.Value      = value;
        this.JQuery     = `#${key}`;
        
        this.Dominios   = this.#getDomains(key);

        if (!AppModulo.All.some(x => x.Key === key)) {
            AppModulo.All.push(this);
        }
        Object.freeze(this);
    }
    GetDomainKeys = () => this.Dominios.map(x => x.Key);

    #getDomains(moduleKey) {
        return (moduleKey === 'admin') ? [
            AppDominio.Unidades,
            AppDominio.Servicos,
            AppDominio.Processos,
            AppDominio.Objetivos,
            AppDominio.Riscos,
            AppDominio.Atividades,
            AppDominio.CasosDeUso,
            AppDominio.Database,
            AppDominio.Metadados,
            AppDominio.Interfaces,
            AppDominio.Anotacoes,
            AppDominio.Enderecos
        ] : (moduleKey === 'monitor') ? [
            AppDominio.UsuariosServidores,
            AppDominio.Tarefas,
            AppDominio.Documentos,
            AppDominio.Historico,
            AppDominio.RegistrosViolacao,
            AppDominio.CatalogoViolacoes,
            AppDominio.CatalogoLegislacoes
        ] : [
            AppDominio.UsuariosCidadaos,
            AppDominio.Demandas,
            AppDominio.Atendimentos,
            AppDominio.Compromissos
        ];
    }
}
Object.freeze(AppModulo.All);