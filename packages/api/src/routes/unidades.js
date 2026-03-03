// packages/api/src/routes/unidades.js
import { Router }               from 'express';
import { UnidadesRepository }   from '../../../data/repositories/unidades.js';

const router = Router();

// GET /api/unidades?page=1&pageSize=5&funcao=Coordenacao
router.get('/', (req, res, next) => {
    try {
        const { page = 1, pageSize = 5, ...filters } = req.query;
        const repo   = new UnidadesRepository(req.db);
        const result = repo.findAll({
            filters,
            page    : Number(page),
            pageSize: Number(pageSize)
        });
        res.json(result);
    } catch (err) { next(err); }
});

// GET /api/unidades/lookup  ← para selects da UI
router.get('/lookup', (req, res, next) => {
    try {
        const repo = new UnidadesRepository(req.db);
        res.json({ data: repo.findAllForLookup() });
    } catch (err) { next(err); }
});

// GET /api/unidades/:id
router.get('/:id', (req, res, next) => {
    try {
        const repo = new UnidadesRepository(req.db);
        const item = repo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Não encontrado.' });
        res.json({ data: item });
    } catch (err) { next(err); }
});

// POST /api/unidades
router.post('/', (req, res, next) => {
    try {
        const { metadata, payload } = req.body;
        const repo = new UnidadesRepository(req.db);

        if (repo.isSiglaDuplicada(payload.sigla)) {
            return res.status(409).json({ error: 'Sigla já cadastrada.' });
        }

        const row = {
            id             : crypto.randomUUID(),
            criadoEm       : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            criadoPor      : req.currentUser.id,
            exclusaoFisica : 0,
            ...payload
        };

        const result = repo.insert(row);
        res.status(201).json({ data: result });
    } catch (err) { next(err); }
});

// PUT /api/unidades/:id
router.put('/:id', (req, res, next) => {
    try {
        const { payload } = req.body;
        const repo = new UnidadesRepository(req.db);

        if (repo.isSiglaDuplicada(payload.sigla, req.params.id)) {
            return res.status(409).json({ error: 'Sigla já cadastrada.' });
        }

        const row = {
            ...payload,
            id         : req.params.id,
            alteradoEm : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            alteradoPor: req.currentUser.id
        };

        const result = repo.update(row);
        res.json({ data: result });
    } catch (err) { next(err); }
});

// DELETE /api/unidades/:id  (soft)
router.delete('/:id', (req, res, next) => {
    try {
        const repo    = new UnidadesRepository(req.db);
        const dataUTC = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        repo.softDelete(req.params.id, req.currentUser.id, dataUTC);
        res.status(204).send();
    } catch (err) { next(err); }
});

export default router;