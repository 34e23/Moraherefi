/**
 * @license
 * Mora Herivi Admin Dashboard Layout with Professional Sidebar
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Leaf,
  FileText,
  Newspaper,
  Inbox,
  ShieldAlert,
  Settings,
  Users,
  DatabaseBackup,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import type { UserRole } from '../../types/index.js';

export type AdminTab =
  | 'overview'
  | 'product'
  | 'ingredients'
  | 'media'
  | 'pages'
  | 'articles'
  | 'contacts'
  | 'logs'
  | 'settings'
  | 'users'
  | 'backup';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToPublic,
  children,
}) => {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'مدير النظام (Super Admin)';
      case 'content_admin':
        return 'محرر محتوى (Content Editor)';
      case 'read_only_admin':
        return 'مشرف قراءة (Read-Only)';
      default:
        return 'مشرف معتمد';
    }
  };

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; superAdminOnly?: boolean }[] = [
    { id: 'overview', label: 'لوحة المؤشرات والإحصائيات', icon: LayoutDashboard },
    { id: 'product', label: 'بيانات ومواصفات المنتج', icon: Package },
    { id: 'ingredients', label: 'إدارة المكونات الفعالة', icon: Leaf },
    { id: 'media', label: 'معرض صور ووسائط المنتج', icon: ImageIcon },
    { id: 'pages', label: 'إدارة الصفحات الثابتة', icon: FileText },
    { id: 'articles', label: 'المقالات والأبحاث الطبية', icon: Newspaper },
    { id: 'contacts', label: 'صندوق رسائل التواصل', icon: Inbox },
    { id: 'logs', label: 'سجلات الأنشطة والأمان', icon: ShieldAlert },
    { id: 'settings', label: 'إعدادات الموقع والهوية', icon: Settings },
    { id: 'users', label: 'إدارة المشرفين والصلاحيات', icon: Users, superAdminOnly: true },
    { id: 'backup', label: 'النسخ الاحتياطي والاستعادة', icon: DatabaseBackup, superAdminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3FA] flex flex-col lg:flex-row text-right">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#2D1445] text-white px-4 py-3 flex items-center justify-between border-b border-[#441E66]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-[#3D1C5E] text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-base">موراهيريفي CMS</span>
        </div>

        <button
          onClick={onBackToPublic}
          className="text-xs text-[#E0D5F2] hover:text-white flex items-center gap-1"
        >
          <span>الموقع العام</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-40 w-72 bg-[#2D1445] text-white flex flex-col justify-between shadow-2xl lg:shadow-none transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#441E66] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_2stynd2stynd2sty_570d7d80.jpg"
                  alt="شعار موراهيريفي Moraherefi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block font-bold font-serif text-base text-white">
                  موراهيريفي
                </span>
                <span className="text-[11px] text-[#C4B2E6] font-mono">
                  Moraherefi CMS
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#C4B2E6] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User Pill */}
          <div className="px-6 py-4 bg-[#230E36] border-b border-[#3B195A] text-right">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#522580] text-white flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-white truncate">
                  {user?.fullName || user?.username}
                </span>
                <span className="text-[10px] text-[#C4B2E6] block truncate">
                  {getRoleBadge(user?.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
            {menuItems.map((item) => {
              if (item.superAdminOnly && user?.role !== 'super_admin') {
                return null;
              }
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'text-[#DDD0F5] hover:bg-[#3D1C5E] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#441E66] space-y-2">
          <button
            onClick={onBackToPublic}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#DDD0F5] hover:bg-[#3D1C5E] hover:text-white transition-colors cursor-pointer"
          >
            <span>معاينة الموقع العام</span>
            <ExternalLink className="w-4 h-4 text-[#C4B2E6]" />
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-900/30 hover:text-rose-100 transition-colors cursor-pointer"
          >
            <span>تسجيل الخروج الآمن</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Navbar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E8DEF7] shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-xs font-semibold text-[#2D1445]">
              جلسة إدارية مشفرة ونشطة
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7B6A94]">
              {user?.fullName} ({getRoleBadge(user?.role)})
            </span>
            <button
              onClick={onBackToPublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2D1445] bg-[#FAF8FD] hover:bg-[#F2EBF9] border border-[#E3D6F5] rounded-lg transition-colors cursor-pointer"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7C3AED]" />
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Dynamic Screen View */}
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
