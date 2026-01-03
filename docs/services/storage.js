export const CurrentUserKey         = 'currentUser';
export const UserPreferencesKey     = 'userPreferences';
export const LastAdminDomainKey     = 'lastAdminDomain';
export const LastMonitorDomainKey   = 'lastMonitorDomain';
export const LastAtenderDomainKey   = 'lastAtenderDomain';

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
const store = {};

export const InMemory = {
  InitStore(data) {
    Object.assign(store, data);
  },

  GetAll(entity) {
    return store[entity] ?? [];
  },

  SetAll(entity, data) {
    store[entity] = data;
  }
};
