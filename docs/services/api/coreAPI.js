// docs/services/api/coreAPI.js
import { Session, CurrentUserKey } from '../storage.js';

const DATA_ORIGIN = 'RemotePoC';               // ← enum DataOrigin.RemotePoC.Key
const CONFIG_URL  = '/mockPAEFI/api.config.json';
let API_BASE      = 'http://localhost:3001';   // fallback local

async function loadConfig() {
    try {
        const r = await fetch(CONFIG_URL, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const config = await r.json();
        if (config.apiBase) API_BASE = config.apiBase;
    } catch {
        console.warn('api.config.json não encontrado — usando localhost');
    }    
}
await loadConfig();

export class CoreAPI {
    initialized = true;                        // no REST mode, always ready

    constructor(config) {
        this.user = Session.Get(CurrentUserKey);
        Object.assign(this, config);
    }

    // No-op: dados não são mais carregados em memória
    async Init() { return; }

    // ── Headers padrão ─────────────────────────────────────────────────
    #headers(extra = {}) {
        return {
            'Content-Type'  : 'application/json',
            'X-User-Id'     : this.user?.id     || '',
            'X-Data-Origin' : this.user?.origin || DATA_ORIGIN,
            ...extra
        };
    }

    // ── Leitura ────────────────────────────────────────────────────────
    async GetAll() {
        const r = await fetch(`${API_BASE}/api/${this.entity}?pageSize=9999`, { headers: this.#headers() });
        const json = await r.json();
        return json.data || [];
    }

    async GetPaginated(request = {}) {
        const params = new URLSearchParams({
            page     : request.page     || 1,
            pageSize : request.pageSize || 5,
            ...(request.filters         || {})
        });
        const r = await fetch(`${API_BASE}/api/${this.entity}?${params}`, { headers: this.#headers() });
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();   // → { data: [], pagination: {...} }
    }

    async Navigate(e, page) {
        return this.GetPaginated({ ...this._lastRequest, page });
    }

    async GetById(id) {
        const r    = await fetch(`${API_BASE}/api/${this.entity}/${id}`, { headers: this.#headers() });
        const json = await r.json();
        return json.data ?? null;
    }

    // ── Escrita ────────────────────────────────────────────────────────
    async Create(request) {
        const r = await fetch(`${API_BASE}/api/${this.entity}`, {
            method  : 'POST',
            headers : this.#headers(),
            body    : JSON.stringify(request)   // { metadata, payload }
        });
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async Update(request) {
        const id = request.payload?.id;
        const r  = await fetch(`${API_BASE}/api/${this.entity}/${id}`, {
            method  : 'PUT',
            headers : this.#headers(),
            body    : JSON.stringify(request)
        });
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async Delete(request) {
        const id = request.payload?.data?.id || request.payload?.id;
        const r  = await fetch(`${API_BASE}/api/${this.entity}/${id}`, {
            method  : 'DELETE',
            headers : this.#headers(),
            body    : JSON.stringify(request)
        });
        if (r.status === 204) return true;
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    // ── Privado ────────────────────────────────────────────────────────
    async #errorFromResponse(r) {
        try {
            const json = await r.json();
            return { error: json.error || `HTTP ${r.status}` };
        } catch {
            return { error: `HTTP ${r.status}` };
        }
    }
}