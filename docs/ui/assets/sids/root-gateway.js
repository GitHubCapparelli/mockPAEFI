import { Session, CurrentUserKey } from '../../../services/storage.js';
import { Perfil, AuthService }      from '../../../services/auth/fakeLogin.js';

const lblMessage  = $('#lblMessage');
const divPaefi    = $('#divSids-paefi');
const divGestao   = $('#divPaefi-supervisao');
const divAdmin    = $('#divPaefi-admin');

function mapear(perfil) {
  switch (perfil) {
    case 'creas' :  return Perfil.CREAS;
    case 'disefi':  return Perfil.DISEFI;
    case 'subsas':  return Perfil.SUBSAS;
    default:        return Perfil.OUTRO;
  }
}

function hideAll() {
  divPaefi.hide();
  divGestao.hide();
  divAdmin.hide();
  lblMessage.text('');
}

async function selecionarPerfil() {
  const value  = $(this).val();
  const perfil = mapear(value);
  const user   = await AuthService.EmulateLogin(perfil);
  showIf(user);
}

function showIf(user) {
  if (!user || user.perfil === Perfil.OUTRO) {
    hideAll();
    return;
  } 

  divPaefi.show();
  lblMessage.text(`Usuário: ${user.login}`);

  if (user.perfil === Perfil.DISEFI || user.perfil === Perfil.SUBSAS) {
    divGestao.show();

    if (user.perfil === Perfil.SUBSAS) {
      divAdmin.show();
    }
  }
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil);

    const current = Session.Get(CurrentUserKey);
    if (!current) {
      $('#cmbPerfil').trigger('change');
    }
});
