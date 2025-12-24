import { Session, CurrentUserKey } from '../../services/storage.js';
const user = Session.Get(CurrentUserKey);

const txtServidor-nome    = $('#txtServidor-nome');
const txtServidor-unidade = $('#txtServidor-unidade');
const lblMensagem         = $('#lblMensagem');

function exibirServidor() {
    txtServidor-nome.text(user.nome);
    txtServidor-unidade.text(user.unidade);
}

$(document).ready(() => {
    if (user) {
        exibirServidor();
    } else {
        console.warn('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});