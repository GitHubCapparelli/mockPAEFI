/**
 * Main Application Logic
 */
(function($) {
    'use strict';

    // Application state
    var state = {
        currentPage: 1,
        pageSize: 10,
        filters: {
            status: '',
            role: ''
        },
        editModal: null,
        addModal: null
    };

    /**
     * Initialize application
     */
    function init() {
        // Initialize modals
        state.editModal = new bootstrap.Modal(document.getElementById('editModal'));
        state.addModal = new bootstrap.Modal(document.getElementById('addModal'));

        // Load data and setup UI
        UserService.init().done(function() {
            loadCurrentUser();
            loadUsers();
            setupEventHandlers();
        }).fail(function() {
            showError('Failed to initialize application');
        });
    }

    /**
     * Load current user profile
     */
    function loadCurrentUser() {
        var user = UserService.getCurrentUser();
        if (user) {
            $('#currentUserName').text(user.name);
            $('#currentUserDepartment').text(user.department);
            $('#currentUserRole').text(user.role);
            if (user.photo) {
                $('#currentUserPhoto').attr('src', user.photo);
            }
        }
    }

    /**
     * Load and display users
     */
    function loadUsers() {
        var result = UserService.getUsersPaginated(
            state.currentPage,
            state.pageSize,
            state.filters
        );

        renderTable(result.data);
        renderPagination(result);
    }

    /**
     * Render data table
     */
    function renderTable(users) {
        var tbody = $('#dataTableBody');
        tbody.empty();

        if (users.length === 0) {
            tbody.append(
                '<tr><td colspan="7" class="text-center">No records found</td></tr>'
            );
            return;
        }

        users.forEach(function(user) {
            var statusClass = getStatusClass(user.status);
            var row = $('<tr>').append(
                $('<td>').text(user.id),
                $('<td>').text(user.name),
                $('<td>').text(user.email),
                $('<td>').append(
                    $('<span>').addClass('badge bg-info').text(capitalizeFirst(user.role))
                ),
                $('<td>').text(user.department),
                $('<td>').append(
                    $('<span>').addClass('badge ' + statusClass).text(capitalizeFirst(user.status))
                ),
                $('<td>').append(
                    $('<div>').addClass('action-buttons').append(
                        $('<button>')
                            .addClass('btn btn-sm btn-outline-primary')
                            .attr('title', 'Edit')
                            .data('id', user.id)
                            .on('click', handleEdit)
                            .append($('<i>').addClass('fas fa-edit')),
                        $('<button>')
                            .addClass('btn btn-sm btn-outline-danger ms-1')
                            .attr('title', 'Delete')
                            .data('id', user.id)
                            .on('click', handleDelete)
                            .append($('<i>').addClass('fas fa-trash'))
                    )
                )
            );
            tbody.append(row);
        });
    }

    /**
     * Render pagination controls
     */
    function renderPagination(result) {
        // Update info text
        $('#paginationInfo').text(
            'Showing ' + result.startRecord + ' - ' + result.endRecord + 
            ' of ' + result.totalRecords + ' records'
        );

        // Build pagination buttons
        var pagination = $('#paginationControls');
        pagination.empty();

        // Previous button
        var prevLi = $('<li>').addClass('page-item' + (result.currentPage === 1 ? ' disabled' : ''));
        prevLi.append(
            $('<a>').addClass('page-link').attr('href', '#').text('Previous')
                .on('click', function(e) {
                    e.preventDefault();
                    if (result.currentPage > 1) {
                        state.currentPage--;
                        loadUsers();
                    }
                })
        );
        pagination.append(prevLi);

        // Page numbers
        var startPage = Math.max(1, result.currentPage - 2);
        var endPage = Math.min(result.totalPages, result.currentPage + 2);

        // First page
        if (startPage > 1) {
            pagination.append(createPageButton(1, result.currentPage));
            if (startPage > 2) {
                pagination.append(
                    $('<li>').addClass('page-item disabled')
                        .append($('<a>').addClass('page-link').text('...'))
                );
            }
        }

        // Page range
        for (var i = startPage; i <= endPage; i++) {
            pagination.append(createPageButton(i, result.currentPage));
        }

        // Last page
        if (endPage < result.totalPages) {
            if (endPage < result.totalPages - 1) {
                pagination.append(
                    $('<li>').addClass('page-item disabled')
                        .append($('<a>').addClass('page-link').text('...'))
                );
            }
            pagination.append(createPageButton(result.totalPages, result.currentPage));
        }

        // Next button
        var nextLi = $('<li>').addClass('page-item' + (result.currentPage === result.totalPages ? ' disabled' : ''));
        nextLi.append(
            $('<a>').addClass('page-link').attr('href', '#').text('Next')
                .on('click', function(e) {
                    e.preventDefault();
                    if (result.currentPage < result.totalPages) {
                        state.currentPage++;
                        loadUsers();
                    }
                })
        );
        pagination.append(nextLi);
    }

    /**
     * Create page button
     */
    function createPageButton(pageNum, currentPage) {
        var li = $('<li>').addClass('page-item' + (pageNum === currentPage ? ' active' : ''));
        var a = $('<a>')
            .addClass('page-link')
            .attr('href', '#')
            .text(pageNum)
            .on('click', function(e) {
                e.preventDefault();
                state.currentPage = pageNum;
                loadUsers();
            });
        li.append(a);
        return li;
    }

    /**
     * Setup event handlers
     */
    function setupEventHandlers() {
        // Filter buttons
        $('#btnApplyFilter').on('click', handleApplyFilter);
        $('#btnClearFilter').on('click', handleClearFilter);

        // Action buttons
        $('#btnAddNew').on('click', handleAddNew);
        $('#btnRefresh').on('click', handleRefresh);
        $('#btnExport').on('click', handleExport);

        // Modal save buttons
        $('#btnSaveEdit').on('click', handleSaveEdit);
        $('#btnSaveNew').on('click', handleSaveNew);

        // Filter dropdowns - apply on change
        $('#filterStatus, #filterRole').on('change', function() {
            // Auto-apply filter on change (optional)
            // handleApplyFilter();
        });
    }

    /**
     * Handle apply filter
     */
    function handleApplyFilter() {
        state.filters.status = $('#filterStatus').val();
        state.filters.role = $('#filterRole').val();
        state.currentPage = 1; // Reset to first page
        loadUsers();
    }

    /**
     * Handle clear filter
     */
    function handleClearFilter() {
        $('#filterStatus').val('');
        $('#filterRole').val('');
        state.filters = {
            status: '',
            role: ''
        };
        state.currentPage = 1;
        loadUsers();
    }

    /**
     * Handle add new
     */
    function handleAddNew() {
        // Clear form
        $('#addForm')[0].reset();
        state.addModal.show();
    }

    /**
     * Handle refresh
     */
    function handleRefresh() {
        UserService.init().done(function() {
            loadUsers();
            showSuccess('Data refreshed successfully');
        });
    }

    /**
     * Handle export
     */
    function handleExport() {
        var users = UserService.getUsers(state.filters);
        var csv = convertToCSV(users);
        downloadCSV(csv, 'users_export.csv');
        showSuccess('Data exported successfully');
    }

    /**
     * Handle edit user
     */
    function handleEdit(e) {
        var userId = $(e.currentTarget).data('id');
        var user = UserService.getUserById(userId);
        
        if (user) {
            $('#editUserId').val(user.id);
            $('#editName').val(user.name);
            $('#editEmail').val(user.email);
            $('#editRole').val(user.role);
            $('#editDepartment').val(user.department);
            $('#editStatus').val(user.status);
            state.editModal.show();
        }
    }

    /**
     * Handle save edit
     */
    function handleSaveEdit() {
        var userId = parseInt($('#editUserId').val());
        var userData = {
            name: $('#editName').val(),
            email: $('#editEmail').val(),
            role: $('#editRole').val(),
            department: $('#editDepartment').val(),
            status: $('#editStatus').val()
        };

        if (validateUserData(userData)) {
            UserService.updateUser(userId, userData);
            state.editModal.hide();
            loadUsers();
            showSuccess('User updated successfully');
        }
    }

    /**
     * Handle save new user
     */
    function handleSaveNew() {
        var userData = {
            name: $('#addName').val(),
            email: $('#addEmail').val(),
            role: $('#addRole').val(),
            department: $('#addDepartment').val(),
            status: $('#addStatus').val()
        };

        if (validateUserData(userData)) {
            UserService.addUser(userData);
            state.addModal.hide();
            
            // Go to last page to see the new user
            var result = UserService.getUsersPaginated(1, state.pageSize, state.filters);
            state.currentPage = result.totalPages;
            
            loadUsers();
            showSuccess('User added successfully');
        }
    }

    /**
     * Handle delete user
     */
    function handleDelete(e) {
        var userId = $(e.currentTarget).data('id');
        var user = UserService.getUserById(userId);
        
        if (user && confirm('Are you sure you want to delete ' + user.name + '?')) {
            UserService.deleteUser(userId);
            
            // Adjust page if needed
            var result = UserService.getUsersPaginated(state.currentPage, state.pageSize, state.filters);
            if (result.data.length === 0 && state.currentPage > 1) {
                state.currentPage--;
            }
            
            loadUsers();
            showSuccess('User deleted successfully');
        }
    }

    /**
     * Validate user data
     */
    function validateUserData(userData) {
        if (!userData.name || userData.name.trim() === '') {
            showError('Name is required');
            return false;
        }
        if (!userData.email || userData.email.trim() === '') {
            showError('Email is required');
            return false;
        }
        if (!isValidEmail(userData.email)) {
            showError('Please enter a valid email address');
            return false;
        }
        return true;
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Convert array to CSV
     */
    function convertToCSV(data) {
        if (data.length === 0) return '';
        
        var headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status'];
        var rows = data.map(function(user) {
            return [
                user.id,
                '"' + user.name + '"',
                '"' + user.email + '"',
                user.role,
                '"' + user.department + '"',
                user.status
            ].join(',');
        });
        
        return [headers.join(',')].concat(rows).join('\n');
    }

    /**
     * Download CSV file
     */
    function downloadCSV(csv, filename) {
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Get status badge class
     */
    function getStatusClass(status) {
        switch(status) {
            case 'active':
                return 'bg-success';
            case 'inactive':
                return 'bg-secondary';
            case 'pending':
                return 'bg-warning';
            default:
                return 'bg-secondary';
        }
    }

    /**
     * Capitalize first letter
     */
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        // Simple alert - could be replaced with toast/notification library
        alert(message);
    }

    /**
     * Show error message
     */
    function showError(message) {
        alert('Error: ' + message);
    }

    // Initialize when document is ready
    $(document).ready(function() {
        init();
    });

})(jQuery);
