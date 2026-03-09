// packages/api/src/services/AuthService.js
import { Router }             from 'express';
import jwt                    from 'jsonwebtoken';
import { ConnectionFactory }  from '../connectionFactory.js';
import { BaseService }        from './BaseService.js';

const JWT_SECRET  = process.env.JWT_SECRET  || 'mockpaefi-dev-secret-change-in-prod';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

export class AuthService {

    // ── Roteamento ────────────────────────────────────────────────────────────
    static router() {
        const r = Router();
        r.post('/login',  AuthService.#login);
        r.post('/logout', AuthService.#logout);
        return r;
    }

    // ── Mapa de roles por função do usuário ───────────────────────────────────
    static #ROLE_MAP = {
        Diretor           : { role: 'CentralAdmin',   scope: 'Central', admin: 'maintain', monitor: 'maintain', atender: 'view' },
        SubSecretario     : { role: 'CentralAdmin',   scope: 'Central', admin: 'maintain', monitor: 'maintain', atender: 'view' },
        Gerente           : { role: 'GerenteUnidade', scope: 'Unidade', admin: 'view',     monitor: 'maintain', atender: 'maintain' },
        Coordenador       : { role: 'GerenteUnidade', scope: 'Unidade', admin: 'view',     monitor: 'maintain', atender: 'maintain' },
        Assessor          : { role: 'CentralAdmin',   scope: 'Central', admin: 'maintain', monitor: 'maintain', atender: 'view' },
        AssessorTecnico   : { role: 'CentralView',    scope: 'Central', admin: 'view',     monitor: 'view',     atender: 'view' },
        AgenteSocial      : { role: 'AgenteSocial',   scope: 'Unidade', admin: 'none',     monitor: 'view',     atender: 'maintain' },
        Especialista      : { role: 'Especialista',   scope: 'Unidade', admin: 'none',     monitor: 'view',     atender: 'maintain' },
    };

    // ── Helpers privados ──────────────────────────────────────────────────────
    static #resolveContext(usuario, unidade) {
        const map = AuthService.#ROLE_MAP[usuario.funcao]
            || { role: 'ReadOnly', scope: 'Restrito', admin: 'none', monitor: 'view', atender: 'none' };

        const hierarquia = unidade?.sigla
            ? `SEDES / ... / ${unidade.sigla}`
            : 'NaoInformado';

        return {
            unidadeID: usuario.unidadeID,
            siglaUnidade: unidade?.sigla || 'NaoInformado',
            hierarquia,
            role: map.role,
            scope: map.scope,
            permissions: {
                admin: map.admin,
                monitor: map.monitor,
                atender: map.atender
            }
        };
    }

    static #buildUsuarioConectado(usuario, context) {
        return {
            id: usuario.id,
            info: {
                funcao: usuario.funcao || 'NaoInformado',
                cargo: usuario.cargo || 'NaoInformado',
                especialidade: usuario.especialidade || 'NaoInformada',
                nome: usuario.nome,
                login: usuario.login,
                matricula: usuario.matricula,
                cpf: usuario.cpf || null,
                criadoEm: usuario.criadoEm,
                criadoPor: usuario.criadoPor,
                alteradoEm: usuario.alteradoEm || null,
                alteradoPor: usuario.alteradoPor || null,
                excluidoEm: null,
                excluidoPor: null
            },
            context
        };
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    static #login = async (req, res) => {
        try {
            const { login } = req.body || {};
            if (!login) return BaseService.fail(res, 'Campo "login" obrigatório.', 400);

            const db = ConnectionFactory.get(req.dataOrigin || 'RemotePoC');

            const usuario = await new Promise((resolve, reject) =>
                db.get(
                    `SELECT * FROM usuariosServidores WHERE login = ? AND excluidoEm IS NULL`,
                    [login],
                    (err, row) => err ? reject(err) : resolve(row)
                )
            );

            if (!usuario) return BaseService.fail(res, `Usuário "${login}" não encontrado.`, 404);

            const unidade = await new Promise((resolve, reject) =>
                db.get(
                    `SELECT * FROM unidades WHERE id = ?`,
                    [usuario.unidadeID],
                    (err, row) => err ? reject(err) : resolve(row)
                )
            );

            const context = AuthService.#resolveContext(usuario, unidade);
            const usuarioConectado = AuthService.#buildUsuarioConectado(usuario, context);

            const token = jwt.sign(
                { id: usuario.id, role: context.role, scope: context.scope },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES }
            );

            return res.status(200).json({
                data: usuarioConectado,
                pagination: null,
                token,
                error: null
            });

        } catch (e) {
            console.error(`[${new Date().toISOString()}]`, e.message);
            return BaseService.fail(res, 'Erro interno do servidor.', 500);
        }
    };

    // ── POST /api/auth/logout ─────────────────────────────────────────────────
    // JWT é stateless — logout é responsabilidade da UI (descartar token).
    // Este endpoint existe para padronização e futura blacklist.
    static #logout = async (req, res) => {
        return res.status(200).json({
            data: null, pagination: null, token: null, error: null
        });
    };

    // ── Verificação de token (usada pelo AuthMiddleware) ───────────────────────
    static verify(token) {
        try {
            return { ok: true, payload: jwt.verify(token, JWT_SECRET) };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    }
}