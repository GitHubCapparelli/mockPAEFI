// packages/api/src/middleware/auth.js
import { getConnection } from '../db/connectionFactory.js';

export function authMiddleware(req, res, next) {
    const userId = req.headers['x-user-id'];
    const origin = req.headers['x-data-origin'] || 'Research';

    if (!userId) {
        return res.status(401).json({
            error: 'Header X-User-Id obrigatório.'
        });
    }

    // Valida UUID básico
    const uuidPattern = /^[0-9a-f-]{36}$/i;
    if (!uuidPattern.test(userId)) {
        return res.status(401).json({
            error: 'X-User-Id inválido.'
        });
    }

    try {
        const db = getConnection(origin);
        const user = db
            .prepare(`SELECT id, nome, login FROM usuariosServidores
                      WHERE id = ? AND excluidoEm IS NULL`)
            .get(userId);

        if (!user) {
            return res.status(403).json({
                error: 'Usuário não autorizado ou não encontrado.'
            });
        }

        // Disponibiliza para as rotas
        req.currentUser = user;
        req.dataOrigin = origin;
        req.db = db;

        next();

    } catch (err) {
        next(err);
    }
}