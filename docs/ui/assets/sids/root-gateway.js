import { AuthService } from '../../../services/auth/fakeLogin.js';

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

async function selecionarPerfil() {
    const value = $(this).val();
    const user  = await AuthService.EmulateLogin(value);

    if (user) {
        lblMessage.text(`Usuário: ${user.login} | ${user.unidade}`);

    } else if (lblMessage.text().trim()) {
        lblMessage.text(`Usuário: [vazio] | ${value}`);
    }
    divGerirPAEFI.toggle(user);
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil).trigger('change');
});
