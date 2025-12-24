/* UsuarioServidor Gateway */
(function ($) {
    'use strict';

    // Application state
    var state = {
        currentPage: 1,
        pageSize: 10,
        filters: {
            unidadeID: '',
            search: ''
        },
        addModal: null,
        editModal: null
    };

    // Initialization
    function init() {
        state.addModal  = new bootstrap.Modal(document.getElementById('addModal'));
        state.editModal = new bootstrap.Modal(document.getElementById('editModal'));

        UsuarioServidorService.init()
            .done(function () {
                loadUsuarios();
                setupEventHandlers();
            })
            .fail(function () {
                showError('Falha ao inicializar usuários servidores');
            });
    }

    // Data loading
    function loadUsuarios() {
        var result = UsuarioServidorService.getPaginated(
            state.currentPage,
            state.pageSize,
            state.filters
        );
        renderTable(result.data);
        renderPagination(result);
    }

    // Rendering
    function renderTable(usuarios) {
        var tbody = $('#tbodyServidores');
        tbody.empty();

        if (!usuarios.length) {
            tbody.append(
                '<tr><td colspan="6" class="text-center">Nenhum registro encontrado</td></tr>'
            );
            return;
        }

        usuarios.forEach(function (u) {
            var row = $('<tr>').append(
                $('<td>').text(u.nome),
                $('<td>').text(u.login),
                $('<td>').text(u.funcao),
                $('<td>').text(u.cargo),
                $('<td>').text(u.especialidade || '-'),
                $('<td>').append(renderActions(u.id))
            );
            tbody.append(row);
        });
    }

    function renderActions(id) {
        return $('<div>').addClass('btn-group btn-group-sm').append(
            $('<button>')
                .addClass('btn btn-outline-primary')
                .attr('title', 'Editar')
                .data('id', id)
                .on('click', handleEdit)
                .append($('<i>').addClass('fas fa-edit')),
            $('<button>')
                .addClass('btn btn-outline-danger')
                .attr('title', 'Excluir')
                .data('id', id)
                .on('click', handleDelete)
                .append($('<i>').addClass('fas fa-trash'))
        );
    }

    // Pagination
    function renderPagination(result) {
        $('#txtPaginationInfo').text(
            'Página ' + result.page + ' de ' + result.pages +
            ' — ' + result.total + ' registros'
        );

        var pagination = $('#ulPaginationControls');
        pagination.empty();

        pagination.append(createNavButton('Anterior', result.page === 1, function () {
            state.currentPage--;
            loadUsuarios();
        }));

        for (var i = 1; i <= result.pages; i++) {
            pagination.append(createPageButton(i, result.page));
        }

        pagination.append(createNavButton('Próxima', result.page === result.pages, function () {
            state.currentPage++;
            loadUsuarios();
        }));
    }

    function createPageButton(page, current) {
        return $('<li>')
            .addClass('page-item' + (page === current ? ' active' : ''))
            .append(
                $('<a>')
                    .addClass('page-link')
                    .attr('href', '#')
                    .text(page)
                    .on('click', function (e) {
                        e.preventDefault();
                        state.currentPage = page;
                        loadUsuarios();
                    })
            );
    }

    function createNavButton(label, disabled, action) {
        return $('<li>')
            .addClass('page-item' + (disabled ? ' disabled' : ''))
            .append(
                $('<a>')
                    .addClass('page-link')
                    .attr('href', '#')
                    .text(label)
                    .on('click', function (e) {
                        e.preventDefault();
                        if (!disabled) action();
                    })
            );
    }

    // =====================================================
    // Event handlers
    // =====================================================
    function setupEventHandlers() {
        $('#btnApplyFilter').on('click', handleApplyFilter);
        $('#btnClearFilter').on('click', handleClearFilter);

        $('#btnRefresh').on('click', handleRefresh);
        $('#btnAddNew').on('click', handleAddNew);

        $('#btnSaveNew').on('click', handleSaveNew);
        $('#btnSaveEdit').on('click', handleSaveEdit);
    }

    function handleApplyFilter() {
        state.filters.unidadeID = $('#filterUnidade').val();
        state.filters.search   = $('#filterSearch').val();
        state.currentPage = 1;
        loadUsuarios();
    }

    function handleClearFilter() {
        $('#filterUnidade').val('');
        $('#filterSearch').val('');

        state.filters = { unidadeID: '', search: '' };
        state.currentPage = 1;
        loadUsuarios();
    }

    function handleRefresh() {
        UsuarioServidorService.init().done(function () {
            loadUsuarios();
            showSuccess('Dados atualizados');
        });
    }

    // CRUD actions
    function handleAddNew() {
        $('#addForm')[0].reset();
        state.addModal.show();
    }

    function handleEdit(e) {
        var id = $(e.currentTarget).data('id');
        var u = UsuarioServidorService.getById(id);

        if (!u) return;

        $('#editId').val(u.id);
        $('#editNome').val(u.nome);
        $('#editLogin').val(u.login);
        $('#editFuncao').val(u.funcao);
        $('#editCargo').val(u.cargo);
        $('#editEspecialidade').val(u.especialidade);

        state.editModal.show();
    }

    function handleSaveNew() {
        var dto = {
            unidadeID     : $('#addUnidade').val(),
            nome          : $('#addNome').val(),
            login         : $('#addLogin').val(),
            funcao        : $('#addFuncao').val(),
            cargo         : $('#addCargo').val(),
            especialidade : $('#addEspecialidade').val()
        };

        UsuarioServidorService.add(CreateUsuarioServidorDTO(dto));
        state.addModal.hide();

        state.currentPage = 1;
        loadUsuarios();
        showSuccess('Usuário criado com sucesso');
    }

    function handleSaveEdit() {
        var id = $('#editId').val();

        UsuarioServidorService.update(id, {
            nome          : $('#editNome').val(),
            login         : $('#editLogin').val(),
            funcao        : $('#editFuncao').val(),
            cargo         : $('#editCargo').val(),
            especialidade : $('#editEspecialidade').val()
        });

        state.editModal.hide();
        loadUsuarios();
        showSuccess('Usuário atualizado com sucesso');
    }

    function handleDelete(e) {
        var id = $(e.currentTarget).data('id');
        var u = UsuarioServidorService.getById(id);

        if (!u) return;

        if (confirm('Deseja excluir ' + u.nome + '?')) {
            UsuarioServidorService.remove(id);

            if (state.currentPage > 1 &&
                UsuarioServidorService.getPaginated(
                    state.currentPage,
                    state.pageSize,
                    state.filters
                ).data.length === 0) {
                state.currentPage--;
            }
            loadUsuarios();
            showSuccess('Usuário excluído');
        }
    }

    // Messaging helpers
    function showSuccess(msg) {
        alert(msg);
    }

    function showError(msg) {
        alert('Erro: ' + msg);
    }
})(jQuery);
