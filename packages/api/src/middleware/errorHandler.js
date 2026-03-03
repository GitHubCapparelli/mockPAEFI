// packages/api/src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
    console.error(`[${new Date().toISOString()}]`, err.message);

    if (err.message?.startsWith('CORS')) {
        return res.status(403).json({ error: err.message });
    }

    if (err.message?.includes('NOT NULL') ||
        err.message?.includes('CHECK constraint')) {
        return res.status(422).json({ error: `Dados inválidos: ${err.message}` });
    }

    if (err.message?.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Registro duplicado.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
}