/**
 * @license
 * Mora Herivi API Client
 */

import type {
  ProductInfo,
  Ingredient,
  GalleryItem,
  ContentPage,
  Article,
  WebsiteSettings,
  ContactMessage,
  AuditLogEntry,
  User,
  UserRole,
} from '../types/index.js';

export interface PublicContentResponse {
  product: ProductInfo;
  ingredients: Ingredient[];
  gallery: GalleryItem[];
  pages: ContentPage[];
  articles: Article[];
  settings: WebsiteSettings;
}

export interface AdminOverviewResponse {
  stats: {
    totalIngredients: number;
    publishedIngredients: number;
    totalPages: number;
    publishedPages: number;
    totalArticles: number;
    publishedArticles: number;
    newMessages: number;
    totalMessages: number;
    totalUsers: number;
    isLabelVerified: boolean;
    productLastUpdated: string;
  };
  recentLogs: AuditLogEntry[];
  productSummary: {
    brandNameAr: string;
    brandNameEn: string;
    volume: string;
    flavorAr: string;
    isLabelVerified: boolean;
  };
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Check if session token was saved in sessionStorage as fallback
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('mora_admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('mora_admin_token', token);
      } else {
        sessionStorage.removeItem('mora_admin_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // sends HttpOnly cookies automatically
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data as T;
  }

  // --- Public APIs ---
  async getPublicContent(): Promise<PublicContentResponse> {
    return this.request<PublicContentResponse>('/api/public/content');
  }

  async sendContactMessage(payload: {
    fullName: string;
    phone?: string;
    email?: string;
    subject?: string;
    message: string;
    website_fax_honey?: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/api/public/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Admin Auth APIs ---
  async getSetupStatus(): Promise<{ initialized: boolean; userCount: number }> {
    return this.request('/api/admin/setup-status');
  }

  async setupInitialAdmin(payload: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
  }): Promise<{ success: boolean; token: string; user: User }> {
    const res = await this.request<{ success: boolean; token: string; user: User }>(
      '/api/admin/setup',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(username: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await this.request<{ success: boolean; token: string; user: User }>(
      '/api/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    if (res.token) this.setToken(res.token);
    return res;
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      await this.request('/api/admin/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
    return { success: true };
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/admin/me');
  }

  // --- Admin Dashboard APIs ---
  async getOverview(): Promise<AdminOverviewResponse> {
    return this.request<AdminOverviewResponse>('/api/admin/overview');
  }

  async getProduct(): Promise<ProductInfo> {
    return this.request<ProductInfo>('/api/admin/product');
  }

  async updateProduct(product: Partial<ProductInfo>): Promise<{ success: boolean; product: ProductInfo }> {
    return this.request('/api/admin/product', {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async getIngredients(): Promise<Ingredient[]> {
    return this.request<Ingredient[]>('/api/admin/ingredients');
  }

  async createIngredient(ingredient: Partial<Ingredient>): Promise<{ success: boolean; ingredient: Ingredient }> {
    return this.request('/api/admin/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredient),
    });
  }

  async updateIngredient(id: string, updates: Partial<Ingredient>): Promise<{ success: boolean; ingredient: Ingredient }> {
    return this.request(`/api/admin/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteIngredient(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Gallery Media APIs ---
  async getGallery(): Promise<GalleryItem[]> {
    return this.request<GalleryItem[]>('/api/admin/gallery');
  }

  async createGalleryItem(item: Partial<GalleryItem>): Promise<{ success: boolean; item: GalleryItem }> {
    return this.request('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<{ success: boolean; item: GalleryItem }> {
    return this.request(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  async getPages(): Promise<ContentPage[]> {
    return this.request<ContentPage[]>('/api/admin/pages');
  }

  async createPage(page: Partial<ContentPage>): Promise<{ success: boolean; page: ContentPage }> {
    return this.request('/api/admin/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updatePage(id: string, updates: Partial<ContentPage>): Promise<{ success: boolean; page: ContentPage }> {
    return this.request(`/api/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePage(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/pages/${id}`, {
      method: 'DELETE',
    });
  }

  async getArticles(): Promise<Article[]> {
    return this.request<Article[]>('/api/admin/articles');
  }

  async createArticle(article: Partial<Article>): Promise<{ success: boolean; article: Article }> {
    return this.request('/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<{ success: boolean; article: Article }> {
    return this.request(`/api/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async getContacts(): Promise<ContactMessage[]> {
    return this.request<ContactMessage[]>('/api/admin/contacts');
  }

  async updateContactStatus(id: string, status: ContactMessage['status']): Promise<{ success: boolean; message: ContactMessage }> {
    return this.request(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteContact(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  async getAuditLogs(filter?: string): Promise<{ total: number; logs: AuditLogEntry[] }> {
    const query = filter ? `?action=${encodeURIComponent(filter)}` : '';
    return this.request(`/api/admin/logs${query}`);
  }

  async getSettings(): Promise<WebsiteSettings> {
    return this.request<WebsiteSettings>('/api/admin/settings');
  }

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<{ success: boolean; settings: WebsiteSettings }> {
    return this.request('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  async createUser(user: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    role: UserRole;
  }): Promise<{ success: boolean; user: User }> {
    return this.request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, updates: Partial<User> & { newPassword?: string }): Promise<{ success: boolean; user: User }> {
    return this.request(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async exportBackup(): Promise<string> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const res = await fetch('/api/admin/backup/export', {
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('فشل تصدير النسخة الاحتياطية');
    return res.text();
  }

  async restoreBackup(backupData: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/admin/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ backupData }),
    });
  }
}

export const api = new ApiService();
