import { Orgao, AuthService } from '../../../services/auth/fakeLogin.js';

const lblMessage     = $('#lblMessage');
const divPaefiGestao = $('#divPaefi-supervisao');
const divPaefiAdmin  = $('#divPaefi-admin');

function mapPerfil(value) {
  switch (value) {
    case 'creas' :  return Orgao.AGENTE_SOCIAL;
    case 'disefi':  return Orgao.DISEFI;
    case 'subsas':  return Orgao.SUBSAS;
    default:        return Orgao.OUTRO;
  }
}

async function selecionarPerfil() {
    const value = $(this).val();
    const orgao = mapPerfil(value);
    const user  = await AuthService.EmulateLogin(orgao);

    if (user) {
      lblMessage.text(`Usuário: ${user.login} | ${user.unidade}`);
      divGerirPAEFI.show();
      console.log(user);

      if (orgao === Orgao.SUBSAS) {
        alert('Oi SUBSAS');
      }

    } else {
      lblMessage.text('');
      divGerirPAEFI.hide();
    }
}

$(document).ready(() => {
    divGerirPAEFI.toggle(); // oculta o módulo ao carregar a página
    $('#cmbPerfil').on('change', selecionarPerfil);
});
