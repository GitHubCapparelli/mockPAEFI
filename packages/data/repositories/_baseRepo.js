// packages/data/repositories/_baseRepo.js
import conn from '../db/connection.js';

export class BaseRepository {
    /**
     * @param {string} tableName  - Nome da tabela SQLite
     * @param {object} options
     * @param {string} options.defaultOrderBy - Coluna padrão de ordenação
     * @param {string[]} options.filterableColumns - Colunas aceitas como filtro
     */
    constructor(tableName, { defaultOrderBy = 'rowid', filterableColumns = [] } = {}) {
        this.table = tableName;
        this.defaultOrderBy = defaultOrderBy;
        this.filterableColumns = filterableColumns;
        this.db = conn.db;
    }

    // ── Leitura ─────────────────────────────────────────────────────────────
    findAll({ filters = {}, page = 1, pageSize = 5 } = {}) {
        const { where, params } = this.#buildWhere(filters);

        const countSql = `SELECT COUNT(*) AS total FROM ${this.table} ${where}`;
        const total = this.db.prepare(countSql).get(params).total;

        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const offset = (currentPage - 1) * pageSize;

        const dataSql = `
            SELECT * FROM ${this.table}
            ${where}
            ORDER BY ${this.defaultOrderBy}
            LIMIT @limit OFFSET @offset
        `;

        const rows = this.db.prepare(dataSql).all({
            ...params,
            limit: pageSize,
            offset
        });

        return {
            data: rows,
            pagination: {
                page: currentPage,
                pageSize,
                totalRecords: total,
                totalPages
            }
        };
    }

    findById(id) {
        return this.db
            .prepare(`SELECT * FROM ${this.table} WHERE id = ?`)
            .get(id) ?? null;
    }

    // ── Escrita ──────────────────────────────────────────────────────────────
    /**
     * Executa INSERT.
     * @param {object} row - Objeto plano (resultado de entity.toJSON())
     * @returns {object} row inserido
     */
    insert(row) {
        const columns = Object.keys(row);
        const placeholders = columns.map(c => `@${c}`).join(', ');
        const sql = `
            INSERT INTO ${this.table} (${columns.join(', ')})
            VALUES (${placeholders})
        `;
        this.db.prepare(sql).run(row);
        return row;
    }

    /**
     * Executa UPDATE completo a partir de um objeto plano.
     * @param {object} row - Deve conter 'id'
     */
    update(row) {
        const { id, ...fields } = row;
        const sets = Object.keys(fields).map(c => `${c} = @${c}`).join(', ');
        const sql = `UPDATE ${this.table} SET ${sets} WHERE id = @id`;
        const info = this.db.prepare(sql).run(row);

        if (info.changes === 0) {
            throw new Error(`[${this.table}] Registro não encontrado: ${id}`);
        }

        return this.findById(id);
    }

    /**
     * Soft delete: marca excluidoEm e excluidoPor.
     */
    softDelete(id, autorUUID, dataUTC) {
        const sql = `
            UPDATE ${this.table}
            SET excluidoEm = @excluidoEm,
                excluidoPor = @excluidoPor
            WHERE id = @id AND excluidoEm IS NULL
        `;
        const info = this.db.prepare(sql).run({
            id,
            excluidoEm: dataUTC,
            excluidoPor: autorUUID
        });

        if (info.changes === 0) {
            throw new Error(`[${this.table}] Registro não encontrado ou já excluído: ${id}`);
        }
    }

    /**
     * Hard delete — use apenas quando necessário.
     */
    hardDelete(id) {
        const info = this.db
            .prepare(`DELETE FROM ${this.table} WHERE id = ?`)
            .run(id);

        if (info.changes === 0) {
            throw new Error(`[${this.table}] Registro não encontrado: ${id}`);
        }
    }

    // ── Transação ────────────────────────────────────────────────────────────
    /**
     * Executa uma função dentro de uma transação SQLite.
     * Se a função lançar erro, a transação é revertida automaticamente.
     * @param {Function} fn
     */
    transaction(fn) {
        return this.db.transaction(fn)();
    }

    // ── Privado ──────────────────────────────────────────────────────────────
    /**
     * Monta cláusula WHERE a partir de filtros,
     * aceitando apenas colunas declaradas em filterableColumns.
     * Registros excluídos são sempre omitidos.
     */
    #buildWhere(filters = {}) {
        const conditions = ['excluidoEm IS NULL'];
        const params = {};

        for (const [col, val] of Object.entries(filters)) {
            if (!val) continue;
            if (!this.filterableColumns.includes(col)) continue;

            conditions.push(`${col} = @${col}`);
            params[col] = val;
        }

        const where = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        return { where, params };
    }
}