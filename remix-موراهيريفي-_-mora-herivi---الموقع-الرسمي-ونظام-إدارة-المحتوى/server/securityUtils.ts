/**
 * @license
 * Security & Validation Utilities for Mora Herivi
 */

import crypto from 'crypto';
import type { UserRole } from '../src/types/index.js';

export interface HashResult {
  hash: string;
  salt: string;
}

/**
 * Hash a password using scrypt with random cryptographic salt
 */
export function hashPassword(password: string, providedSalt?: string): HashResult {
  const salt = providedSalt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt,
  };
}

/**
 * Timing-safe password verification
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const hashBuffer = Buffer.from(hash, 'hex');
    if (hashBuffer.length !== derivedKey.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Memory-based Rate Limiter for Brute-force & Anti-Spam protection
 */
export class RateLimiter {
  private attempts = new Map<string, { count: number; lockedUntil: number }>();
  private readonly maxAttempts: number;
  private readonly lockoutMs: number;

  constructor(maxAttempts = 5, lockoutMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.lockoutMs = lockoutMs;
  }

  /**
   * Returns true if key is allowed, false if locked
   */
  isAllowed(key: string): boolean {
    const record = this.attempts.get(key);
    if (!record) return true;

    const now = Date.now();
    if (record.lockedUntil > 0) {
      if (now > record.lockedUntil) {
        // Lock expired
        this.attempts.delete(key);
        return true;
      }
      return false; // Still locked
    }

    return record.count < this.maxAttempts;
  }

  /**
   * Record a failed attempt
   */
  recordFailure(key: string): { remaining: number; locked: boolean } {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, lockedUntil: 0 };

    if (record.lockedUntil > 0 && now > record.lockedUntil) {
      record.count = 1;
      record.lockedUntil = 0;
    } else {
      record.count += 1;
    }

    if (record.count >= this.maxAttempts) {
      record.lockedUntil = now + this.lockoutMs;
    }

    this.attempts.set(key, record);

    const locked = record.count >= this.maxAttempts;
    const remaining = Math.max(0, this.maxAttempts - record.count);
    return { remaining, locked };
  }

  /**
   * Reset attempts on successful action
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clean up expired entries periodically
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.lockedUntil && record.count >= this.maxAttempts) {
        this.attempts.delete(key);
      }
    }
  }
}

/**
 * Role-Based Access Control matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'view_dashboard',
    'edit_product',
    'manage_ingredients',
    'manage_pages',
    'manage_articles',
    'manage_contacts',
    'manage_users',
    'manage_settings',
    'view_audit_logs',
    'manage_backups',
    'delete_content',
  ],
  content_admin: [
    'view_dashboard',
    'edit_product',
    'manage_ingredients',
    'manage_pages',
    'manage_articles',
    'manage_contacts',
    'delete_content',
  ],
  read_only_admin: [
    'view_dashboard',
    'view_audit_logs',
  ],
};

export function hasPermission(role: UserRole | undefined, requiredPermission: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(requiredPermission);
}

/**
 * Input sanitization to strip dangerous HTML and scripts
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .trim();
}

/**
 * Email format validator
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Arabic & English friendly URL slug generator
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\u0621-\u064A\w\-]/g, '')
    .replace(/^-+|-+$/g, '');
}
