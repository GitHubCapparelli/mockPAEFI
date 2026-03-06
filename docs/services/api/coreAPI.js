// docs/services/api/coreAPI.js
import { Session, CurrentUserKey } from '../storage.js';

// ── Configuração dinâmica da URL da API ──────────────────────────────
const CONFIG_URL = '/mockPAEFI/api.config.json';
let API_BASE     = 'http://localhost:3001';   // fallback local

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

const DATA_ORIGIN = 'RemotePoC';
const NGROK_HDR   = 'ngrok-skip-browser-warning';

export class CoreAPI {
    initialized = true;

    constructor(config) {
        this.user = Session.Get(CurrentUserKey);
        Object.assign(this, config);
    }

    async Init() { return; }

    // ── Headers padrão ────────────────────────────────────────────────
    #headers(extra = {}) {
        return {
            'Content-Type'   : 'application/json',
            'X-User-Id'      : this.user?.id     || '',
            'X-Data-Origin'  : this.user?.origin || DATA_ORIGIN,
            [NGROK_HDR]      : 'true',
            ...extra
        };
    }

    // ── Leitura ───────────────────────────────────────────────────────
    async GetAll() {
        const r    = await fetch(`${API_BASE}/api/${this.entity}?pageSize=9999`,
                         { headers: this.#headers() });
        const json = await r.json();
        return json.data || [];
    }

    async GetPaginated(request = {}) {
        const params = new URLSearchParams({
            page     : request.page     || 1,
            pageSize : request.pageSize || 5,
            ...(request.filters         || {})
        });
        const r = await fetch(`${API_BASE}/api/${this.entity}?${params}`,
                      { headers: this.#headers() });
        if (!r.ok) return this.#errorFromResponse(r);
        return r.json();
    }

    async Navigate(e, page) {
        return this.GetPaginated({ ...this._lastRequest, page });
    }

    async GetById(id) {
        const r    = await fetch(`${API_BASE}/api/${this.entity}/${id}`,
                         { headers: this.#headers() });
        const json = await r.json();
        return json.data ?? null;
    }

    // ── Escrita ───────────────────────────────────────────────────────
    async Create(request) {
        const r = await fetch(`${API_BASE}/api/${this.entity}`, {
            method  : 'POST',
            headers : this.#headers(),
            body    : JSON.stringify(request)
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

    // ── Privado ───────────────────────────────────────────────────────
    async #errorFromResponse(r) {
        try {
            const json = await r.json();
            return { error: json.error || `HTTP ${r.status}` };
        } catch {
            return { error: `HTTP ${r.status}` };
        }
    }
}