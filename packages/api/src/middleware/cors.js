// packages/api/src/middleware/cors.js
import corsLib from 'cors';

const ALLOWED_ORIGINS = [
    process.env.ALLOWED_ORIGIN,    // GitHub Pages (produção do PoC)
    'http://localhost:5500',       // Live Server do VS Code
    'http://127.0.0.1:5500',
    'http://localhost:3000'        // caso sirva a UI localmente
].filter(Boolean);

export const corsMiddleware = corsLib({
    origin(origin, callback) {
        // Permite requests sem origin (Postman, curl, Thunder Client)
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS bloqueado para origem: ${origin}`));
        }
    },
    methods          : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders   : ['Content-Type', 'X-User-Id', 'X-Data-Origin'],
    exposedHeaders   : ['X-Total-Count'],
    credentials      : false,   // sem cookies neste PoC
    optionsSuccessStatus: 204
});