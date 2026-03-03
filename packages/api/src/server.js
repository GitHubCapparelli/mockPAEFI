// packages/api/src/server.js
import 'dotenv/config';
import express              from 'express';
import { corsMiddleware }   from './middleware/cors.js';
import { authMiddleware }   from './middleware/auth.js';
import { errorHandler }     from './middleware/errorHandler.js';
import catalogosRoutes      from './routes/catalogos.js';
import historicoRoutes      from './routes/historico.js';
import unidadesRoutes       from './routes/unidades.js';
import usuariosRoutes       from './routes/usuariosServidores.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());

// ── Health check (sem auth) ──────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Rotas protegidas ─────────────────────────────────────────────────
app.use('/api', authMiddleware);
app.use('/api/catalogos', catalogosRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/usuarios-servidores', usuariosRoutes);

// ── Error handler (deve ser o último middleware) ──────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`mockPAEFI-api rodando em http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
});