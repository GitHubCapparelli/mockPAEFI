export const CurrentUserKey = 'currentUser';

/* ---------- Persistent Adapters ---------- */
export const Local = {
    Set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    Get(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },
    Remove(key) {
        localStorage.removeItem(key);
    },
    Clear() {
        localStorage.clear();
    }
};

export const Session = {
    Set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    Get(key) {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },
    Remove(key) {
        sessionStorage.removeItem(key);
    },
    Clear() {
        sessionStorage.clear();
    }
};

/* ---------- Volatile Adapter (API PoC) ---------- */
export let store = {};   

export const InMemory = {
    InitStore(initialData) {
        store = structuredClone(initialData);
    },

    GetAll(entity) {
        return structuredClone(store[entity] ?? []);
    },

    SetAll(entity, data) {
        store[entity] = structuredClone(data);
    }
};
