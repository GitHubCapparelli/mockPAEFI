import { AppEngine } from '../../core/engine/appEngine.js';

const txtCurrentUserScope = $('#txtCurrentUserScope');
const txtCurrentUserRole  = $('#txtCurrentUserRole');
const txtCurrentUserName  = $('#txtCurrentUserName');
const lblMessage          = $('#lblMessage');

function exibirUsuario() {
    if (AppEngine.init()) {
        const user = AppEngine.GetCurrentUser();
        txtCurrentUserName.text(user.nome);
        txtCurrentUserRole.text(user.role);
        txtCurrentUserScope.text(user.unidade);
    } else {
        console.warn('Usuário não localizado. Redirecionando...');
        window.location.href = '/mockPAEFI/';
    }
}

$(document).ready(exibirUsuario);
