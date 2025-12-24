import { Session, CurrentUserKey } from '../../services/storage.js';
const user = Session.Get(CurrentUserKey);

const txtCurrentUserScope = $('#txtCurrentUserScope');
const txtCurrentUserRole  = $('#txtCurrentUserRole');
const txtCurrentUserName  = $('#txtCurrentUserName');
const lblMessage          = $('#lblMessage');

function exibirUsuario() {
    txtCurrentUserName.text(user.nome);
    txtCurrentUserRole.text(user.perfil);
    txtCurrentUserScope.text(user.unidade);
}

$(document).ready(() => {
    if (user) {
        exibirUsuario();
    } else {
        console.warn('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
});