// packages/api/src/dto/_baseDTO.js
import crypto from 'crypto';

export class BaseDTO {
    // ── Campos IData obrigatórios em todo registro ────────────────────────────
    static #IDATA_FIELDS = [
        'id','criadoEm','criadoPor','alteradoEm','alteradoPor',
        'excluidoEm','excluidoPor','exclusaoFisica'
    ];

    // Cria um objeto IData limpo para INSERT
    static newRecord(payload, userId) {
        const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        return {
            ...payload,
            id            : payload.id || crypto.randomUUID(),
            criadoEm      : now,
            criadoPor     : userId,
            alteradoEm    : null,
            alteradoPor   : null,
            excluidoEm    : null,
            excluidoPor   : null,
            exclusaoFisica: 0
        };
    }

    // Cria um objeto IData limpo para UPDATE
    static updatedRecord(existing, payload, userId) {
        const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        return {
            ...existing,
            ...payload,
            id         : existing.id,       // id nunca muda
            criadoEm   : existing.criadoEm, // auditoria nunca muda
            criadoPor  : existing.criadoPor,
            alteradoEm : now,
            alteradoPor: userId,
            excluidoEm : null,
            excluidoPor: null
        };
    }

    // Marca registro como excluído (soft delete)
    static deletedRecord(existing, userId) {
        const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        return {
            ...existing,
            excluidoEm    : now,
            excluidoPor   : userId,
            exclusaoFisica: 0
        };
    }

    // Remove campos IData para exposição externa (quando necessário)
    static stripIData(record) {
        const out = { ...record };
        BaseDTO.#IDATA_FIELDS.forEach(f => delete out[f]);
        return out;
    }
}