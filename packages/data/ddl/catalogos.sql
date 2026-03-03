-- // packages/data/ddl/catalogos.sql
CREATE TABLE catalogos (
    id             TEXT PRIMARY KEY             CHECK (length(id) = 36),
    nome           TEXT NOT NULL                CHECK (length(nome) BETWEEN 3 AND 100),
    versao         TEXT NOT NULL                CHECK (length(versao) <= 10),
    finalidade     TEXT NOT NULL                CHECK (length(finalidade) <= 200),
    criadoEm       TEXT NOT NULL                CHECK (length(criadoEm) = 20),                              -- datetime UTC
    criadoPor      TEXT NOT NULL                CHECK (length(criadoPor) = 36),                             -- UUID FK usuariosServidores
    alteradoEm      TEXT                        CHECK (alteradoEm  IS NULL OR length(alteradoEm) = 20),     -- datetime UTC
    alteradoPor     TEXT                        CHECK (alteradoPor IS NULL OR length(alteradoPor) = 36),    -- UUID FK usuariosServidores
    excluidoEm      TEXT                        CHECK (excluidoEm  IS NULL OR length(excluidoEm) = 20),     -- datetime UTC
    excluidoPor     TEXT                        CHECK (excluidoPor IS NULL OR length(excluidoPor) = 36),    -- UUID FK usuariosServidores
    exclusaoFisica INTEGER NOT NULL DEFAULT 0   CHECK (exclusaoFisica IN (0,1)),

    CHECK (id LIKE '________-____-____-____-____________'),

    CHECK (criadoPor LIKE '________-____-____-____-____________'),
    CHECK (alteradoPor IS NULL OR alteradoPor LIKE '________-____-____-____-____________'),
    CHECK (excluidoPor IS NULL OR excluidoPor LIKE '________-____-____-____-____________'),

    CHECK (criadoEm GLOB '????-??-??T??:??:??Z'),
    CHECK (alteradoEm IS NULL OR alteradoEm GLOB '????-??-??T??:??:??Z'),
    CHECK (excluidoEm IS NULL OR excluidoEm GLOB '????-??-??T??:??:??Z')
);