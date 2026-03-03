// packages/data/repositories/unidadeRepository.js
import { BaseRepository } from './_baseRepo.js';

export class UnidadesRepository extends BaseRepository {
    constructor() {
        super('unidades', {
            defaultOrderBy: 'nome',
            filterableColumns: ['funcao', 'hierarquiaID']
        });
    }

    isSiglaDuplicada(sigla, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM unidades WHERE sigla = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM unidades WHERE sigla = ? AND excluidoEm IS NULL`;

        const args = excludeId ? [sigla, excludeId] : [sigla];
        return !!this.db.prepare(sql).get(args);
    }

    /**
     * Retorna todas as unidades sem paginação — útil para preencher
     * selects/lookups na UI.
     */
    findAllForLookup() {
        return this.db
            .prepare(`SELECT id, sigla, nome FROM unidades WHERE excluidoEm IS NULL ORDER BY sigla`)
            .all();
    }
}

export default new UnidadesRepository();