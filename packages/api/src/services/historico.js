// packages/api/src/services/HistoricoService.js
import { Router }               from 'express';
import { HistoricoRepository }  from '../../../data/repositories/historico.js';

export class HistoricoService {
    static router() {
        const r = Router();
        r.get('/', HistoricoService.#listar);
        r.get('/:id', HistoricoService.#obter);
        r.post('/', HistoricoService.#registrar);   // chamado internamente pelos outros services
        return r;
    }

    // GET /api/historico?page=1&pageSize=10&usuarioID=...&catalogoID=...&tipo=...&acao=...
    static #listar(req, res, next) {
        try {
            const { page = 1, pageSize = 10, ...filters } = req.query;
            const repo = new HistoricoRepository(req.db);
            res.json(repo.findAll({ filters, page: +page, pageSize: +pageSize }));
        } catch (err) { next(err); }
    }

    // GET /api/historico/:id
    static #obter(req, res, next) {
        try {
            const item = new HistoricoRepository(req.db).findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Registro não encontrado.' });
            res.json({ data: item });
        } catch (err) { next(err); }
    }

    // POST /api/historico  (uso interno dos outros Services)
    static #registrar(req, res, next) {
        try {
            const { payload } = req.body;
            const row = {
                id: crypto.randomUUID(),
                usuarioID: req.currentUser.id,
                dataHora: HistoricoService.#now(),
                sessionId: req.headers['x-session-id'] || 'N/A',
                ...payload
            };
            res.status(201).json({ data: new HistoricoRepository(req.db).insert(row) });
        } catch (err) { next(err); }
    }

    // Método estático utilitário — chamado pelos outros Services após CRUD
    static registrarEvento(db, { usuarioID, catalogoID, sessionId, tipo, acao, descricao, diff }) {
        const row = {
            id              : crypto.randomUUID(),
            catalogoID,
            usuarioID,
            sessionId       : sessionId || 'N/A',
            tipo            : tipo || 'Frontend',
            dataHora        : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            acao,
            descricao       : descricao ?? null,
            justificativa   : null,
            diff            : diff ? JSON.stringify(diff) : null
        };
        return new HistoricoRepository(db).insert(row);
    }

    static #now() {
        return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
}