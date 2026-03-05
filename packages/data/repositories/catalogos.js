// packages/data/repositories/catalogos.js
import { BaseRepository } from './_baseRepo.js';
export class CatalogosRepository extends BaseRepository {
    constructor(db) {
        super(db, 'catalogos', { defaultOrderBy: 'nome', filterableColumns: [] });
    }

    isNomeDuplicado(nome, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM catalogos WHERE nome = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM catalogos WHERE nome = ? AND excluidoEm IS NULL`;
        return !!this.db.prepare(sql).get(excludeId ? [nome, excludeId] : [nome]);
    }
}