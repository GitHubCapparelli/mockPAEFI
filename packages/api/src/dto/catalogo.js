// packages/api/src/dto/catalogo.js
import { BaseDTO } from './_baseDTO.js';
export class CatalogoDTO extends BaseDTO {

    static fromRow(row) {
        if (!row) return null;
        return {
            id            : row.id,
            nome          : row.nome,
            versao        : row.versao        || null,
            descricao     : row.descricao     || null,
            criadoEm      : row.criadoEm,
            criadoPor     : row.criadoPor,
            alteradoEm    : row.alteradoEm    || null,
            alteradoPor   : row.alteradoPor   || null,
            excluidoEm    : row.excluidoEm    || null,
            excluidoPor   : row.excluidoPor   || null,
            exclusaoFisica: row.exclusaoFisica ?? 0
        };
    }

    static fromRows(rows) {
        return (rows || []).map(CatalogoDTO.fromRow);
    }

    static toInsert(payload, userId) {
        const r = BaseDTO.newRecord(payload, userId);
        return {
            id            : r.id,
            nome          : r.nome,
            versao        : r.versao    || '0.1',
            descricao     : r.descricao || null,
            criadoEm      : r.criadoEm,
            criadoPor     : r.criadoPor,
            alteradoEm    : null,
            alteradoPor   : null,
            excluidoEm    : null,
            excluidoPor   : null,
            exclusaoFisica: 0
        };
    }

    static toUpdate(existing, payload, userId) {
        return BaseDTO.updatedRecord(existing, {
            nome     : payload.nome      ?? existing.nome,
            versao   : payload.versao    ?? existing.versao,
            descricao: payload.descricao ?? existing.descricao
        }, userId);
    }

    static validate(dto) {
        const errors = [];
        if (!dto.nome?.trim())  errors.push('nome é obrigatório');
        if (!dto.versao?.trim()) errors.push('versao é obrigatória');
        return errors;
    }
}