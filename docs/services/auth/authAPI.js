// docs/services/auth/authAPI.js
import { Session, CurrentUserKey } from '../storage.js';

const CONFIG_URL = '/mockPAEFI/api.config.json';
const NGROK_HDR  = 'ngrok-skip-browser-warning';

let API_BASE = 'http://localhost:3001';

async function loadConfig() {
    try {
        const r = await fetch(CONFIG_URL);
        if (!r.ok) return;
        const config = await r.json();
        if (config.apiBase) API_BASE = config.apiBase;
    } catch {
        console.warn('[authAPI] api.config.json não encontrado — usando localhost');
    }
}
await loadConfig();

export class AuthAPI {

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    static async login(id) {
        try {
            const r = await fetch(`${API_BASE}/api/auth/login`, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [NGROK_HDR]   : 'true'
                },
                body: JSON.stringify({ id })
            });

            const json = await r.json();

            if (!r.ok || json.error) {
                return { ok: false, error: json.error || `HTTP ${r.status}` };
            }

            const usuarioConectado = {
                ...json.data,
                token : json.token,
                origin: 'RemotePoC'
            };
            Session.Set(CurrentUserKey, usuarioConectado);

            return { ok: true, data: usuarioConectado };

        } catch (e) {
            console.error('[AuthAPI] login error:', e.message);
            return { ok: false, error: 'Falha de conexão com a API.' };
        }
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────
    static async logout() {
        try {
            const user = Session.Get(CurrentUserKey);
            if (user?.token) {
                await fetch(`${API_BASE}/api/auth/logout`, {
                    method : 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                        [NGROK_HDR]    : 'true'
                    }
                });
            }
        } catch (e) {
            console.warn('[AuthAPI] logout error:', e.message);
        } finally {
            Session.Remove(CurrentUserKey);
        }
    }

    // ── Usuário conectado atual ───────────────────────────────────────────────
    static current() {
        return Session.Get(CurrentUserKey);
    }

    static isAuthenticated() {
        return !!AuthAPI.current()?.token;
    }
}