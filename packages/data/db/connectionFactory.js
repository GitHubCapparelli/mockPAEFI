// packages/data/db/connectionFactory.js
import Database from 'better-sqlite3';
import path     from 'path';

const ORIGINS = {
  RemotePoC : process.env.DB_REMOTE     || '../mockPAEFI-data/db/mockPAEFI.sqlite',
  Research  : process.env.DB_RESEARCH   || null,    // endereço futuro - ambiente de R&D            GERVIS
  Homolog   : process.env.DB_HOMOLOG    || null,    // endereço futuro - ambiente de homologação    SUGIP
  Producao  : process.env.DB_PROD       || null     // endereço futuro - ambiente de produção       SIDS
};

const cache = new Map();

export function getConnection(origin = 'RemotePoC') {
    if (cache.has(origin)) return cache.get(origin);

    const dbPath = ORIGINS[origin];
    if (!dbPath) throw new Error(`DataOrigin não configurado: ${origin}`);

    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    cache.set(origin, db);
    return db;
}