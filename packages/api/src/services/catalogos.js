// packages/api/src/services/catalogos.js
import { Router }               from 'express';
import { CatalogosRepository }  from '../../../data/repositories/catalogos.js';
import { HistoricoService }     from './historico.js';

export class CatalogosService {
    static router() {
        const r = Router();
        r.get('/',       CatalogosService.#listar);
        r.get('/:id',    CatalogosService.#obter);
        r.post('/',      CatalogosService.#criar);
        r.put('/:id',    CatalogosService.#atualizar);
        r.delete('/:id', CatalogosService.#excluir);
        return r;
    }

    // GET /api/catalogos?page=1&pageSize=5
    static #listar(req, res, next) {
        try {
            const { page = 1, pageSize = 5 } = req.query;
            const repo = new CatalogosRepository(req.db);
            res.json(repo.findAll({ page: +page, pageSize: +pageSize }));
        } catch (err) { next(err); }
    }

    // GET /api/catalogos/:id
    static #obter(req, res, next) {
        try {
            const item = new CatalogosRepository(req.db).findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Catálogo não encontrado.' });
            res.json({ data: item });
        } catch (err) { next(err); }
    }

    // POST /api/catalogos  body: { metadata, payload }
    static #criar(req, res, next) {
        try {
            const { metadata, payload } = req.body;
            const repo                  = new CatalogosRepository(req.db);

            if (repo.isNomeDuplicado(payload.nome))
                return res.status(409).json({ error: 'Nome de catálogo já cadastrado.' });

            const row = {
                id             : crypto.randomUUID(),
                criadoEm       : CatalogosService.#now(),
                criadoPor      : req.currentUser.id,
                exclusaoFisica : 0,
                ...payload
            };
            const result = repo.insert(row);

            HistoricoService.registrarEvento(req.db, {
                usuarioID   : req.currentUser.id,
                catalogoID  : metadata?.catalogoID,
                sessionId   : req.headers['x-session-id'],
                tipo        : metadata?.tipo || 'Frontend',
                acao        : 'create',
                descricao   : `Catálogo criada: ${row.sigla}`,
                diff        : { before: null, after: result }
            });

            res.status(201).json({ data: result });
        } catch (err) { next(err); }
    }

    // PUT /api/catalogos/:id  body: { metadata, payload }
    static #atualizar(req, res, next) {
        try {
            const { payload } = req.body;
            const repo        = new CatalogosRepository(req.db);

            if (repo.isNomeDuplicado(payload.nome, req.params.id))
                return res.status(409).json({ error: 'Nome de catálogo já cadastrado.' });

            const row = {
                ...payload,
                id          : req.params.id,
                alteradoEm  : CatalogosService.#now(),
                alteradoPor : req.currentUser.id
            };
            const result = repo.update(row);

            HistoricoService.registrarEvento(req.db, {
                usuarioID   : req.currentUser.id,
                catalogoID  : metadata?.catalogoID,
                sessionId   : req.headers['x-session-id'],
                tipo        : metadata?.tipo || 'Frontend',
                acao        : 'update',
                descricao   : `Catálogo atualizado: ${row.sigla}`,
                diff        : { before, after: result }
            });

            res.json({ data: result });
        } catch (err) { next(err); }
    }

    // DELETE /api/catalogos/:id
    static #excluir(req, res, next) {
        try {
            const { metadata } = req.body || {};
            const repo         = new CatalogosRepository(req.db);
            const before       = repo.findById(req.params.id);

            if (!before) return res.status(404).json({ error: 'Catálogo não encontrado.' });

            const now = UnidadesService.#now();
            repo.softDelete(req.params.id, req.currentUser.id, now);

            HistoricoService.registrarEvento(req.db, {
                usuarioID   : req.currentUser.id,
                catalogoID  : metadata?.catalogoID,
                sessionId   : req.headers['x-session-id'],
                tipo        : metadata?.tipo || 'Frontend',
                acao        : 'delete',
                descricao   : `Catálogo excluído: ${before.nome}`,
                diff        : { before, after: null }
            });

            res.status(204).send();
        } catch (err) { next(err); }
    }

    static #now() {
        return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
}