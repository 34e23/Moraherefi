/**
 * @license
 * Protected Admin API Routes for Mora Herivi CMS
 * Strict server-side authentication and role-based authorization enforced.
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import {
  getDb,
  saveDb,
  addAuditLog,
  createSession,
  deleteSession,
  exportBackup,
  restoreBackup,
} from '../db.js';
import { requireAuth, loginLimiter, getClientIp } from '../auth.js';
import {
  hashPassword,
  verifyPassword,
  sanitizeInput,
  isValidEmail,
  generateSlug,
} from '../securityUtils.js';
import type { UserRole, Ingredient, GalleryItem, ContentPage, Article, UserCredentials } from '../../src/types/index.js';

const router = Router();

/**
 * GET /api/admin/setup-status
 * Checks if the system requires initial administrator initialization
 */
router.get('/setup-status', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({
    initialized: db.users.length > 0,
    userCount: db.users.length,
  });
});

/**
 * POST /api/admin/setup
 * Allowed ONLY when no administrators exist in the database.
 */
router.post('/setup', (req: Request, res: Response) => {
  const db = getDb();
  const ip = getClientIp(req);

  if (db.users.length > 0) {
    res.status(403).json({ error: 'تم إعداد النظام مسبقاً. تم تعطيل التهيئة الأولية لأسباب أمنية.' });
    return;
  }

  const { username, password, fullName, email } = req.body || {};

  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanFullName = sanitizeInput(fullName || 'المشرف الرئيسي');
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 32 || !/^[a-z0-9_-]+$/.test(cleanUsername)) {
    res.status(400).json({ error: 'يجب أن يكون اسم المستخدم بين 3 إلى 32 حرفاً ويحتوي فقط على أحرف إنجليزية وأرقام ورموز (- _).' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'كلمة المرور يجب ألا تقل عن 8 خانات.' });
    return;
  }

  if (cleanEmail && !isValidEmail(cleanEmail)) {
    res.status(400).json({ error: 'البريد الإلكتروني غير صالح.' });
    return;
  }

  const { hash, salt } = hashPassword(password);
  const newAdmin: UserCredentials = {
    id: crypto.randomUUID(),
    username: cleanUsername,
    fullName: cleanFullName,
    role: 'super_admin',
    email: cleanEmail || 'admin@moraherivi.com',
    createdAt: new Date().toISOString(),
    isActive: true,
    passwordHash: hash,
    salt,
  };

  db.users.push(newAdmin);
  saveDb();

  addAuditLog({
    username: cleanUsername,
    action: 'INITIAL_ADMIN_CREATED',
    details: `Initial Super Administrator account "${cleanUsername}" successfully configured.`,
    ipAddress: ip,
    status: 'success',
  });

  // Automatically log in the created administrator
  const token = createSession(
    newAdmin.id,
    newAdmin.username,
    newAdmin.role,
    ip,
    req.headers['user-agent'] || 'Unknown'
  );

  res.cookie('mora_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      id: newAdmin.id,
      username: newAdmin.username,
      fullName: newAdmin.fullName,
      role: newAdmin.role,
      email: newAdmin.email,
    },
  });
});

/**
 * POST /api/admin/login
 * Authenticate administrator with rate-limiting and audit logging
 */
router.post('/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { username, password } = req.body || {};

  const cleanUsername = (username || '').trim().toLowerCase();

  // Rate limiting check
  const rateLimitKey = `${ip}:${cleanUsername}`;
  if (!loginLimiter.isAllowed(rateLimitKey)) {
    addAuditLog({
      username: cleanUsername || 'unknown',
      action: 'LOGIN_RATE_LIMITED',
      details: 'Too many consecutive failed login attempts. Account temporarily locked.',
      ipAddress: ip,
      status: 'warning',
    });
    res.status(429).json({
      error: 'تم تجاوز عدد محاولات الدخول المسموح بها. تم قفل المحاولة مؤقتاً لمدة 15 دقيقة لحماية الحساب.',
    });
    return;
  }

  const db = getDb();
  const user = db.users.find((u) => u.username === cleanUsername);

  // Generic failure for security (do not reveal if user exists)
  if (!user || !user.isActive) {
    loginLimiter.recordFailure(rateLimitKey);
    addAuditLog({
      username: cleanUsername || 'unknown',
      action: 'LOGIN_FAILED',
      details: 'Authentication failure: user not found or inactive.',
      ipAddress: ip,
      status: 'failure',
    });
    res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    return;
  }

  const isValid = verifyPassword(password || '', user.passwordHash, user.salt);
  if (!isValid) {
    const { remaining } = loginLimiter.recordFailure(rateLimitKey);
    addAuditLog({
      userId: user.id,
      username: user.username,
      role: user.role,
      action: 'LOGIN_FAILED',
      details: `Authentication failure: incorrect password. Remaining attempts: ${remaining}`,
      ipAddress: ip,
      status: 'failure',
    });
    res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    return;
  }

  // Login successful
  loginLimiter.reset(rateLimitKey);
  user.lastLoginAt = new Date().toISOString();
  saveDb();

  const token = createSession(
    user.id,
    user.username,
    user.role,
    ip,
    req.headers['user-agent'] || 'Unknown'
  );

  addAuditLog({
    userId: user.id,
    username: user.username,
    role: user.role,
    action: 'LOGIN_SUCCESS',
    details: 'User authenticated successfully and session established.',
    ipAddress: ip,
    status: 'success',
  });

  res.cookie('mora_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
    },
  });
});

/**
 * POST /api/admin/logout
 */
router.post('/logout', requireAuth(), (req: Request, res: Response) => {
  const token =
    req.cookies?.mora_admin_session ||
    req.headers.authorization?.slice(7).trim();

  if (token) {
    deleteSession(token);
  }

  res.clearCookie('mora_admin_session');

  if (req.user) {
    addAuditLog({
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      action: 'LOGOUT',
      details: 'User logged out and session terminated.',
      ipAddress: getClientIp(req),
      status: 'success',
    });
  }

  res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
});

/**
 * GET /api/admin/me
 */
router.get('/me', requireAuth(), (req: Request, res: Response) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === req.user?.userId);

  if (!user) {
    res.status(404).json({ error: 'المستخدم غير موجود' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      lastLoginAt: user.lastLoginAt,
    },
  });
});

/**
 * GET /api/admin/overview
 * Dashboard summary statistics
 */
router.get('/overview', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();

  const totalIngredients = db.ingredients.length;
  const publishedIngredients = db.ingredients.filter((i) => i.isPublished).length;
  const totalPages = db.pages.length;
  const publishedPages = db.pages.filter((p) => p.isPublished).length;
  const totalArticles = db.articles.length;
  const publishedArticles = db.articles.filter((a) => a.isPublished).length;
  const newMessages = db.contactMessages.filter((m) => m.status === 'new').length;
  const totalMessages = db.contactMessages.length;
  const totalUsers = db.users.length;

  res.json({
    stats: {
      totalIngredients,
      publishedIngredients,
      totalPages,
      publishedPages,
      totalArticles,
      publishedArticles,
      newMessages,
      totalMessages,
      totalUsers,
      isLabelVerified: db.product.isLabelVerified,
      productLastUpdated: db.product.updatedAt,
    },
    recentLogs: db.auditLogs.slice(0, 10),
    productSummary: {
      brandNameAr: db.product.brandNameAr,
      brandNameEn: db.product.brandNameEn,
      volume: db.product.volume,
      flavorAr: db.product.flavorAr,
      isLabelVerified: db.product.isLabelVerified,
    },
  });
});

/* ==========================================
   PRODUCT INFORMATION ENDPOINTS
   ========================================== */

router.get('/product', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.product);
});

router.put('/product', requireAuth('edit_product'), (req: Request, res: Response) => {
  const db = getDb();
  const updates = req.body || {};

  db.product = {
    ...db.product,
    brandNameAr: updates.brandNameAr ? sanitizeInput(updates.brandNameAr) : db.product.brandNameAr,
    brandNameEn: updates.brandNameEn ? sanitizeInput(updates.brandNameEn) : db.product.brandNameEn,
    taglineAr: updates.taglineAr ? sanitizeInput(updates.taglineAr) : db.product.taglineAr,
    taglineEn: updates.taglineEn ? sanitizeInput(updates.taglineEn) : db.product.taglineEn,
    categoryAr: updates.categoryAr ? sanitizeInput(updates.categoryAr) : db.product.categoryAr,
    categoryEn: updates.categoryEn ? sanitizeInput(updates.categoryEn) : db.product.categoryEn,
    volume: updates.volume ? sanitizeInput(updates.volume) : db.product.volume,
    flavorAr: updates.flavorAr ? sanitizeInput(updates.flavorAr) : db.product.flavorAr,
    flavorEn: updates.flavorEn ? sanitizeInput(updates.flavorEn) : db.product.flavorEn,
    purposeAr: updates.purposeAr ? sanitizeInput(updates.purposeAr) : db.product.purposeAr,
    purposeEn: updates.purposeEn ? sanitizeInput(updates.purposeEn) : db.product.purposeEn,
    directionsAr: updates.directionsAr ? sanitizeInput(updates.directionsAr) : db.product.directionsAr,
    storageConditionsAr: updates.storageConditionsAr ? sanitizeInput(updates.storageConditionsAr) : db.product.storageConditionsAr,
    warningsAr: Array.isArray(updates.warningsAr) ? updates.warningsAr.map(sanitizeInput).filter(Boolean) : db.product.warningsAr,
    medicalDisclaimerAr: updates.medicalDisclaimerAr ? sanitizeInput(updates.medicalDisclaimerAr) : db.product.medicalDisclaimerAr,
    isLabelVerified: typeof updates.isLabelVerified === 'boolean' ? updates.isLabelVerified : db.product.isLabelVerified,
    verificationNoticeAr: updates.verificationNoticeAr ? sanitizeInput(updates.verificationNoticeAr) : db.product.verificationNoticeAr,
    updatedAt: new Date().toISOString(),
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_PRODUCT_INFO',
    details: `Updated product specifications for ${db.product.brandNameAr}. Label verified state: ${db.product.isLabelVerified}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, product: db.product });
});

/* ==========================================
   INGREDIENTS ENDPOINTS
   ========================================== */

router.get('/ingredients', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.ingredients);
});

router.post('/ingredients', requireAuth('manage_ingredients'), (req: Request, res: Response) => {
  const db = getDb();
  const data = req.body || {};

  const nameAr = sanitizeInput(data.nameAr || '');
  if (!nameAr) {
    res.status(400).json({ error: 'اسم المكون باللغة العربية مطلوب.' });
    return;
  }

  const newIngredient: Ingredient = {
    id: `ing-${crypto.randomBytes(4).toString('hex')}`,
    nameAr,
    nameEn: sanitizeInput(data.nameEn || ''),
    scientificName: sanitizeInput(data.scientificName || ''),
    amount: sanitizeInput(data.amount || '0 ملغ'),
    servingBasis: sanitizeInput(data.servingBasis || 'لكل 2.5 مل'),
    descriptionAr: sanitizeInput(data.descriptionAr || ''),
    descriptionEn: sanitizeInput(data.descriptionEn || ''),
    isVerified: Boolean(data.isVerified),
    order: db.ingredients.length + 1,
    isPublished: data.isPublished !== false,
  };

  db.ingredients.push(newIngredient);
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'CREATE_INGREDIENT',
    details: `Added new ingredient "${nameAr}" with amount "${newIngredient.amount}" (${newIngredient.servingBasis})`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, ingredient: newIngredient });
});

router.put('/ingredients/:id', requireAuth('manage_ingredients'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.ingredients.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المكون غير موجود' });
    return;
  }

  const existing = db.ingredients[index];
  const updates = req.body || {};

  db.ingredients[index] = {
    ...existing,
    nameAr: updates.nameAr ? sanitizeInput(updates.nameAr) : existing.nameAr,
    nameEn: updates.nameEn !== undefined ? sanitizeInput(updates.nameEn) : existing.nameEn,
    scientificName: updates.scientificName !== undefined ? sanitizeInput(updates.scientificName) : existing.scientificName,
    amount: updates.amount !== undefined ? sanitizeInput(updates.amount) : existing.amount,
    servingBasis: updates.servingBasis !== undefined ? sanitizeInput(updates.servingBasis) : existing.servingBasis,
    descriptionAr: updates.descriptionAr !== undefined ? sanitizeInput(updates.descriptionAr) : existing.descriptionAr,
    descriptionEn: updates.descriptionEn !== undefined ? sanitizeInput(updates.descriptionEn) : existing.descriptionEn,
    isVerified: typeof updates.isVerified === 'boolean' ? updates.isVerified : existing.isVerified,
    order: typeof updates.order === 'number' ? updates.order : existing.order,
    isPublished: typeof updates.isPublished === 'boolean' ? updates.isPublished : existing.isPublished,
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_INGREDIENT',
    details: `Modified ingredient "${db.ingredients[index].nameAr}". Amount: ${db.ingredients[index].amount}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, ingredient: db.ingredients[index] });
});

router.delete('/ingredients/:id', requireAuth('delete_content'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.ingredients.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المكون غير موجود' });
    return;
  }

  const removed = db.ingredients.splice(index, 1)[0];
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'DELETE_INGREDIENT',
    details: `Deleted ingredient "${removed.nameAr}" (ID: ${id})`,
    ipAddress: getClientIp(req),
    status: 'warning',
  });

  res.json({ success: true, message: 'تم حذف المكون بنجاح' });
});

/* ==========================================
   GALLERY MEDIA ENDPOINTS
   ========================================== */

router.get('/gallery', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.gallery || []);
});

router.post('/gallery', requireAuth('manage_ingredients'), (req: Request, res: Response) => {
  const db = getDb();
  const data = req.body || {};

  const titleAr = sanitizeInput(data.titleAr || '');
  if (!titleAr) {
    res.status(400).json({ error: 'عنوان الصورة بالعربية مطلوب.' });
    return;
  }

  const newItem: GalleryItem = {
    id: `gal-${crypto.randomBytes(4).toString('hex')}`,
    src: data.src || '/src/assets/images/moraherivi_syrup_bottle_1793189890091.jpg',
    titleAr,
    titleEn: sanitizeInput(data.titleEn || ''),
    subtitleAr: sanitizeInput(data.subtitleAr || ''),
    subtitleEn: sanitizeInput(data.subtitleEn || ''),
    categoryAr: sanitizeInput(data.categoryAr || 'صور المنتج'),
    categoryEn: sanitizeInput(data.categoryEn || 'Product Photos'),
    order: (db.gallery?.length || 0) + 1,
    isPublished: data.isPublished !== false,
  };

  if (!Array.isArray(db.gallery)) db.gallery = [];
  db.gallery.push(newItem);
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'CREATE_GALLERY_ITEM',
    details: `Added new gallery photo: "${titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, item: newItem });
});

router.put('/gallery/:id', requireAuth('manage_ingredients'), (req: Request, res: Response) => {
  const db = getDb();
  if (!Array.isArray(db.gallery)) db.gallery = [];
  const id = req.params.id;
  const index = db.gallery.findIndex((g) => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'الصورة غير موجودة' });
    return;
  }

  const existing = db.gallery[index];
  const updates = req.body || {};

  db.gallery[index] = {
    ...existing,
    src: updates.src !== undefined ? updates.src : existing.src,
    titleAr: updates.titleAr ? sanitizeInput(updates.titleAr) : existing.titleAr,
    titleEn: updates.titleEn !== undefined ? sanitizeInput(updates.titleEn) : existing.titleEn,
    subtitleAr: updates.subtitleAr !== undefined ? sanitizeInput(updates.subtitleAr) : existing.subtitleAr,
    subtitleEn: updates.subtitleEn !== undefined ? sanitizeInput(updates.subtitleEn) : existing.subtitleEn,
    categoryAr: updates.categoryAr ? sanitizeInput(updates.categoryAr) : existing.categoryAr,
    categoryEn: updates.categoryEn !== undefined ? sanitizeInput(updates.categoryEn) : existing.categoryEn,
    order: typeof updates.order === 'number' ? updates.order : existing.order,
    isPublished: typeof updates.isPublished === 'boolean' ? updates.isPublished : existing.isPublished,
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_GALLERY_ITEM',
    details: `Updated gallery photo "${db.gallery[index].titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, item: db.gallery[index] });
});

router.delete('/gallery/:id', requireAuth('delete_content'), (req: Request, res: Response) => {
  const db = getDb();
  if (!Array.isArray(db.gallery)) db.gallery = [];
  const id = req.params.id;
  const index = db.gallery.findIndex((g) => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'الصورة غير موجودة' });
    return;
  }

  const removed = db.gallery.splice(index, 1)[0];
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'DELETE_GALLERY_ITEM',
    details: `Deleted gallery photo "${removed.titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'warning',
  });

  res.json({ success: true, message: 'تم حذف الصورة من المعرض بنجاح' });
});

/* ==========================================
   PAGES ENDPOINTS
   ========================================== */

router.get('/pages', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.pages);
});

router.post('/pages', requireAuth('manage_pages'), (req: Request, res: Response) => {
  const db = getDb();
  const data = req.body || {};

  const titleAr = sanitizeInput(data.titleAr || '');
  if (!titleAr) {
    res.status(400).json({ error: 'عنوان الصفحة باللغة العربية مطلوب.' });
    return;
  }

  const slug = generateSlug(data.slug || titleAr) || `page-${Date.now()}`;

  const newPage: ContentPage = {
    id: `page-${crypto.randomBytes(4).toString('hex')}`,
    slug,
    titleAr,
    titleEn: sanitizeInput(data.titleEn || ''),
    contentAr: sanitizeInput(data.contentAr || ''),
    contentEn: sanitizeInput(data.contentEn || ''),
    metaDescription: sanitizeInput(data.metaDescription || ''),
    isPublished: data.isPublished !== false,
    updatedAt: new Date().toISOString(),
    order: db.pages.length + 1,
  };

  db.pages.push(newPage);
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'CREATE_PAGE',
    details: `Created page "${titleAr}" with slug /${slug}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, page: newPage });
});

router.put('/pages/:id', requireAuth('manage_pages'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.pages.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'الصفحة غير موجودة' });
    return;
  }

  const existing = db.pages[index];
  const updates = req.body || {};

  db.pages[index] = {
    ...existing,
    slug: updates.slug ? generateSlug(updates.slug) : existing.slug,
    titleAr: updates.titleAr ? sanitizeInput(updates.titleAr) : existing.titleAr,
    titleEn: updates.titleEn !== undefined ? sanitizeInput(updates.titleEn) : existing.titleEn,
    contentAr: updates.contentAr !== undefined ? sanitizeInput(updates.contentAr) : existing.contentAr,
    contentEn: updates.contentEn !== undefined ? sanitizeInput(updates.contentEn) : existing.contentEn,
    metaDescription: updates.metaDescription !== undefined ? sanitizeInput(updates.metaDescription) : existing.metaDescription,
    isPublished: typeof updates.isPublished === 'boolean' ? updates.isPublished : existing.isPublished,
    updatedAt: new Date().toISOString(),
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_PAGE',
    details: `Updated page "${db.pages[index].titleAr}". Published: ${db.pages[index].isPublished}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, page: db.pages[index] });
});

router.delete('/pages/:id', requireAuth('delete_content'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.pages.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'الصفحة غير موجودة' });
    return;
  }

  const removed = db.pages.splice(index, 1)[0];
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'DELETE_PAGE',
    details: `Deleted page "${removed.titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'warning',
  });

  res.json({ success: true, message: 'تم حذف الصفحة بنجاح' });
});

/* ==========================================
   ARTICLES & NEWS ENDPOINTS
   ========================================== */

router.get('/articles', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.articles);
});

router.post('/articles', requireAuth('manage_articles'), (req: Request, res: Response) => {
  const db = getDb();
  const data = req.body || {};

  const titleAr = sanitizeInput(data.titleAr || '');
  if (!titleAr) {
    res.status(400).json({ error: 'عنوان المقال باللغة العربية مطلوب.' });
    return;
  }

  const slug = generateSlug(data.slug || titleAr) || `art-${Date.now()}`;

  const newArticle: Article = {
    id: `art-${crypto.randomBytes(4).toString('hex')}`,
    slug,
    titleAr,
    titleEn: sanitizeInput(data.titleEn || ''),
    excerptAr: sanitizeInput(data.excerptAr || ''),
    contentAr: sanitizeInput(data.contentAr || ''),
    category: sanitizeInput(data.category || 'تثقيف صحي'),
    author: sanitizeInput(data.author || req.user?.username || 'فريق التحرير الطبي'),
    readTimeMinutes: Number(data.readTimeMinutes) || 3,
    isPublished: data.isPublished !== false,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: data.imageUrl || '/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg',
  };

  db.articles.unshift(newArticle);
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'CREATE_ARTICLE',
    details: `Published/drafted article "${titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, article: newArticle });
});

router.put('/articles/:id', requireAuth('manage_articles'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.articles.findIndex((a) => a.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المقال غير موجود' });
    return;
  }

  const existing = db.articles[index];
  const updates = req.body || {};

  db.articles[index] = {
    ...existing,
    slug: updates.slug ? generateSlug(updates.slug) : existing.slug,
    titleAr: updates.titleAr ? sanitizeInput(updates.titleAr) : existing.titleAr,
    titleEn: updates.titleEn !== undefined ? sanitizeInput(updates.titleEn) : existing.titleEn,
    excerptAr: updates.excerptAr !== undefined ? sanitizeInput(updates.excerptAr) : existing.excerptAr,
    contentAr: updates.contentAr !== undefined ? sanitizeInput(updates.contentAr) : existing.contentAr,
    category: updates.category ? sanitizeInput(updates.category) : existing.category,
    author: updates.author ? sanitizeInput(updates.author) : existing.author,
    readTimeMinutes: Number(updates.readTimeMinutes) || existing.readTimeMinutes,
    isPublished: typeof updates.isPublished === 'boolean' ? updates.isPublished : existing.isPublished,
    imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existing.imageUrl,
    updatedAt: new Date().toISOString(),
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_ARTICLE',
    details: `Updated article "${db.articles[index].titleAr}". Published: ${db.articles[index].isPublished}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, article: db.articles[index] });
});

router.delete('/articles/:id', requireAuth('delete_content'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.articles.findIndex((a) => a.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المقال غير موجود' });
    return;
  }

  const removed = db.articles.splice(index, 1)[0];
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'DELETE_ARTICLE',
    details: `Deleted article "${removed.titleAr}"`,
    ipAddress: getClientIp(req),
    status: 'warning',
  });

  res.json({ success: true, message: 'تم حذف المقال بنجاح' });
});

/* ==========================================
   CONTACT INQUIRIES ENDPOINTS
   ========================================== */

router.get('/contacts', requireAuth('manage_contacts'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.contactMessages);
});

router.put('/contacts/:id', requireAuth('manage_contacts'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const message = db.contactMessages.find((m) => m.id === id);

  if (!message) {
    res.status(404).json({ error: 'الرسالة غير موجودة' });
    return;
  }

  const { status } = req.body;
  if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
    message.status = status;
    saveDb();
  }

  res.json({ success: true, message });
});

router.delete('/contacts/:id', requireAuth('delete_content'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.contactMessages.findIndex((m) => m.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'الرسالة غير موجودة' });
    return;
  }

  db.contactMessages.splice(index, 1);
  saveDb();

  res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
});

/* ==========================================
   AUDIT LOGS ENDPOINTS
   ========================================== */

router.get('/logs', requireAuth('view_audit_logs'), (req: Request, res: Response) => {
  const db = getDb();
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const filter = typeof req.query.action === 'string' ? req.query.action : '';

  let logs = db.auditLogs;
  if (filter) {
    logs = logs.filter((l) => l.action.toLowerCase().includes(filter.toLowerCase()));
  }

  res.json({
    total: logs.length,
    logs: logs.slice(0, limit),
  });
});

/* ==========================================
   SETTINGS ENDPOINTS
   ========================================== */

router.get('/settings', requireAuth('view_dashboard'), (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.settings);
});

router.put('/settings', requireAuth('manage_settings'), (req: Request, res: Response) => {
  const db = getDb();
  const updates = req.body || {};

  db.settings = {
    ...db.settings,
    siteNameAr: updates.siteNameAr ? sanitizeInput(updates.siteNameAr) : db.settings.siteNameAr,
    siteNameEn: updates.siteNameEn ? sanitizeInput(updates.siteNameEn) : db.settings.siteNameEn,
    officialPhone: updates.officialPhone ? sanitizeInput(updates.officialPhone) : db.settings.officialPhone,
    officialEmail: updates.officialEmail ? sanitizeInput(updates.officialEmail) : db.settings.officialEmail,
    officialAddressAr: updates.officialAddressAr ? sanitizeInput(updates.officialAddressAr) : db.settings.officialAddressAr,
    whatsappNumber: updates.whatsappNumber ? sanitizeInput(updates.whatsappNumber) : db.settings.whatsappNumber,
    socialLinks: {
      ...db.settings.socialLinks,
      ...(updates.socialLinks || {}),
    },
    copyrightYear: Number(updates.copyrightYear) || db.settings.copyrightYear,
    brandOwnerAr: updates.brandOwnerAr ? sanitizeInput(updates.brandOwnerAr) : db.settings.brandOwnerAr,
    manufacturerOrDistributorAr: updates.manufacturerOrDistributorAr ? sanitizeInput(updates.manufacturerOrDistributorAr) : db.settings.manufacturerOrDistributorAr,
    distributorRelationship: updates.distributorRelationship ? sanitizeInput(updates.distributorRelationship) : db.settings.distributorRelationship,
    maintenanceMode: Boolean(updates.maintenanceMode),
  };

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_SETTINGS',
    details: 'Updated global site settings and contact coordinates.',
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({ success: true, settings: db.settings });
});

/* ==========================================
   ADMINISTRATORS & RBAC MANAGEMENT
   ========================================== */

router.get('/users', requireAuth('manage_users'), (_req: Request, res: Response) => {
  const db = getDb();
  // Strip password hash and salt
  const safeUsers = db.users.map((u) => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    email: u.email,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    isActive: u.isActive,
  }));
  res.json(safeUsers);
});

router.post('/users', requireAuth('manage_users'), (req: Request, res: Response) => {
  const db = getDb();
  const { username, password, fullName, email, role } = req.body || {};

  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanFullName = sanitizeInput(fullName || 'مسؤول المحتوى');
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 32 || !/^[a-z0-9_-]+$/.test(cleanUsername)) {
    res.status(400).json({ error: 'اسم المستخدم يجب أن يكون بين 3 إلى 32 حرفاً ويحتوي فقط على أحرف إنجليزية وأرقام.' });
    return;
  }

  if (db.users.some((u) => u.username === cleanUsername)) {
    res.status(400).json({ error: 'اسم المستخدم مسجل مسبقاً.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'كلمة المرور يجب أن لا تقل عن 8 خانات.' });
    return;
  }

  const validRoles: UserRole[] = ['super_admin', 'content_admin', 'read_only_admin'];
  const userRole: UserRole = validRoles.includes(role) ? role : 'content_admin';

  const { hash, salt } = hashPassword(password);
  const newUser: UserCredentials = {
    id: crypto.randomUUID(),
    username: cleanUsername,
    fullName: cleanFullName,
    role: userRole,
    email: cleanEmail || `${cleanUsername}@moraherivi.com`,
    createdAt: new Date().toISOString(),
    isActive: true,
    passwordHash: hash,
    salt,
  };

  db.users.push(newUser);
  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'CREATE_USER',
    details: `Created new administrator account "${cleanUsername}" with role "${userRole}"`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role,
      email: newUser.email,
    },
  });
});

router.put('/users/:id', requireAuth('manage_users'), (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: 'المستخدم غير موجود' });
    return;
  }

  const { fullName, email, role, isActive, newPassword } = req.body || {};

  if (fullName) user.fullName = sanitizeInput(fullName);
  if (email && isValidEmail(email)) user.email = email.trim().toLowerCase();
  if (typeof isActive === 'boolean') user.isActive = isActive;

  const validRoles: UserRole[] = ['super_admin', 'content_admin', 'read_only_admin'];
  if (role && validRoles.includes(role)) {
    user.role = role;
  }

  if (newPassword && typeof newPassword === 'string' && newPassword.length >= 8) {
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;
  }

  saveDb();

  addAuditLog({
    userId: req.user!.userId,
    username: req.user!.username,
    role: req.user!.role,
    action: 'UPDATE_USER',
    details: `Modified administrator account "${user.username}". Role: ${user.role}, Active: ${user.isActive}`,
    ipAddress: getClientIp(req),
    status: 'success',
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      isActive: user.isActive,
    },
  });
});

/* ==========================================
   BACKUP & RECOVERY ENDPOINTS
   ========================================== */

router.get('/backup/export', requireAuth('manage_backups'), (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const backupJson = exportBackup(req.user!.username, ip);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="moraherivi-backup-${Date.now()}.json"`
  );
  res.send(backupJson);
});

router.post('/backup/restore', requireAuth('manage_backups'), (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const { backupData } = req.body || {};

  if (!backupData || typeof backupData !== 'string') {
    res.status(400).json({ error: 'بيانات النسخة الاحتياطية غير صالحة أو فارغة.' });
    return;
  }

  const success = restoreBackup(backupData, req.user!.username, ip);
  if (!success) {
    res.status(400).json({ error: 'فشل استعادة النسخة الاحتياطية. يرجى التأكد من تطابق الهيكل.' });
    return;
  }

  res.json({ success: true, message: 'تم استعادة قاعدة البيانات والنسخة الاحتياطية بنجاح.' });
});

export default router;
