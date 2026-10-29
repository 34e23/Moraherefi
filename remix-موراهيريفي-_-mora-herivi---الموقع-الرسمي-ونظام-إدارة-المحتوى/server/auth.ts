/**
 * @license
 * Authentication & Authorization Middleware
 */

import type { Request, Response, NextFunction } from 'express';
import { getSession } from './db.js';
import { hasPermission, RateLimiter } from './securityUtils.js';
import type { Session } from '../src/types/index.js';

// Extend Express Request to include session user
declare global {
  namespace Express {
    interface Request {
      user?: Session;
    }
  }
}

export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 mins
export const contactLimiter = new RateLimiter(10, 60 * 1000); // 10 submissions per minute

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Middleware to require valid session and optional specific permission
 */
export function requireAuth(permission?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check cookie first, then Authorization header
    const token =
      req.cookies?.mora_admin_session ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7).trim()
        : null);

    if (!token) {
      res.status(401).json({ error: 'غير مصرح: يرجى تسجيل الدخول أولاً' });
      return;
    }

    const session = getSession(token);
    if (!session) {
      res.status(401).json({ error: 'الجلسة منتهية أو غير صالحة' });
      return;
    }

    // Role check if permission requested
    if (permission && !hasPermission(session.role, permission)) {
      res.status(403).json({ error: 'ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء' });
      return;
    }

    req.user = session;
    next();
  };
}
