/**
 * @license
 * Mora Herivi Full-Stack Express & Vite Server
 */

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import publicRoutes from './server/routes/public.js';
import adminRoutes from './server/routes/admin.js';
import { getDb } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Initialize DB on startup
  getDb();

  // Security headers & basic hardening
  app.disable('x-powered-by');
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Body and cookie parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  // Static files from public folder and image assets
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));
  app.use('/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));

  // API Routes
  app.use('/api/public', publicRoutes);
  app.use('/api/admin', adminRoutes);

  // Development: Mount Vite middlewares for instant SPA development
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production: Serve pre-built assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Global safe error handler - Never leak stack traces to client
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err?.message || err);
    res.status(500).json({
      error: 'حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقاً.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Mora Herivi Server running at http://0.0.0.0:${PORT} [${isProduction ? 'Production' : 'Development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
