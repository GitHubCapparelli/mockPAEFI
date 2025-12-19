export const LocalStore = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

export const SessionStore = {
    set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },

    remove(key) {
        sessionStorage.removeItem(key);
    },

    clear() {
        sessionStorage.clear();
    }
};

