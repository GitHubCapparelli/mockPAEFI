const divGerirPAEFI = $('#divGerirPAEFI');

$(document).ready(() => {
    $('#cmbPerfil').on('change', AoSelecionarPerfil).trigger('change');
});


function AoSelecionarPerfil() {
    const val  = $(this).val();
    const show = (val !== 'outro') && (val !== '');

    divGerirPAEFI.toggle(show);
    if (show) {
        alert(`Carregar usuário com perfil ${val} e armazenar em local-storage`);
    } else {
        alert('Limpar cache etc.');
    }
}