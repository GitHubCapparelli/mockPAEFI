// index.js
export * from './ddd/entities/appDominio.js';
export * from './ddd/entities/appModulo.js';
export * from './ddd/entities/catalogo.js';
export * from './ddd/entities/historico.js';
export * from './ddd/entities/unidade.js';
export * from './ddd/entities/usuarioServidor.js';
export * from './ddd/enums/_baseEnum.js';
export * from './ddd/enums/cargoUsuario.js';
export * from './ddd/enums/dataOrigin.js';
export * from './ddd/enums/especialidade.js';
export * from './ddd/enums/funcaoUnidade.js';
export * from './ddd/enums/funcaoUsuario.js';
export * from './ddd/enums/grauImpacto.js';
export * from './ddd/enums/tipoAcesso.js';
export * from './ddd/enums/tipoCriptografia.js';
export * from './ddd/enums/tipoLog.js';
export * from './ddd/errors/domainError.js';
export * from './ddd/valueObjects/cpf.js';
export * from './ddd/valueObjects/dataHoraUTC.js';
export * from './ddd/valueObjects/matricula.js';
export * from './ddd/valueObjects/uuid.js';

// Nota: arquivos .json (contracts) não são exportáveis via export *
// Importe-os diretamente onde necessário:
// import schema from 'packages/model/contracts/dominio/unidade.json' assert { type: 'json'
