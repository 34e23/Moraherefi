/**
 * Unit Tests for Security & Validation
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPassword,
  verifyPassword,
  RateLimiter,
  hasPermission,
  sanitizeInput,
  isValidEmail,
  generateSlug,
} from '../server/securityUtils.js';

test('Password hashing creates unique salt and verifiable hash', () => {
  const password = 'SuperSecurePassword123!#';
  const { hash, salt } = hashPassword(password);

  assert.ok(hash.length > 32);
  assert.ok(salt.length > 16);

  // Correct password verifies
  assert.equal(verifyPassword(password, hash, salt), true);

  // Incorrect password fails
  assert.equal(verifyPassword('WrongPassword!', hash, salt), false);
  assert.equal(verifyPassword('', hash, salt), false);
});

test('RateLimiter locks after max attempts and unlocks on reset', () => {
  const limiter = new RateLimiter(3, 1000); // 3 attempts, 1 sec lockout
  const key = 'test-ip-127.0.0.1';

  assert.equal(limiter.isAllowed(key), true);

  limiter.recordFailure(key);
  assert.equal(limiter.isAllowed(key), true);

  limiter.recordFailure(key);
  assert.equal(limiter.isAllowed(key), true);

  const res3 = limiter.recordFailure(key);
  assert.equal(res3.locked, true);
  assert.equal(res3.remaining, 0);

  // Now locked
  assert.equal(limiter.isAllowed(key), false);

  // Reset unlocks immediately
  limiter.reset(key);
  assert.equal(limiter.isAllowed(key), true);
});

test('Role-Based Access Control enforces strict privilege tiers', () => {
  // Super admin has full control
  assert.equal(hasPermission('super_admin', 'manage_users'), true);
  assert.equal(hasPermission('super_admin', 'manage_backups'), true);
  assert.equal(hasPermission('super_admin', 'edit_product'), true);

  // Content admin can manage content but NOT users or backups
  assert.equal(hasPermission('content_admin', 'edit_product'), true);
  assert.equal(hasPermission('content_admin', 'manage_pages'), true);
  assert.equal(hasPermission('content_admin', 'manage_users'), false);
  assert.equal(hasPermission('content_admin', 'manage_backups'), false);

  // Read-only admin can only view dashboard and audit logs
  assert.equal(hasPermission('read_only_admin', 'view_dashboard'), true);
  assert.equal(hasPermission('read_only_admin', 'view_audit_logs'), true);
  assert.equal(hasPermission('read_only_admin', 'edit_product'), false);
  assert.equal(hasPermission('read_only_admin', 'delete_content'), false);

  // Undefined or unknown role has no permission
  assert.equal(hasPermission(undefined, 'view_dashboard'), false);
});

test('Input sanitization strips malicious script and iframe injections', () => {
  const malicious = 'Hello <script>alert("hack")</script> World <iframe src="evil.com"></iframe>';
  const clean = sanitizeInput(malicious);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('<iframe>'), false);
  assert.equal(clean.includes('Hello'), true);
  assert.equal(clean.includes('World'), true);
});

test('Email validation checks valid formats', () => {
  assert.equal(isValidEmail('info@moraherivi.com'), true);
  assert.equal(isValidEmail('patient.care@domain.med.sa'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail('@domain.com'), false);
  assert.equal(isValidEmail(''), false);
});

test('Slug generator formats Arabic and English text reliably', () => {
  assert.equal(generateSlug('شراب موراهيريفي العشبي'), 'شراب-موراهيريفي-العشبي');
  assert.equal(generateSlug('Ivy Leaf Extract 120ml'), 'ivy-leaf-extract-120ml');
});
