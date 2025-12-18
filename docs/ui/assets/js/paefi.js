function getFromStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

////

const txtCurrentUserScope = $('#txtCurrentUserScope');
const txtCurrentUserRole  = $('#txtCurrentUserRole');
const txtCurrentUserName  = $('#txtCurrentUserName');
const lblMessage          = $('#lblMessage');

function exibirUsuario() {
    const usuario = getFromStorage('currentUser');
    if (usuario) {
        txtCurrentUserName.text(usuario.nome);
        txtCurrentUserRole.text(usuario.papel);
        txtCurrentUserScope.text(usuario.unidade);
    }
}

$(document).ready(exibirUsuario);
