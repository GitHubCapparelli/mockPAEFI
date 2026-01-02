import { AuthService }             from '../../../services/auth/fakeLogin.js';
import { Session, CurrentUserKey } from '../../../services/storage.js';
import { resolveModuleVisibility } from '../../../services/authz/moduleVisibility.js';

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
  console.log('CurrentUser :', user);
  console.log('AuthContext :', user?.context);
}

function showIf(user) {
  hideAll();
  if (!user || !user.context) return;

  txtLogin.text(user.login);

  const visibility = resolveModuleVisibility(user.context);
  if (visibility.atender) { divPaefi.show(); }
  if (visibility.monitor) { divGestao.show(); }
  if (visibility.admin)   { divAdmin.show(); }
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil);
    divPaefi.hide();

    const user = Session.Get(CurrentUserKey);
    showIf(user);
});
