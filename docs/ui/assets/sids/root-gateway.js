import { Papel, AuthService } from '../../../services/auth/fakeLogin.js';

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

function mapPerfil(value) {
  switch (value) {
    case 'gestor':        return Papel.GESTOR;
    case 'equipe':        return Papel.EQUIPE;
    case 'especialista':  return Papel.ESPECIALISTA;
    case 'agenteSocial':  return Papel.AGENTE_SOCIAL;
    case 'disefi':        return Papel.DISEFI;
    case 'subsas':        return Papel.SUBSAS;
    default:              return Papel.OUTRO;
  }
}

async function selecionarPerfil() {
    const value = $(this).val();
    const papel = mapPerfil(value);
    const user  = await AuthService.EmulateLogin(papel);

    lblMessage.text(user ? `Usuário: ${user.login} | ${user.unidade}`
                         : `Usuário: Não localizado`);
    divGerirPAEFI.toggle(user);
    console.log(user);
}

$(document).ready(() => {
    divGerirPAEFI.toggle(); // oculta o módulo ao carregar a página
    $('#cmbPerfil').on('change', selecionarPerfil);
});
