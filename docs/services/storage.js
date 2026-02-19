export const CurrentUserKey   = 'currentUser';
export const PreferencesKey   = 'preferences';
export const LastModuleKey    = 'lastModule';

//export const LastDomainKey    = 'lastDomain';

export const LastAtenderDomainKey  = 'lastAtenderDomain';
export const LastMonitorDomainKey  = 'lastMonitorDomain';
export const LastAdminDomainKey    = 'lastAdminDomain';

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

/* ---------- Registry ---------- */
export class Registry {
    static #apis = new Map();
    static async API(x) {
        if (!this.#apis.has(x)) {
            const instance = await x.CreateInstance();
            this.#apis.set(x, instance);
        }
        return this.#apis.get(x);
    }
}