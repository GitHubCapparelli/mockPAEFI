import { authService } from '../../../services/auth/login.js';

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

function selecionarPerfil() {
    const value = $(this).val();
    const user  = AuthService.EmulateLogin(value);

    if (show) {
        lblMessage.text(`Usuário: ${user.nome}`);

    } else if (lblMessage.text().trim()) {
        lblMessage.text();
    }
    divGerirPAEFI.toggle(show);
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil).trigger('change');
});
