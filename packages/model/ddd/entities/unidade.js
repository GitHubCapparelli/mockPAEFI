// packages/model/ddd/entities/unidade.js
import { FuncaoUnidade }    from "../enums/funcaoUnidade.js";
import { UUID }             from "../valueObjects/uuid.js";
import { DataHoraUTC }      from "../valueObjects/dataHoraUTC.js";
import { DomainError }      from "../errors/domainError.js";

export class Unidade {
    constructor(props, _self = false) {
        if (!_self) { throw new Error("Use Unidade.criar() ou Unidade.reconstituir()."); }
        this.id             = props.id;
        this.hierarquiaID   = props.hierarquiaID;
        this.sigla          = props.sigla;
        this.nome           = props.nome            ?? null;
        this.ibgeId         = props.ibgeId          ?? null;
        this.funcao         = props.funcao;
        this.criadoEm       = props.criadoEm;
        this.criadoPor      = props.criadoPor;
        this.alteradoEm     = props.alteradoEm      ?? null;
        this.alteradoPor    = props.alteradoPor     ?? null;
        this.excluidoEm     = props.excluidoEm      ?? null;
        this.excluidoPor    = props.excluidoPor     ?? null;
        this.exclusaoFisica = props.exclusaoFisica  ?? false;
    }

    static criar(props) {
        return new Unidade({
            id              : new UUID(props.id),
            hierarquiaID    : new UUID(props.hierarquiaID),
            sigla           : props.sigla,
            nome            : props.nome,
            ibgeId          : props.ibgeId,
            funcao          : props.funcao
        }, true)
        .#validar();
    }    

    static reconstituir(props) {
        return new Unidade({
            id              : new UUID(props.id),
            hierarquiaID    : new UUID(props.hierarquiaID),
            sigla           : props.sigla,
            nome            : props.nome,
            ibgeId          : props.ibgeId,
            funcao          : props.funcao,
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
        if (this.nome && (typeof this.nome !== "string" || this.nome.length < 10 || this.nome.length > 200)) {
            throw new DomainError("Nome inválido.");
        }
        if (typeof this.sigla !== "string" || this.sigla.length < 3 || this.sigla.length > 100) {
            throw new DomainError("Sigla inválida.");
        }
        if (!Object.values(FuncaoUnidade).includes(this.funcao)) {
            throw new DomainError("Função inválida.");
        }

        if (this.sigla === "SUBSAS" && !this.hierarquiaID) {
            throw new DomainError("Hierarquia inválida.");
        }
        return this;
    }

    toJSON() {
        return {
            id              : this.id.toString(),
            hierarquiaID    : this.hierarquiaID.toString(),
            sigla           : this.sigla,
            nome            : this.nome,
            ibgeId          : this.ibgeId,
            funcao          : this.funcao,
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
            throw new DomainError("Unidade já excluída.");
        }
        this.excluidoEm  = new DataHoraUTC(dataUTC);
        this.excluidoPor = new UUID(autorUUID);
    }
}