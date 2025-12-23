import { AuthService } from '../../../services/auth/fakeLogin.js';

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

function mapPerfil(value) {
  switch (value?.toLowerCase()) {
    case 'gestor':        return AuthService.Papel.GESTOR;
    case 'equipe':        return AuthService.Papel.EQUIPE;
    case 'especialista':  return AuthService.Papel.ESPECIALISTA;
    case 'agentesocial':  return AuthService.Papel.AGENTE_SOCIAL;
    case 'disefi':        return AuthService.Papel.DISEFI;
    case 'subsas':        return AuthService.Papel.SUBSAS;
    default:              return AuthService.Papel.OUTRO;
  }
}

async function selecionarPerfil() {
    const value = $(this).val();
    const papel = mapPerfil(value);
    const user  = await AuthService.EmulateLogin(papel);

    lblMessage.text(user ? `Usuário: ${user.login} | ${user.unidade}`
                         : `Usuário: [vazio] | ${value}`);
    divGerirPAEFI.toggle(user);
}

$(document).ready(() => {
    divGerirPAEFI.toggle(); // oculta o módulo ao carregar a página
    $('#cmbPerfil').on('change', selecionarPerfil);
});
