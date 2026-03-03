-- // packages/data/ddl/historico.sql
CREATE TABLE historico (
    id              TEXT PRIMARY KEY    CHECK (length(id) = 36),
    catalogoID      TEXT NOT NULL       CHECK (length(catalogoID) = 36),        -- UUID FK catalogos
    usuarioID       TEXT NOT NULL       CHECK (length(usuarioID) = 36),         -- UUID FK usuariosServidores
    sessionId       TEXT NOT NULL       CHECK (length(sessionId) <= 100),
    tipo            TEXT NOT NULL       DEFAULT 'NaoInformado'
                                        CHECK (tipo IN ('NaoInformado','Erro','Backend','Frontend','Qualidade','Compliance','Desempenho')),
    dataHora        TEXT NOT NULL       CHECK (length(dataHora) = 20),          -- datetime UTC
    acao            TEXT NOT NULL       CHECK (length(acao) <= 50),
    justificativa   TEXT,
    descricao       TEXT,
    diff            TEXT,

    FOREIGN KEY (catalogoID) REFERENCES catalogos(id),
    FOREIGN KEY (usuarioID)  REFERENCES usuariosServidores(id),

    CHECK (dataHora GLOB '????-??-??T??:??:??Z')
);