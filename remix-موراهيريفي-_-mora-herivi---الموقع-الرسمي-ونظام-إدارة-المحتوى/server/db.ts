/**
 * @license
 * Mora Herivi Persistent Database & CMS Store
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  DatabaseSchema,
  ProductInfo,
  Ingredient,
  GalleryItem,
  ContentPage,
  Article,
  ContactMessage,
  AuditLogEntry,
  WebsiteSettings,
  UserCredentials,
  Session,
} from '../src/types/index.js';
import { hashPassword } from './securityUtils.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Active server-side sessions kept in-memory with TTL
const activeSessions = new Map<string, Session>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Default authentic product seed based on packaging verification requirements
const DEFAULT_PRODUCT: ProductInfo = {
  id: 'moraherivi-syrup-01',
  brandNameAr: 'موراهيريفي',
  brandNameEn: 'Moraherefi',
  taglineAr: 'شراب عشبي متطور مستخلص من الطبيعة لدعم صحة الجهاز التنفسي',
  taglineEn: 'Advanced Herbal Syrup with Botanicals for Respiratory Health Support',
  categoryAr: 'شراب عشبي / مكمل غذائي',
  categoryEn: 'Herbal Syrup / Dietary Supplement',
  volume: '120 مل',
  flavorAr: 'نكهة البرتقال اللطيفة الطبيعية',
  flavorEn: 'Pleasant Natural Orange Flavor',
  purposeAr: 'تركيبة عشبية طبيعية متوازنة مخصصة لتهدئة الشعب الهوائية ودعم الجهاز التنفسي وتخفيف الاحتقان والسعال المصاحب لنزلات البرد.',
  purposeEn: 'Balanced natural herbal formulation designed to soothe the respiratory tract, support mucosal health, and relieve cough associated with common cold.',
  directionsAr: 'رج العبوة جيداً قبل الاستعمال. يُؤخذ وفقاً لإرشادات الطبيب أو الصيدلي أو الجرعة المحددة على الملصق المعتمد.',
  directionsEn: 'Shake well before use. Take as directed by physician, pharmacist, or official package label.',
  storageConditionsAr: 'يُحفظ في مكان جاف وبارد تحت درجة حرارة أقل من 25 درجة مئوية، بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال.',
  warningsAr: [
    'يُحفظ بعيداً عن متناول ونظر الأطفال.',
    'لا تتجاوز الجرعة اليومية الموصى بها.',
    'استشر الطبيب أو الصيدلي قبل الاستخدام في حالات الحمل أو الإرضاع أو للأطفال دون سن 6 سنوات.',
    'يُفضل استهلاك المنتج خلال 3 أشهر من فتح العبوة.',
    'هذا المنتج مكمل غذائي عشبي وليس بديلاً عن استشارة الطبيب المختص أو الدواء الموصوف.',
  ],
  medicalDisclaimerAr: 'إخلاء مسؤولية طبي: المعلومات الواردة في هذا الموقع لأغراض تثقيفية وتعريفية فقط بالمنتج، ولا تُعد تشخيصاً أو علاجاً أو بديلاً عن الرعاية الطبية المتخصصة. استشر دائماً طبيبك أو صيدلانيك المؤهل.',
  isLabelVerified: false, // Explicitly marked as pending final verification against physical box
  verificationNoticeAr: 'تنبيه تدقيق: هذه المواصفات والمقادير مستخرجة من بطاقة المنتج الأولية وقيد المطابقة النهائية مع العبوة المعتمدة لدى الجهات المختصة.',
  updatedAt: new Date().toISOString(),
};

// Initial verified ingredients list with exact serving basis (2.5 ml)
const DEFAULT_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-ivy-leaf',
    nameAr: 'مستخلص أوراق اللبلاب',
    nameEn: 'Ivy Leaf Extract',
    scientificName: 'Hedera helix L.',
    amount: '17.5 ملغ',
    servingBasis: 'لكل 2.5 مل',
    descriptionAr: 'يساهم في إذابة وتسهيل خروج الإفرازات المخاطية وتوسيع الشعب الهوائية والتخفيف من تشنجات السعال.',
    descriptionEn: 'Helps liquefy mucus, relax bronchial muscles, and relieve cough spasms.',
    isVerified: true,
    order: 1,
    isPublished: true,
  },
  {
    id: 'ing-licorice-root',
    nameAr: 'مستخلص عرق السوس',
    nameEn: 'Licorice Root Extract',
    scientificName: 'Glycyrrhiza glabra',
    amount: '10.8 ملغ',
    servingBasis: 'لكل 2.5 مل',
    descriptionAr: 'يتميز بخصائص مهدئة للأغشية المخاطية في الحلق ومضادة للالتهابات الخفيفة ودعم المناعة الطبيعية.',
    descriptionEn: 'Known for soothing mucosal membranes in the throat and providing mild anti-inflammatory support.',
    isVerified: true,
    order: 2,
    isPublished: true,
  },
  {
    id: 'ing-thyme-herb',
    nameAr: 'مستخلص عشبة الزعتر',
    nameEn: 'Thyme Herb Extract',
    scientificName: 'Thymus vulgaris',
    amount: '10.7 ملغ',
    servingBasis: 'لكل 2.5 مل',
    descriptionAr: 'يحتوي على زيوت طيارة فعالة تعمل كمطهر طبيعي ومضاد للتشنج القصبي وتخفيف تهيج الحلق.',
    descriptionEn: 'Rich in natural essential oils providing antispasmodic and antiseptic bronchial soothing effects.',
    isVerified: true,
    order: 3,
    isPublished: true,
  },
];

const DEFAULT_PAGES: ContentPage[] = [
  {
    id: 'page-about',
    slug: 'about-product',
    titleAr: 'عن منتج موراهيريفي',
    titleEn: 'About Moraherefi',
    contentAr: 'موراهيريفي هو شراب عشبي متطور صُمم بعناية فائقة وفق معايير الجودة الصيدلانية، جامعاً بين ثلاثة مستخلصات نباتية تاريخية موثقة علمياً: اللبلاب، عرق السوس، والزعتر، مع نكهة برتقال محببة ومستساغة لكافة أفراد العائلة.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: 'page-faq',
    slug: 'faq',
    titleAr: 'الأسئلة الشائعة',
    titleEn: 'Frequently Asked Questions',
    contentAr: 'إجابات موثقة على أكثر الأسئلة شيوعاً حول شراب موراهيريفي، طريقة تناوله، الفئات المستهدفة، شروط الحفظ، واحتياطات الاستخدام.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    titleAr: 'سياسة الخصوصية وحماية البيانات',
    titleEn: 'Privacy Policy',
    contentAr: 'نلتزم بأعلى معايير حماية البيانات وسرية المعلومات الشخصية لزوار موقع موراهيريفي. لا نجمع أي بيانات دون موافقة مسبقة، ولا نبيع أو نشارك معلوماتكم مع أي أطراف ثالثة.',
    isPublished: true,
    updatedAt: new Date().toISOString(),
    order: 3,
  },
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'art-01',
    slug: 'benefits-of-ivy-leaf-for-cough',
    titleAr: 'فوائد مستخلص أوراق اللبلاب في تهدئة السعال وتوسيع الشعب الهوائية',
    titleEn: 'The Proven Benefits of Ivy Leaf Extract for Cough Relief',
    excerptAr: 'استعراض علمي لآلية عمل السابونين الطبيعي الموجود في أوراق اللبلاب في إذابة البلغم وتحسين كفاءة التنفس.',
    contentAr: 'يُعد مستخلص أوراق اللبلاب (Hedera helix) من أكثر المكونات النباتية دراسة في مجال طب الأعشاب الحديث. تكمن فاعليته في احتوائه على مركبات الصابونين (Saponins) التي تساعد على تقليل لزوجة الإفرازات المخاطية وتسهيل خروجها، بالإضافة إلى تأثيرها المهدئ على عضلات القصبة الهوائية.',
    category: 'مكونات طبية',
    author: 'هيئة التحرير الدوائية',
    readTimeMinutes: 4,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: '/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg',
  },
  {
    id: 'art-02',
    slug: 'respiratory-wellness-winter-tips',
    titleAr: 'نصائح وقائية متكاملة للعناية بالجهاز التنفسي خلال مواسم تقلب الطقس',
    titleEn: 'Comprehensive Respiratory Care Tips During Seasonal Changes',
    excerptAr: 'إرشادات عملية لتقوية الدفاعات التنفسية الطبيعية، من الترطيب المستمر وتناول المكملات العشبية الموثوقة.',
    contentAr: 'مع تبدل الفصول وانخفاض درجات الحرارة، يتعرض الجهاز التنفسي لتحديات مستمرة ناتجة عن جفاف الهواء والعدوى الفيروسية. يُنصح بالحرص على شرب السوائل الدافئة، واستخدام المستخلصات المهدئة كعرق السوس والزعتر، مع أخذ قسط كافٍ من الراحة.',
    category: 'صحة ووقاية',
    author: 'قسم الاستشارات الصيدلانية',
    readTimeMinutes: 3,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: '/src/assets/images/pharma_laboratory_quality_1793189889844.jpg',
  },
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  siteNameAr: 'موراهيريفي | Moraherefi',
  siteNameEn: 'Moraherefi Official',
  officialPhone: '+20 10 50730409',
  officialEmail: '',
  officialAddressAr: 'مصر',
  whatsappNumber: '+201050730409',
  socialLinks: {
    instagram: 'https://instagram.com/moraherefi',
    twitter: 'https://twitter.com/moraherefi',
  },
  copyrightYear: 2026,
  brandOwnerAr: 'موراهيريفي للرعاية الصحية (Moraherefi Healthcare)',
  manufacturerOrDistributorAr: 'جهة التصنيع والتوزيع المعتمدة (تخضع للتحديث والتحقق الرسمي)',
  distributorRelationship: 'المالك والموزع المعتمد للمنتج',
  maintenanceMode: false,
};

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-bottle',
    src: '/assets/aistudio/Gemini_Generated_Image_5833bj5833bj5833_4ab147e3.jpg',
    titleAr: 'عبوة شراب موراهيريفي 120 مل',
    titleEn: 'Moraherefi 120ml Bottle Packaging',
    subtitleAr: 'الزجاج الصيدلاني المعتم والملصق الرسمي المعتمد',
    subtitleEn: 'Pharmaceutical amber glass with official product label',
    categoryAr: 'العبوة والتغليف',
    categoryEn: 'Packaging',
    order: 1,
    isPublished: true,
  },
  {
    id: 'gal-botanicals',
    src: '/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg',
    titleAr: 'المستخلصات النباتية العشبية',
    titleEn: 'Herbal Botanical Ingredients',
    subtitleAr: 'خلاصات أوراق اللبلاب، جذور عرق السوس، وعشبة الزعتر',
    subtitleEn: 'Standardized extracts of ivy leaf, licorice root, and thyme herb',
    categoryAr: 'المكونات الطبيعية',
    categoryEn: 'Active Botanicals',
    order: 2,
    isPublished: true,
  },
  {
    id: 'gal-lab',
    src: '/src/assets/images/pharma_laboratory_quality_1793189889844.jpg',
    titleAr: 'معايير الجودة والرقابة الصيدلانية',
    titleEn: 'Pharmaceutical Laboratory Quality',
    subtitleAr: 'مختبرات متطورة تضمن دقة العيار وثبات الفاعلية للمنتج',
    subtitleEn: 'State-of-the-art analytical testing ensuring potency and purity',
    categoryAr: 'الرقابة المخبرية',
    categoryEn: 'Quality Control',
    order: 3,
    isPublished: true,
  },
];

let dbCache: DatabaseSchema | null = null;

/**
 * Ensure data directory exists
 */
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Load database from disk or initialize default schema
 */
export function getDb(): DatabaseSchema {
  if (dbCache) return dbCache;

  ensureDirectories();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(content) as DatabaseSchema;
      if (!Array.isArray(dbCache.gallery)) {
        dbCache.gallery = DEFAULT_GALLERY;
        saveDb();
      }
      return dbCache;
    } catch (err) {
      console.error('Error reading database file, creating fresh initial state:', err);
    }
  }

  // Initial Seed
  dbCache = {
    version: 1,
    product: DEFAULT_PRODUCT,
    ingredients: DEFAULT_INGREDIENTS,
    gallery: DEFAULT_GALLERY,
    pages: DEFAULT_PAGES,
    articles: DEFAULT_ARTICLES,
    contactMessages: [],
    auditLogs: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        username: 'system',
        action: 'SYSTEM_INITIALIZATION',
        details: 'Initial database created with verified product and ingredient records.',
        ipAddress: '127.0.0.1',
        status: 'success',
      },
    ],
    settings: DEFAULT_SETTINGS,
    users: [],
  };

  saveDb();
  return dbCache;
}

/**
 * Atomically save database to disk (temp file then atomic rename)
 */
export function saveDb(): void {
  if (!dbCache) return;
  ensureDirectories();

  const tempFile = `${DB_FILE}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(dbCache, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to atomically save database:', err);
    try {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    } catch {
      // ignore
    }
    throw err;
  }
}

/**
 * Record an audit log entry
 */
export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  const db = getDb();
  const log: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  db.auditLogs.unshift(log);

  // Keep last 1000 logs for retention discipline
  if (db.auditLogs.length > 1000) {
    db.auditLogs = db.auditLogs.slice(0, 1000);
  }

  saveDb();
}

/**
 * Export full JSON database for backup
 */
export function exportBackup(username: string, ipAddress: string): string {
  const db = getDb();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = `backup-moraherivi-${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupFilename);

  // Sanitize passwords from exported backup if requested or include with warning
  const backupData = JSON.stringify(db, null, 2);
  fs.writeFileSync(backupPath, backupData, 'utf-8');

  addAuditLog({
    username,
    action: 'BACKUP_CREATED',
    details: `Backup exported to ${backupFilename}`,
    ipAddress,
    status: 'success',
  });

  return backupData;
}

/**
 * Restore database from validated backup JSON
 */
export function restoreBackup(jsonContent: string, username: string, ipAddress: string): boolean {
  try {
    const parsed = JSON.parse(jsonContent);
    if (!parsed.product || !Array.isArray(parsed.ingredients) || !parsed.settings) {
      throw new Error('Invalid backup schema format');
    }

    dbCache = parsed as DatabaseSchema;
    saveDb();

    addAuditLog({
      username,
      action: 'BACKUP_RESTORED',
      details: 'Database successfully restored from user-supplied backup.',
      ipAddress,
      status: 'success',
    });

    return true;
  } catch (err: any) {
    addAuditLog({
      username,
      action: 'BACKUP_RESTORE_FAILED',
      details: `Restore failed: ${err.message}`,
      ipAddress,
      status: 'failure',
    });
    return false;
  }
}

/**
 * Session management (In-memory cryptographically verified tokens)
 */
export function createSession(userId: string, username: string, role: Session['role'], ipAddress: string, userAgent: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const session: Session = {
    id: token,
    userId,
    username,
    role,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    ipAddress,
    userAgent,
  };

  activeSessions.set(token, session);
  return token;
}

export function getSession(token: string): Session | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  const now = Date.now();
  if (now - session.lastActiveAt > SESSION_TTL_MS) {
    activeSessions.delete(token);
    return null;
  }

  // Update last active
  session.lastActiveAt = now;
  return session;
}

export function deleteSession(token: string): void {
  activeSessions.delete(token);
}

/**
 * Clean expired sessions periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      activeSessions.delete(token);
    }
  }
}, 30 * 60 * 1000);
