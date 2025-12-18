function saveToStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

/////

const divGerirPAEFI = $('#divGerirPAEFI');
const lblMessage    = $('#lblMessage');

function selecionarPerfil() {
    const val  = $(this).val();
    const show = (val !== 'outro') && (val !== '');

    if (show) {
        lblMessage.text(`Carregar usuário com perfil "${val}" e armazenar em local-storage`);
        //
        const currentUser = {
            papel: 'Assessor',
            nome: 'Carlos Eduardo de Carvalho Capparelli',
            unidade: 'GERVIS'
        };
        saveToStorage('currentUser', currentUser);

    } else if (lblMessage.text().trim()) {
        lblMessage.text('Limpar cache etc.');
    }
    divGerirPAEFI.toggle(show);
}

$(document).ready(() => {
    $('#cmbPerfil').on('change', selecionarPerfil).trigger('change');
});
