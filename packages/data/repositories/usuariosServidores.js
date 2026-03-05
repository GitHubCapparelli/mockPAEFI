// packages/data/repositories/usuariosServidores.js
import { BaseRepository } from './_baseRepo.js';
export class UsuariosServidoresRepository extends BaseRepository {
    constructor(db) {
        super(db, 'usuariosServidores', { defaultOrderBy: 'nome', filterableColumns: ['unidadeID', 'funcao', 'cargo', 'especialidade'] });
    }

    isCpfDuplicado(cpf, excludeId = null) {
        if (!cpf) return false;
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE cpf = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE cpf = ? AND excluidoEm IS NULL`;
        return !!this.db.prepare(sql).get(excludeId ? [cpf, excludeId] : [cpf]);
    }

    isLoginDuplicado(login, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE login = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE login = ? AND excluidoEm IS NULL`;
        return !!this.db.prepare(sql).get(excludeId ? [login, excludeId] : [login]);
    }

    isMatriculaDuplicada(matricula, excludeId = null) {
        const sql = excludeId
            ? `SELECT 1 FROM usuariosServidores WHERE matricula = ? AND id != ? AND excluidoEm IS NULL`
            : `SELECT 1 FROM usuariosServidores WHERE matricula = ? AND excluidoEm IS NULL`;
        return !!this.db.prepare(sql).get(excludeId ? [matricula, excludeId] : [matricula]);
    }

    findByLogin(login) {
        return this.db
            .prepare(`SELECT * FROM usuariosServidores
                       WHERE login = ? AND excluidoEm IS NULL`)
            .get(login) ?? null;
    }

    findAllForLookup() {
        return this.db
            .prepare(`SELECT id, nome, login FROM usuariosServidores
                       WHERE excluidoEm IS NULL ORDER BY nome`)
            .all();
    }
}