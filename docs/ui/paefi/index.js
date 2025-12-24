import { Session, CurrentUserKey } from '../../services/storage.js';
const user = Session.Get(CurrentUserKey);

const txtServidorNome    = $('#txtServidor-nome');
const txtServidorUnidade = $('#txtServidor-unidade');
const lblMensagem         = $('#lblMensagem');

function exibirServidor() {
    txtServidorNome.text(user.nome);
    txtServidorUnidade.text(user.unidade);
}

$(document).ready(() => {
    if (user) {
        exibirServidor();
    } else {
        console.warn('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});