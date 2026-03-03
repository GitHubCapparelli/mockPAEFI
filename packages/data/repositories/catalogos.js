// packages/data/repositories/catalogoRepository.js
import { BaseRepository } from './_baseRepo.js';

export class CatalogosRepository extends BaseRepository {

    constructor() {
        super('catalogos', {
            defaultOrderBy: 'nome',
            filterableColumns: []          // catálogo não tem filtros por ora
        });
    }

    /**
     * Verifica unicidade de nome (excluindo o próprio registro em updates).
     */
    isNomeDuplicado(nome, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM catalogos WHERE nome = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM catalogos WHERE nome = ? AND excluidoEm IS NULL`;

        const args = excludeId ? [nome, excludeId] : [nome];
        return !!this.db.prepare(sql).get(args);
    }
}

export default new CatalogosRepository();