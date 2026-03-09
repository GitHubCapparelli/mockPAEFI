// packages/api/src/dto/historico.js
import { BaseDTO } from './_baseDTO.js';

export class HistoricoDTO extends BaseDTO {

    static fromRow(row) {
        if (!row) return null;
        return {
            id            : row.id,
            catalogoID    : row.catalogoID,
            servidorID    : row.servidorID,
            tipo          : row.tipo          || 'NaoInformado',
            nome          : row.nome          || null,
            descricao     : row.descricao     || null,
            justificativa : row.justificativa || null,
            ip            : row.ip            || null,
            userAgent     : row.userAgent     || null,
            contexto      : row.contexto      || null,
            acao          : row.acao          || null,
            evidencia     : row.evidencia     || null,
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
        return (rows || []).map(HistoricoDTO.fromRow);
    }

    // Cria registro de evento — chamado internamente pelos services
    static toEvento({ catalogoID, servidorID, tipo, nome, acao, descricao, evidencia, req }) {
        const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        return {
            catalogoID,
            servidorID,
            tipo          : tipo    || 'Backend',
            nome          : nome    || acao,
            acao          : acao    || null,
            descricao     : descricao    || null,
            justificativa : null,
            ip            : req?.ip      || null,
            userAgent     : req?.headers?.['user-agent'] || null,
            contexto      : req?.dataOrigin || 'RemotePoC',
            evidencia     : evidencia ? JSON.stringify(evidencia) : null,
            criadoEm      : now,
            criadoPor     : servidorID,
            alteradoEm    : null,
            alteradoPor   : null,
            excluidoEm    : null,
            excluidoPor   : null,
            exclusaoFisica: 0
        };
    }

    static validate(dto) {
        const errors = [];
        if (!dto.catalogoID?.trim()) errors.push('catalogoID é obrigatório');
        if (!dto.servidorID?.trim()) errors.push('servidorID é obrigatório');
        return errors;
    }
}