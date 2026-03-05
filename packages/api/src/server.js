// packages/api/src/server.js
import 'dotenv/config';
import express                          from 'express';
import { CorsMiddleware }               from './middleware/CorsMiddleware.js';
import { OriginMiddleware }             from './middleware/OriginMiddleware.js';
import { AuthMiddleware }               from './middleware/AuthMiddleware.js';
import { ErrorHandler }                 from './middleware/ErrorHandler.js';
import { CatalogosService }             from './services/catalogos.js';
import { HistoricoService }             from './services/historico.js';
import { UnidadesService }              from './services/unidades.js';
import { UsuariosServidoresService }    from './services/usuariosServidores.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ─────────────────────────────────────────────────
app.use(CorsMiddleware.handle);
app.use(express.json());
app.use(OriginMiddleware.handle);          // resolve X-Data-Origin antes da auth

// ── Health check (sem autenticação) ──────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', ts: new Date().toISOString(), port: PORT });
});

// ── Rotas protegidas ──────────────────────────────────────────────────
app.use('/api', AuthMiddleware.handle);
app.use('/api/catalogos', CatalogosService.router());
app.use('/api/historico', HistoricoService.router());
app.use('/api/unidades', UnidadesService.router());
app.use('/api/usuarios-servidores', UsuariosServidoresService.router());

// ── Error handler (último middleware) ────────────────────────────────
app.use(ErrorHandler.handle);

app.listen(PORT, () => {
    console.log(`mockPAEFI-api  →  http://localhost:${PORT}`);
    console.log(`Health check   →  http://localhost:${PORT}/health`);
});