import { Session, CurrentUnidadeKey, CurrentUserKey } from '../../services/storage.js';
import { UsuarioServidorGateway }                     from '../gateway/usuarioServidor.js';

const user = Session.Get(CurrentUserKey);

$(document).ready(async () => {
    if (user) {
        await UsuarioServidorGateway.init(user);
    } else {
        lblMensagem.text('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});


