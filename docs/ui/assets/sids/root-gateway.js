import { Orgao, AuthService } from '../../../services/auth/fakeLogin.js';

const lblMessage     = $('#lblMessage');
const divPaefi       = $('#divSids-paefi');
const divPaefiGestao = $('#divPaefi-supervisao');
const divPaefiAdmin  = $('#divPaefi-admin');

function mapear(perfil) {
  switch (perfil) {
    case 'creas' :  return Orgao.CREAS;
    case 'disefi':  return Orgao.DISEFI;
    case 'subsas':  return Orgao.SUBSAS;
    default:        return Orgao.OUTRO;
  }
}

function hideAll() {
  divPaefi.hide();
  divPaefiGestao.hide();
  divParfiAdmin.hide();
  lblMessage.text('');
}

async function selecionarPerfil() {
    const perfil = $(this).val();
    const orgao  = mapear(perfil);
    const user   = await AuthService.EmulateLogin(orgao);

    hideAll();
    if (user) {
      divPaefi.show();

      if (orgao === Orgao.DISEFI || orgao === Orgao.SUBSAS) {
        divPaefiGestao.show();

        if (orgao === Orgao.SUBSAS) {
          divPaefiAdmin.show();
        }
      }
      lblMessage.text(`Usuário: ${user.login} | ${user.unidade}`);
    } 
}

$(document).ready(() => {
    divPaefi.toggle(); // oculta o módulo ao carregar a página
    $('#cmbPerfil').on('change', selecionarPerfil);
});
