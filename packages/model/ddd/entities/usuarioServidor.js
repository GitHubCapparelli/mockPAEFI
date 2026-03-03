// packages/model/ddd/entities/usuarioServidor.js
import { CargoUsuario }     from "../enums/cargoUsuario.js";
import { FuncaoUsuario }    from "../enums/funcaoUsuario.js";
import { Especialidade }    from "../enums/especialidade.js";
import { UUID }             from "../valueObjects/uuid.js";
import { DataHoraUTC }      from "../valueObjects/dataHoraUTC.js";
import { CPF }              from "../valueObjects/cpf.js";
import { Matricula }        from "../valueObjects/matricula.js";
import { DomainError }      from "../errors/domainError.js";

export class UsuarioServidor {
    constructor(props, _self = false) {
        if (!_self) { throw new Error("Use UsuarioServidor.criar() ou UsuarioServidor.reconstituir()."); }
        this.id             = props.id;
        this.unidadeID      = props.unidadeID;
        this.nome           = props.nome;
        this.login          = props.login;
        this.matricula      = props.matricula;
        this.cpf            = props.cpf;
        this.funcao         = props.funcao;
        this.cargo          = props.cargo;
        this.especialidade  = props.especialidade;
        this.criadoEm       = props.criadoEm;
        this.criadoPor      = props.criadoPor;
        this.alteradoEm     = props.alteradoEm          ?? null;
        this.alteradoPor    = props.alteradoPor         ?? null;
        this.excluidoEm     = props.excluidoEm          ?? null;
        this.excluidoPor    = props.excluidoPor         ?? null;
        this.exclusaoFisica = props.exclusaoFisica      ?? false;
    }

    static criar(props) {
        return new UsuarioServidor({
            id              : new UUID(props.id),
            unidadeID       : new UUID(props.unidadeID),
            matricula       : new Matricula(props.matricula),
            cpf             : props.cpf ? new CPF(props.cpf) : null,
            nome            : props.nome,
            login           : props.login,
            cargo           : props.cargo,
            funcao          : props.funcao,
            especialidade   : props.especialidade
        }, true)
        .#validar();
    }    

    static reconstituir(props) {
        return new UsuarioServidor({
            id              : new UUID(props.id),
            unidadeID       : new UUID(props.unidadeID),
            matricula       : new Matricula(props.matricula),
            cpf             : props.cpf             ? new CPF(props.cpf)                : null,
            nome            : props.nome,
            login           : props.login,
            cargo           : props.cargo,
            funcao          : props.funcao,
            especialidade   : props.especialidade,
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
        if (typeof this.nome !== "string" || this.nome.length < 10 || this.nome.length > 200) {
            throw new DomainError("Nome inválido.");
        }
        if (typeof this.login !== "string" || this.login.length < 5 || this.login.length > 100) {
            throw new DomainError("Login inválido.");
        }
        if (!Object.values(CargoUsuario).includes(this.cargo)) {
            throw new DomainError("Cargo inválido.");
        }
        if (!Object.values(FuncaoUsuario).includes(this.funcao)) {
            throw new DomainError("Função inválida.");
        }
        if (!Object.values(Especialidade).includes(this.especialidade)) {
            throw new DomainError("Especialidade inválida.");
        }

        if (this.funcao === FuncaoUsuario.Gerente && !this.cpf) {
            throw new DomainError("CPF obrigatório para gerentes.");
        }
        return this;
    }

    toJSON() {
        return {
            id              : this.id.toString(),
            unidadeID       : this.unidadeID.toString(),
            nome            : this.nome,
            login           : this.login,
            matricula       : this.matricula.toString(),
            cpf             : this.cpf ? this.cpf.toString() : null,
            funcao          : this.funcao,
            cargo           : this.cargo,
            especialidade   : this.especialidade,
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
            throw new DomainError("Usuário já excluído.");
        }
        this.excluidoEm  = new DataHoraUTC(dataUTC);
        this.excluidoPor = new UUID(autorUUID);
    }
}