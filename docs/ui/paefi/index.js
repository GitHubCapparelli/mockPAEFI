import { Session, CurrentUserKey } from '../../services/storage.js';
import { UsuarioServidorGateway } from '../gateway/usuarioServidor.js';

const user        = Session.Get(CurrentUserKey);

const txtNome     = $('#txtUser-nome');
const txtLogin    = $('#txtUser-login');
const txtUnidade  = $('#txtUser-unidade');
const lblMensagem = $('#lblMensagem');

function exibirServidor() {
    txtNome.text(user.nome);
    txtLogin.text(user.login);
    txtUnidade.text(user.hierarquia);
}

$(document).ready(async () => {
    if (user) {
        exibirServidor();
        await UsuarioServidorGateway.init();
    } else {
        lblMensagem.text('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});


