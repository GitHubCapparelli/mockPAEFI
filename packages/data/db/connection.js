// packages/data/db/connection.js
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH   = join(__dirname, 'mockPAEFI.sqlite');

class Connection {
    #db = null;

    open() {
        if (this.#db) return this.#db;

        this.#db = new Database(DB_PATH, {
            // verbose: console.log   // descomente para logar cada SQL
        });

        this.#db.pragma('journal_mode = WAL');
        this.#db.pragma('foreign_keys = ON');

        return this.#db;
    }

    get db() {
        return this.open();
    }

    close() {
        if (this.#db) {
            this.#db.close();
            this.#db = null;
        }
    }
}