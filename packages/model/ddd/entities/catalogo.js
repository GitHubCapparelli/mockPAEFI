// packages/model/ddd/entities/catalogo.js
import { UUID }             from "../valueObjects/uuid.js";
import { DataHoraUTC }      from "../valueObjects/dataHoraUTC.js";
import { DomainError }      from "../errors/domainError.js";

export class Catalogo {
    constructor(props, _self = false) {
        if (!_self) { throw new Error("Use Catalogo.criar() ou Catalogo.reconstituir()."); }
        this.id             = props.id;
        this.nome           = props.nome;
        this.versao         = props.versao;
        this.finalidade     = props.finalidade;
        this.criadoEm       = props.criadoEm;
        this.criadoPor      = props.criadoPor;
        this.alteradoEm     = props.alteradoEm      ?? null;
        this.alteradoPor    = props.alteradoPor     ?? null;
        this.excluidoEm     = props.excluidoEm      ?? null;
        this.excluidoPor    = props.excluidoPor     ?? null;
        this.exclusaoFisica = props.exclusaoFisica  ?? false;
    }

    static criar(props) {
        return new Catalogo({
            id              : new UUID(props.id),
            nome            : props.nome,
            versao          : props.versao,
            finalidade      : props.finalidade
        }, true)
        .#validar();
    }    

    static reconstituir(props) {
        return new Catalogo({
            id              : new UUID(props.id),
            nome            : props.nome,
            versao          : props.versao,
            finalidade      : props.finalidade,
            criadoEm        : new DataHoraUTC(props.criadoEm),
            criadoPor       : new UUID(props.criadoPor),
            alteradoEm      : props.alteradoEm      ? new DataHoraUTC(props.alteradoEm) : null,
            alteradoPor     : props.alteradoPor     ? new UUID(props.alteradoPor)       : null,
            excluidoEm      : props.excluidoEm      ? new DataHoraUTC(props.excluidoEm) : null,
            excluidoPor     : props.excluidoPor     ? new UUID(props.excluidoPor)       : null,
            exclusaoFisica  : props.exclusaoFisica ?? false
        }, true);
    }

    #validar() {
        if (typeof this.nome !== "string" || this.nome.length < 3 || this.nome.length > 100) {
            throw new DomainError("Nome inválido.");
        }
        if (typeof this.versao !== "string" || this.versao.length > 10) {
            throw new DomainError("Versão inválida.");
        }
        if (typeof this.finalidade !== "string" || this.finalidade.length > 200) {
            throw new DomainError("Finalidade inválida.");
        }
        return this;
    }

    toJSON() {
        return {
            id              : this.id.toString(),
            nome            : this.nome,
            versao          : this.versao,
            finalidade      : this.finalidade,
            criadoEm        : this.criadoEm.toString(),
            criadoPor       : this.criadoPor.toString(),
            alteradoEm      : this.alteradoEm?.toString() ?? null,
            alteradoPor     : this.alteradoPor?.toString() ?? null,
            excluidoEm      : this.excluidoEm?.toString() ?? null,
            excluidoPor     : this.excluidoPor?.toString() ?? null,
            exclusaoFisica  : this.exclusaoFisica
        };
    }

    marcarInclusao(dataUTC, autorUUID) {
        this.criadoEm  = new DataHoraUTC(dataUTC);
        this.criadoPor = new UUID(autorUUID);
    }

    marcarAlteracao(dataUTC, autorUUID) {
        this.alteradoEm  = new DataHoraUTC(dataUTC);
        this.alteradoPor = new UUID(autorUUID);
    }

    marcarExclusao(dataUTC, autorUUID) {
        if (this.excluidoEm) {
            throw new DomainError("Catálogo já excluído.");
        }
        this.excluidoEm  = new DataHoraUTC(dataUTC);
        this.excluidoPor = new UUID(autorUUID);
    }
}