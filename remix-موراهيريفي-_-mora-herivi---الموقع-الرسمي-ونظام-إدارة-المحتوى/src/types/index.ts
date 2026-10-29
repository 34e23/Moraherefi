/**
 * @license
 * Mora Herivi Official Website & CMS Data Types
 */

export type UserRole = 'super_admin' | 'content_admin' | 'read_only_admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UserCredentials extends User {
  passwordHash: string;
  salt: string;
}

export interface Session {
  id: string;
  userId: string;
  role: UserRole;
  username: string;
  createdAt: number;
  lastActiveAt: number;
  ipAddress: string;
  userAgent: string;
}

export interface Ingredient {
  id: string;
  nameAr: string;
  nameEn: string;
  scientificName?: string;
  amount: string; // e.g. "17.5 ملغ"
  servingBasis: string; // e.g. "لكل 2.5 مل"
  descriptionAr: string;
  descriptionEn?: string;
  isVerified: boolean;
  order: number;
  isPublished: boolean;
}

export interface ProductInfo {
  id: string;
  brandNameAr: string;
  brandNameEn: string;
  taglineAr: string;
  taglineEn: string;
  categoryAr: string;
  categoryEn: string;
  volume: string; // e.g. "120 مل"
  flavorAr: string; // e.g. "نكهة البرتقال اللطيفة"
  flavorEn: string;
  purposeAr: string;
  purposeEn: string;
  directionsAr: string;
  directionsEn?: string;
  storageConditionsAr: string;
  warningsAr: string[];
  medicalDisclaimerAr: string;
  isLabelVerified: boolean;
  verificationNoticeAr: string;
  updatedAt: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  titleAr: string;
  titleEn?: string;
  contentAr: string;
  contentEn?: string;
  metaDescription?: string;
  isPublished: boolean;
  updatedAt: string;
  order: number;
}

export interface Article {
  id: string;
  slug: string;
  titleAr: string;
  titleEn?: string;
  excerptAr: string;
  contentAr: string;
  category: string;
  author: string;
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  ipAddress?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  username: string;
  role?: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failure' | 'warning';
}

export interface WebsiteSettings {
  siteNameAr: string;
  siteNameEn: string;
  officialPhone: string;
  officialEmail: string;
  officialAddressAr: string;
  whatsappNumber?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  copyrightYear: number;
  brandOwnerAr: string;
  manufacturerOrDistributorAr: string;
  distributorRelationship: string;
  maintenanceMode: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  titleAr: string;
  titleEn?: string;
  subtitleAr: string;
  subtitleEn?: string;
  categoryAr: string;
  categoryEn?: string;
  order: number;
  isPublished: boolean;
}

export interface DatabaseSchema {
  version: number;
  product: ProductInfo;
  ingredients: Ingredient[];
  gallery: GalleryItem[];
  pages: ContentPage[];
  articles: Article[];
  contactMessages: ContactMessage[];
  auditLogs: AuditLogEntry[];
  settings: WebsiteSettings;
  users: UserCredentials[];
}
