// packages/api/src/middleware/ErrorHandler.js
export class ErrorHandler {
    // 4 parâmetros = Express reconhece como error handler
    static handle(err, req, res, next) {
        const ts = new Date().toISOString();
        console.error(`[${ts}] ${err.message}`);

        if (err.message?.startsWith('CORS'))
            return res.status(403).json({ error: err.message });

        if (err.message?.includes('NOT NULL') || err.message?.includes('CHECK constraint'))
            return res.status(422).json({ error: `Dados inválidos: ${err.message}` });

        if (err.message?.includes('UNIQUE constraint'))
            return res.status(409).json({ error: 'Registro duplicado.' });

        if (err.message?.includes('não encontrado') || err.message?.includes('não autorizado'))
            return res.status(404).json({ error: err.message });

        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}