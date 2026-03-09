// packages/api/src/services/BaseService.js
import Ajv                from 'ajv';
import addFormats         from 'ajv-formats';
import { readFileSync }   from 'fs';
import { fileURLToPath }  from 'url';
import path               from 'path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const MODEL = path.resolve(__dir, '../../../..', 'packages/model/contracts');

export class BaseService {

    // ── Schema cache ─────────────────────────────────────────────────────────
    static #ajv = addFormats(new Ajv({ allErrors: true }));
    static #schemas = {};

    static #loadSchema(rel) {
        if (BaseService.#schemas[rel]) return BaseService.#schemas[rel];
        const raw = JSON.parse(readFileSync(path.join(MODEL, rel), 'utf-8'));
        BaseService.#schemas[rel] = BaseService.#ajv.compile(raw);
        return BaseService.#schemas[rel];
    }

    // ── Validação ─────────────────────────────────────────────────────────────
    static validateRequest(body) {
        const validate = BaseService.#loadSchema('message/request.json');
        if (!validate(body)) {
            const msgs = validate.errors
                .map(e => `${e.instancePath} ${e.message}`.trim())
                .join('; ');
            return { ok: false, error: `Request inválido: ${msgs}` };
        }
        return { ok: true };
    }

    static validateResponse(data) {
        const validate = BaseService.#loadSchema('message/response.json');
        if (!validate(data)) {
            const msgs = validate.errors
                .map(e => `${e.instancePath} ${e.message}`.trim())
                .join('; ');
            return { ok: false, error: `Response inválido: ${msgs}` };
        }
        return { ok: true };
    }

    // ── Transação atômica ─────────────────────────────────────────────────────
    // Executa fn(db) dentro de BEGIN / COMMIT.
    // Qualquer exceção em fn dispara ROLLBACK automático.
    static inTransaction(db, fn) {
        return new Promise((resolve, reject) => {
            db.run('BEGIN', async (err) => {
                if (err) return reject(err);
                try {
                    const result = await fn(db);
                    db.run('COMMIT', (err2) => {
                        if (err2) return reject(err2);
                        resolve(result);
                    });
                } catch (e) {
                    db.run('ROLLBACK', () => reject(e));
                }
            });
        });
    }

    // ── Respostas padrão ──────────────────────────────────────────────────────
    static ok(res, data, pagination = null, status = 200) {
        const body = { data, pagination, token: null, error: null };
        const v = BaseService.validateResponse(body);
        if (!v.ok) console.warn(`[${new Date().toISOString()}] [BaseService] Response fora do schema:`, v.error);
        return res.status(status).json(body);
    }

    static fail(res, error, status = 400) {
        return res.status(status).json({ data: null, pagination: null, token: null, error });
    }

    // ── Timestamp UTC ─────────────────────────────────────────────────────────
    static now() {
        return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    }
}