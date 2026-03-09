// docs/services/api/coreAPI.js
import { Session, CurrentUserKey } from '../storage.js';

const CONFIG_URL  = '/mockPAEFI/api.config.json';
const DATA_ORIGIN = 'RemotePoC';
const NGROK_HDR   = 'ngrok-skip-browser-warning';

let API_BASE = 'http://localhost:3001';

async function loadConfig() {
    try {
        const r = await fetch(CONFIG_URL);
        if (!r.ok) return;
        const config = await r.json();
        if (config.apiBase) API_BASE = config.apiBase;
    } catch {
        console.warn('[coreAPI] api.config.json não encontrado — usando localhost');
    }
}
await loadConfig();

export class CoreAPI {

    initialized = true;

    constructor(config) {
        this.user = Session.Get(CurrentUserKey);
        Object.assign(this, config);
    }

    async Init() { return; }

    // ── Headers ───────────────────────────────────────────────────────────────
    #headers(extra = {}) {
        const user    = Session.Get(CurrentUserKey);
        const headers = {
            'Content-Type'              : 'application/json',
            'X-User-Id'                 : user?.id          || '',
            'X-Data-Origin'             : user?.origin      || DATA_ORIGIN, 
            [NGROK_HDR]                 : 'true',
            ...extra
        };
        // Acrescentar JWT se disponível
        const token = user?.token;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    // ── Envelope de request (command) ─────────────────────────────────────────
    #body(payload, tipo = 'Backend') {
        const user = Session.Get(CurrentUserKey);
        return {
            metadata: {
                tipo,
                catalogoID: user?.catalogoID || undefined
            },
            payload
        };
    }

    // ── Queries ───────────────────────────────────────────────────────────────
    async GetAll() {
        const r    = await fetch(
            `${API_BASE}/api/${this.entity}?pageSize=9999`,
            { headers: this.#headers() }
        );
        const json = await r.json();
        return json.data || [];
    }

    async GetPaginated(request = {}) {
        const params = new URLSearchParams({
            page    : request.page     || 1,
            pageSize: request.pageSize || 5,
            ...(request.filters || {})
        });
        const r = await fetch(
            `${API_BASE}/api/${this.entity}?${params}`,
            { headers: this.#headers() }
        );
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async GetById(id) {
        const r    = await fetch(
            `${API_BASE}/api/${this.entity}/${id}`,
            { headers: this.#headers() }
        );
        const json = await r.json();
        return json.data ?? null;
    }

    // ── Commands ──────────────────────────────────────────────────────────────
    async Create(payload) {
        const r = await fetch(
            `${API_BASE}/api/${this.entity}`,
            { method: 'POST', headers: this.#headers(), body: JSON.stringify(this.#body(payload)) }
        );
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async Update(payload) {
        const id = payload?.id;
        const r  = await fetch(
            `${API_BASE}/api/${this.entity}/${id}`,
            { method: 'PUT', headers: this.#headers(), body: JSON.stringify(this.#body(payload)) }
        );
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async Delete(payload) {
        const id = payload?.id;
        const r  = await fetch(
            `${API_BASE}/api/${this.entity}/${id}`,
            { method: 'DELETE', headers: this.#headers(), body: JSON.stringify(this.#body(payload)) }
        );
        if (r.status === 204) return true;
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    async #errorFromResponse(r) {
        try {
            const json = await r.json();
            return { error: json.error || `HTTP ${r.status}` };
        } catch {
            return { error: `HTTP ${r.status}` };
        }
    }
}