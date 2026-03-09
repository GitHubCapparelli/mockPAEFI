// docs/ui/assets/sids/index.js
import { AuthAPI }                 from '../../../services/auth/authAPI.js';
import { Session, CurrentUserKey } from '../../../services/storage.js';
import { resolveModuleVisibility } from '../../../services/authz/moduleVisibility.js';

const lblMessage = $('#lblMessage');
const divPaefi   = $('#divSids-paefi');
const divGestao  = $('#divPaefi-supervisao');
const divAdmin   = $('#divPaefi-admin');
const txtLogin   = $('#txtUser-login');

function hideAll() {
    divPaefi.hide();
    divGestao.hide();
    divAdmin.hide();
    lblMessage.text('');
    txtLogin.text('');
}

function showIf(user) {
    hideAll();
    if (!user?.context) return;

    txtLogin.text(user.info?.login || '');

    const visibility = resolveModuleVisibility(user.context);
    if (visibility.atender) divPaefi.show();
    if (visibility.monitor) divGestao.show();
    if (visibility.admin)   divAdmin.show();
}

async function selecionarPerfil() {
    const userID = $(this).val();
    if (!userID) return;

    await AuthAPI.logout();

    const result = await AuthAPI.login(userID);

    if (!result.ok) {
        hideAll();
        lblMessage.text(`Erro: ${result.error}`);
        console.error('[index] Login falhou:', result.error);
        return;
    }

    const user = result.data;
    showIf(user);
    console.log('CurrentUser :', user);
    console.log('AuthContext :', user?.context);
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil);
    divPaefi.hide();

    const user = Session.Get(CurrentUserKey);
    showIf(user);
});