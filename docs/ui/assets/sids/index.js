import { Session, CurrentUserKey } from '../../../services/storage.js';
import { AuthService }             from '../../../services/auth/fakeLogin.js';

const lblMessage  = $('#lblMessage');
const divPaefi    = $('#divSids-paefi');
const divGestao   = $('#divPaefi-supervisao');
const divAdmin    = $('#divPaefi-admin');
const txtLogin    = $('#txtUser-login');

function hideAll() {
  divPaefi.hide();
  divGestao.hide();
  divAdmin.hide();
  lblMessage.text('');
  txtLogin.text('');
}

async function selecionarPerfil() {
  const userID  = $(this).val();
  const user    = await AuthService.EmulateLogin(userID);
  showIf(user);
  
  console.log(user);
}

function showIf(user) {
  hideAll();
  if (user) {
    txtLogin.text(user.login);

    if (user.podeAcessar) {
      divPaefi.show();

      if (user.podeMonitorar) {
        divGestao.show();
      }

      if (user.podeCadastrar) {
        divAdmin.show();
      }
    }
  }
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil);
    divPaefi.hide();

    const user = Session.Get(CurrentUserKey);
    showIf(user);
});
