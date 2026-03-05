// packages/api/src/middleware/auth.js
import { ConnectionFactory } from '../connectionFactory.js';
export class AuthMiddleware {
    static handle(req, res, next) {
        const userId = req.headers['x-user-id'];
        const origin = req.dataOrigin || 'RemotePoC';

        if (!userId)
            return res.status(401).json({ error: 'Header X-User-Id obrigatório.' });

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId))
            return res.status(401).json({ error: 'X-User-Id inválido.' });

        try {
            const db = ConnectionFactory.get(origin);
            const user = db
                .prepare(`SELECT id, nome, login
                           FROM usuariosServidores
                           WHERE id = ? AND excluidoEm IS NULL`)
                .get(userId);

            if (!user)
                return res.status(403).json({ error: 'Usuário não autorizado.' });

            req.currentUser = user;
            req.db = db;
            next();

        } catch (err) { next(err); }
    }
}