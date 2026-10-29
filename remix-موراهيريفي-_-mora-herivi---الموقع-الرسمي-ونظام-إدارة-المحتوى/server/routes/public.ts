/**
 * @license
 * Public API Routes for Mora Herivi Website
 * No visitor authentication required. Read-only access to published content.
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { getDb, saveDb } from '../db.js';
import { contactLimiter, getClientIp } from '../auth.js';
import { sanitizeInput, isValidEmail } from '../securityUtils.js';
import crypto from 'crypto';

const router = Router();

/**
 * GET /api/public/content
 * Returns only published, public content.
 */
router.get('/content', (_req: Request, res: Response) => {
  const db = getDb();

  // Filter only published ingredients, sorted by order
  const publishedIngredients = db.ingredients
    .filter((ing) => ing.isPublished)
    .sort((a, b) => a.order - b.order);

  // Filter only published pages
  const publishedPages = db.pages
    .filter((page) => page.isPublished)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      titleAr: p.titleAr,
      titleEn: p.titleEn,
      contentAr: p.contentAr,
      contentEn: p.contentEn,
      order: p.order,
      updatedAt: p.updatedAt,
    }));

  // Filter only published articles
  const publishedArticles = db.articles
    .filter((art) => art.isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Public settings (strictly exclude internal admin information)
  const publicSettings = {
    siteNameAr: db.settings.siteNameAr,
    siteNameEn: db.settings.siteNameEn,
    officialPhone: db.settings.officialPhone,
    officialEmail: db.settings.officialEmail,
    officialAddressAr: db.settings.officialAddressAr,
    whatsappNumber: db.settings.whatsappNumber,
    socialLinks: db.settings.socialLinks,
    copyrightYear: db.settings.copyrightYear,
    brandOwnerAr: db.settings.brandOwnerAr,
    manufacturerOrDistributorAr: db.settings.manufacturerOrDistributorAr,
    distributorRelationship: db.settings.distributorRelationship,
    maintenanceMode: db.settings.maintenanceMode,
  };

  // Filter only published gallery items
  const publishedGallery = (db.gallery || [])
    .filter((g) => g.isPublished)
    .sort((a, b) => a.order - b.order);

  res.json({
    product: db.product,
    ingredients: publishedIngredients,
    gallery: publishedGallery,
    pages: publishedPages,
    articles: publishedArticles,
    settings: publicSettings,
  });
});

/**
 * POST /api/public/contact
 * Handles contact inquiry submissions with server-side validation and anti-spam protection
 */
router.post('/contact', (req: Request, res: Response) => {
  const ip = getClientIp(req);

  // Check rate limit
  if (!contactLimiter.isAllowed(ip)) {
    res.status(429).json({
      error: 'لقد تم إرسال عدد كبير من الرسائل من هذا الاتصال. يرجى الانتظار دقيقة قبل المحاولة مجدداً.',
    });
    return;
  }

  const { fullName, email, phone, subject, message, website_fax_honey } = req.body || {};

  // Anti-spam honeypot detection: if filled, quietly succeed without storing
  if (website_fax_honey && typeof website_fax_honey === 'string' && website_fax_honey.trim() !== '') {
    res.json({
      success: true,
      message: 'تم استلام استفساركم بنجاح وسيتواصل معكم فريقنا الرسمي قريباً.',
    });
    return;
  }

  // Server-side validation
  const cleanName = sanitizeInput(fullName || '');
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = sanitizeInput(phone || '');
  const cleanSubject = sanitizeInput(subject || 'استفسار عام حول منتج موراهيريفي');
  const cleanMessage = sanitizeInput(message || '');

  if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
    res.status(400).json({ error: 'يرجى إدخال اسم صحيح يتكون من حرفين إلى 100 حرف.' });
    return;
  }

  if (!cleanPhone || cleanPhone.length < 6) {
    res.status(400).json({ error: 'يرجى إدخال رقم هاتف صحيح للتواصل هاتفياً.' });
    return;
  }

  if (cleanEmail && !isValidEmail(cleanEmail)) {
    res.status(400).json({ error: 'يرجى إدخال عنوان بريد إلكتروني صالح.' });
    return;
  }

  if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 3000) {
    res.status(400).json({ error: 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل وبحد أقصى 3000 حرف.' });
    return;
  }

  // Record contact message in persistent database
  const db = getDb();
  const newMessage = {
    id: crypto.randomUUID(),
    fullName: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    subject: cleanSubject,
    message: cleanMessage,
    status: 'new' as const,
    createdAt: new Date().toISOString(),
    ipAddress: ip,
  };

  db.contactMessages.unshift(newMessage);
  saveDb();

  contactLimiter.recordFailure(ip); // Consume rate limit budget

  res.json({
    success: true,
    message: 'شكراً لتواصلكم. تم استلام استفساركم بنجاح وسيقوم الفريق الطبي أو الإداري بالرد عليكم قريباً.',
  });
});

/**
 * GET /api/public/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    product: 'Moraherefi (موراهيريفي)',
  });
});

export default router;
