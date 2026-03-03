-- // packages/data/ddl/usuariosServidores.sql
CREATE TABLE usuariosServidores (
    id              TEXT PRIMARY KEY            CHECK (length(id) = 36),
    unidadeID       TEXT NOT NULL               CHECK (length(unidadeID) = 36),
    nome            TEXT NOT NULL               CHECK (length(nome) BETWEEN 10 AND 200),
    funcao          TEXT NOT NULL               CHECK (funcao IN ('NaoInformada','Assessor','AssessorEspecial','AssessorTecnico','Chefe','ChefeGabinete','Coordenador','Diretor','Gerente','Ouvidor','SecretarioAdjunto','SecretarioEstado','Secretario Executivo','SubSecretario','Outra')),
    cargo           TEXT NOT NULL               CHECK (cargo IN ('NaoInformado','AnalistaPlanejamento','AnalistaPoliticasPublicas','GestorPoliticasPublicas','AuxiliarAdministrativo','AuxiliarAssistenciaSocial','Especialista','Tecnico','Outro')),
    especialidade   TEXT NOT NULL               CHECK (especialidade IN ('NaoInformada','Administrador','AgenteAdministrativo','AgenteSocial','AssistenteSocial','ComunicadorSocial','Contador','CuidadorSocial','DireitoLegislativo','EducadorSocial','Marceneiro','Motorista','Nutricionista','OperadorGrafico','Pedagogo','Planejamento','Psicologo','TecnicoEducacaoFisica','TecnicoEducacional','Outra')),
    login           TEXT NOT NULL UNIQUE        CHECK (length(login) BETWEEN 5 AND 100),
    matricula       TEXT NOT NULL UNIQUE        CHECK (length(matricula) = 8),
    cpf             TEXT          UNIQUE        CHECK (cpf IS NULL OR length(cpf) = 11),
    criadoEm        TEXT NOT NULL               CHECK (length(criadoEm) = 20),                              -- datetime UTC
    criadoPor       TEXT NOT NULL               CHECK (length(criadoPor) = 36),                             -- UUID FK usuariosServidores
    alteradoEm      TEXT                        CHECK (alteradoEm  IS NULL OR length(alteradoEm) = 20),     -- datetime UTC
    alteradoPor     TEXT                        CHECK (alteradoPor IS NULL OR length(alteradoPor) = 36),    -- UUID FK usuariosServidores
    excluidoEm      TEXT                        CHECK (excluidoEm  IS NULL OR length(excluidoEm) = 20),     -- datetime UTC
    excluidoPor     TEXT                        CHECK (excluidoPor IS NULL OR length(excluidoPor) = 36),    -- UUID FK usuariosServidores
    exclusaoFisica  INTEGER NOT NULL DEFAULT 0  CHECK (exclusaoFisica IN (0,1)),

    FOREIGN KEY (unidadeID) REFERENCES unidades(id),

    CHECK (id LIKE '________-____-____-____-____________'),
    CHECK (unidadeID LIKE '________-____-____-____-____________'),
    CHECK (criadoPor LIKE '________-____-____-____-____________'),
    CHECK (alteradoPor IS NULL OR alteradoPor LIKE '________-____-____-____-____________'),
    CHECK (excluidoPor IS NULL OR excluidoPor LIKE '________-____-____-____-____________'),

    CHECK (criadoEm GLOB '????-??-??T??:??:??Z'),
    CHECK (alteradoEm IS NULL OR alteradoEm GLOB '????-??-??T??:??:??Z'),
    CHECK (excluidoEm IS NULL OR excluidoEm GLOB '????-??-??T??:??:??Z'),
    
    CHECK (matricula          GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    CHECK (cpf IS NULL OR cpf GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),

    CHECK (funcao != 'Gerente' OR cpf IS NOT NULL)
);