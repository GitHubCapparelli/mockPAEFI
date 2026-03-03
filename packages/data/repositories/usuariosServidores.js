// packages/data/repositories/usuarioServidorRepository.js
import { BaseRepository } from './_baseRepo.js';

export class UsuariosServidoresRepository extends BaseRepository {
    constructor() {
        super('usuariosServidores', {
            defaultOrderBy: 'nome',
            filterableColumns: ['unidadeID', 'funcao', 'cargo', 'especialidade']
        });
    }

    isCpfDuplicado(cpf, excludeId = null) {
        if (!cpf) return false;
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE cpf = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE cpf = ? AND excluidoEm IS NULL`;

        const args = excludeId ? [cpf, excludeId] : [cpf];
        return !!this.db.prepare(sql).get(args);
    }

    isLoginDuplicado(login, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE login = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE login = ? AND excluidoEm IS NULL`;

        const args = excludeId ? [login, excludeId] : [login];
        return !!this.db.prepare(sql).get(args);
    }

    isMatriculaDuplicada(matricula, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE matricula = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE matricula = ? AND excluidoEm IS NULL`;

        const args = excludeId ? [matricula, excludeId] : [matricula];
        return !!this.db.prepare(sql).get(args);
    }

    findByLogin(login) {
        return this.db
            .prepare(`SELECT * FROM usuariosServidores WHERE login = ? AND excluidoEm IS NULL`)
            .get(login) ?? null;
    }

    /**
     * Para lookups na UI (seleção de usuário em filtros do histórico).
     */
    findAllForLookup() {
        return this.db
            .prepare(`SELECT id, nome, login FROM usuariosServidores WHERE excluidoEm IS NULL ORDER BY nome`)
            .all();
    }
}

export default new UsuariosServidoresRepository();