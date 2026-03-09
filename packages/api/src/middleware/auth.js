// packages/api/src/middleware/auth.js
import { AuthService }       from '../services/auth.js';
import { ConnectionFactory } from '../connectionFactory.js';

export class AuthMiddleware {
    static handle = async (req, res, next) => {
        try {
            // ── 1. Tentar JWT no header Authorization ─────────────────────────
            const bearer = req.headers['authorization'];
            if (bearer?.startsWith('Bearer ')) {
                const token = bearer.slice(7);
                const result = AuthService.verify(token);
                if (!result.ok) {
                    return res.status(401).json({
                        data: null, pagination: null, token: null,
                        error: `Token inválido: ${result.error}`
                    });
                }

                // Token válido — buscar usuário completo para popular req.currentUser
                const db = ConnectionFactory.get(req.dataOrigin || 'RemotePoC');
                const usuario = await new Promise((resolve, reject) =>
                    db.get(
                        `SELECT * FROM usuariosServidores WHERE id = ? AND excluidoEm IS NULL`,
                        [result.payload.id],
                        (err, row) => err ? reject(err) : resolve(row)
                    )
                );

                if (!usuario) {
                    return res.status(401).json({
                        data: null, pagination: null, token: null,
                        error: 'Usuário do token não encontrado.'
                    });
                }
                req.currentUser = usuario;
                req.db = db;
                return next();
            }

            // ── 2. Fallback: X-User-Id (compatibilidade durante migração) ─────
            const userId = req.headers['x-user-id'];
            if (!userId) {
                return res.status(401).json({
                    data: null, pagination: null, token: null,
                    error: 'Autenticação necessária: forneça Authorization: Bearer <token> ou X-User-Id.'
                });
            }

            const db = ConnectionFactory.get(req.dataOrigin || 'RemotePoC');
            const usuario = await new Promise((resolve, reject) =>
                db.get(
                    `SELECT * FROM usuariosServidores WHERE id = ? AND excluidoEm IS NULL`,
                    [userId],
                    (err, row) => err ? reject(err) : resolve(row)
                )
            );

            if (!usuario) {
                return res.status(401).json({
                    data: null, pagination: null, token: null,
                    error: `Usuário "${userId}" não encontrado ou inativo.`
                });
            }

            req.currentUser = usuario;
            req.db = db;
            return next();

        } catch (e) {
            console.error(`[${new Date().toISOString()}] [AuthMiddleware]`, e.message);
            return res.status(500).json({
                data: null, pagination: null, token: null,
                error: 'Erro interno na autenticação.'
            });
        }
    };
}