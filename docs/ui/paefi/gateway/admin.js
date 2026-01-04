// ui/paefi/admin/admin.js
import { CoreAdminGateway }          from '../gateway/coreGateway.js';
//import { UnidadesGateway }           from '../gateway/unidadesGateway.js';
import { UsuariosServidoresGateway } from '../gateway/usuariosServidoresGateway.js';
import { Session, CurrentUserKey }   from '../../services/storage.js';

document.addEventListener('DOMContentLoaded', bootstrapAdmin);

async function bootstrapAdmin() {
  const user = Session.Get(CurrentUserKey);

  if (!user) {
    console.error('[admin] No authenticated user found');
    return;
  }

  await CoreAdminGateway.Init(user);
  CoreAdminGateway.RegisterAdminGateway('usuariosServidores', UsuariosServidoresGateway);
  CoreAdminGateway.RegisterAdminGateway('unidades', UnidadesGateway );
  CoreAdminGateway.ActivateInitialGateway();
}