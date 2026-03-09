// packages/api/src/services/_registry.js
// ── Service Registry ──────────────────────────────────────────────────────────
// Para adicionar um novo domínio:
//   1. Importe o service abaixo
//   2. Acrescente uma entrada em ServiceRegistry
//   O server.js não precisa ser alterado.

import { CatalogosService }          from './catalogos.js';
import { HistoricoService }          from './historico.js';
import { UnidadesService }           from './unidades.js';
import { UsuariosServidoresService } from './usuariosServidores.js';

export const ServiceRegistry = [
    { path: 'catalogos',           Service: CatalogosService          },
    { path: 'historico',           Service: HistoricoService           },
    { path: 'unidades',            Service: UnidadesService            },
    { path: 'usuariosServidores',  Service: UsuariosServidoresService  },
];