import { AuthService } from '../../../services/auth/fakeLogin.js';

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

function selecionarPerfil() {
    const value = $(this).val();
    const user  = AuthService.EmulateLogin(value);

    if (user) {
        lblMessage.text(`Usuário: ${user.nome} | ${value}`);

    } else if (lblMessage.text().trim()) {
        lblMessage.text(`Usuário: [vazio] | ${value}`);
    }
    divGerirPAEFI.toggle(user);
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil).trigger('change');
});
