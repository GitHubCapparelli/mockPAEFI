import { Session, CurrentUserKey } from '../../services/storage.js';
import { UsuarioServidorGateway } from '../gateway/usuarioServidor.js';

const user = Session.Get(CurrentUserKey);

const txtNome     = $('#txtUser-nome');
const txtLogin    = $('#txtUserlogin');
const txtUnidade  = $('#txtUser-unidade');
const lblMensagem = $('#lblMensagem');

function exibirServidor() {
    txtNome.text(user.nome);
    txtLogin.text(user.login);
    txtUnidade.text(user.hierarquia);
}

$(document).ready(() => {
    if (user) {
        exibirServidor();
        UsuarioServidorGateway.init();
    } else {
        console.warn('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});


