var UserService = (function() {
    'use strict';

    // Simulated in-memory data store
    var users = [];
    var currentUser = null;
    var nextId = 1;

    /**
     * Initialize service by loading data from JSON files
     */
    function init() {
//        return $.when(
//            loadUsers(),
//            loadCurrentUser()
//        );
        return $.when(
            loadUsers()
        );
    }

    /**
     * Load users from JSON file
     */
    function loadUsers() {
        return $.ajax({
            url: '/mockPAEFI/data/mock/users.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                users = data.users || [];
                // Calculate next ID
                if (users.length > 0) {
                    nextId = Math.max.apply(Math, users.map(function(u) { return u.id; })) + 1;
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading users:', error);
                users = [];
            }
        });
    }

    /**
     * Load current user from JSON file
     */
    function loadCurrentUser() {
        return $.ajax({
            url: '/mockPAEFI/data/currentUser.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                currentUser = data;
            },
            error: function(xhr, status, error) {
                console.error('Error loading current user:', error);
                currentUser = {
                    name: 'Guest User',
                    department: 'N/A',
                    role: 'Guest'
                };
            }
        });
    }

    /**
     * Get current logged-in user
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Get all users with optional filtering
     */
    function getUsers(filters) {
        var filteredUsers = users.slice(); // Create a copy

        if (filters) {
            if (filters.status && filters.status !== '') {
                filteredUsers = filteredUsers.filter(function(user) {
                    return user.status === filters.status;
                });
            }

            if (filters.role && filters.role !== '') {
                filteredUsers = filteredUsers.filter(function(user) {
                    return user.role === filters.role;
                });
            }

            if (filters.search && filters.search !== '') {
                var searchLower = filters.search.toLowerCase();
                filteredUsers = filteredUsers.filter(function(user) {
                    return user.name.toLowerCase().indexOf(searchLower) !== -1 ||
                           user.email.toLowerCase().indexOf(searchLower) !== -1 ||
                           user.department.toLowerCase().indexOf(searchLower) !== -1;
                });
            }
        }

        return filteredUsers;
    }

    /**
     * Get paginated users
     */
    function getUsersPaginated(page, pageSize, filters) {
        var allUsers = getUsers(filters);
        var totalRecords = allUsers.length;
        var totalPages = Math.ceil(totalRecords / pageSize);
        
        // Ensure page is within bounds
        page = Math.max(1, Math.min(page, totalPages || 1));
        
        var startIndex = (page - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        var paginatedUsers = allUsers.slice(startIndex, endIndex);

        return {
            data: paginatedUsers,
            currentPage: page,
            pageSize: pageSize,
            totalRecords: totalRecords,
            totalPages: totalPages,
            startRecord: totalRecords > 0 ? startIndex + 1 : 0,
            endRecord: Math.min(endIndex, totalRecords)
        };
    }

    /**
     * Get user by ID
     */
    function getUserById(id) {
        return users.find(function(user) {
            return user.id === id;
        });
    }

    /**
     * Add new user
     */
    function addUser(userData) {
        var newUser = {
            id: nextId++,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department,
            status: userData.status
        };
        users.push(newUser);
        return newUser;
    }

    /**
     * Update existing user
     */
    function updateUser(id, userData) {
        var userIndex = users.findIndex(function(user) {
            return user.id === id;
        });

        if (userIndex !== -1) {
            users[userIndex] = {
                id: id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                department: userData.department,
                status: userData.status
            };
            return users[userIndex];
        }
        return null;
    }

    /**
     * Delete user
     */
    function deleteUser(id) {
        var userIndex = users.findIndex(function(user) {
            return user.id === id;
        });

        if (userIndex !== -1) {
            var deletedUser = users.splice(userIndex, 1)[0];
            return deletedUser;
        }
        return null;
    }

    // Public API
    return {
        init: init,
        getCurrentUser: getCurrentUser,
        getUsers: getUsers,
        getUsersPaginated: getUsersPaginated,
        getUserById: getUserById,
        addUser: addUser,
        updateUser: updateUser,
        deleteUser: deleteUser
    };

})();
