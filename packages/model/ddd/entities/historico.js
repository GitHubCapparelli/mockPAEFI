// packages/model/ddd/entities/usuarioServidor.js
import { TipoLog }          from "../enums/tipoLog.js";
import { UUID }             from "../valueObjects/uuid.js";
import { DataHoraUTC }      from "../valueObjects/dataHoraUTC.js";
import { DomainError }      from "../errors/domainError.js";

export class Historico {
    constructor(props, _self = false) {
        if (!_self) { throw new Error("Use Historico.criar() ou Historico.reconstituir()."); }
        this.id             = props.id;
        this.catalogoID     = props.catalogoID;
        this.sessionId      = props.sessionId;
        this.tipo           = props.tipo;
        this.acao           = props.acao;
        this.justificativa  = props.justificativa   ?? null;
        this.descricao      = props.descricao       ?? null;
        this.diff           = props.diff;

        this.dataHora       = props.dataHora;
        this.usuarioID      = props.usuarioID;
    }

    static criar(props) {
        return new Historico({
            id              : new UUID(props.id),
            catalogoID      : new UUID(props.catalogoID),
            sessionId       : props.sessionId,
            tipo            : props.tipo,
            acao            : props.acao,
            justificativa   : props.justificativa,
            descricao       : props.descricao,
            diff            : props.diff
        }, true)
        .#validar();
    }    

    static reconstituir(props) {
        return new Historico({
            id              : new UUID(props.id),
            catalogoID      : new UUID(props.catalogoID),
            sessionId       : props.sessionId,
            tipo            : props.tipo,
            acao            : props.acao,
            justificativa   : props.justificativa,
            descricao       : props.descricao,
            diff            : props.diff,
            dataHora        : new DataHoraUTC(props.dataHora),
            usuarioID       : new UUID(props.usuarioID)
        }, true);
    }

    #validar() {
        if (typeof this.sessionId !== "string" || this.sessionId.length > 100) {
            throw new DomainError("SessionId inválido.");
        }
        if (typeof this.acao !== "string" || this.acao.length > 50) {
            throw new DomainError("Ação inválida.");
        }
        if (!this.diff || typeof this.diff !== "string" ) {
            throw new DomainError("Campo obrigatório: diff (string)");
        }

        if (!Object.values(TipoLog).includes(this.tipo)) {
            throw new DomainError("Tipo inválido.");
        }
        return this;
    }

    toJSON() {
        return {
            id              : this.id.toString(),
            catalogoID      : this.catalogoID.toString(),
            usuarioID       : this.usuarioID.toString(),
            sessionId       : this.sessionId,
            tipo            : this.tipo,
            dataHora        : this.dataHora,
            acao            : this.acao,
            justificativa   : this.justificativa            ?? null,
            descricao       : this.descricao                ?? null,
            diff            : this.diff
        };
    }

    marcarInclusao(dataUTC, autorUUID) {
        this.dataHora  = new DataHoraUTC(dataUTC);
        this.usuarioID = new UUID(autorUUID);
    }

    marcarAlteracao(dataUTC, autorUUID) {
        throw new DomainError("Registros históricos não devem ser alterados.");
    }

    marcarExclusao(dataUTC, autorUUID) {
        throw new DomainError("Registros históricos não devem ser excluídos.");
    }
}