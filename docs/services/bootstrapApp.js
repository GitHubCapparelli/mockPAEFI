const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

$(document).ready(() => {
    $('#cmbPerfil').on('change', AoSelecionarPerfil).trigger('change');
});


function AoSelecionarPerfil() {
    const val  = $(this).val();
    const show = (val !== 'outro') && (val !== '');

    divGerirPAEFI.toggle(show);
    if (show) {
        lblMessage.text(`Carregar usuário com perfil "${val}" e armazenar em local-storage`);
    } else {
        lblMessage.text('Limpar cache etc.');
    }
}