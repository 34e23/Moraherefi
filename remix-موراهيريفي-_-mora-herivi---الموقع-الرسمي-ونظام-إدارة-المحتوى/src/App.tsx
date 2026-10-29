/**
 * @license
 * Mora Herivi Official Product Website & Secure CMS
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { api, PublicContentResponse } from './services/api.js';

// Public components
import { Navbar } from './components/public/Navbar.js';
import { Hero } from './components/public/Hero.js';
import { ProductOverview } from './components/public/ProductOverview.js';
import { IngredientsSection } from './components/public/IngredientsSection.js';
import { DosageGuide } from './components/public/DosageGuide.js';
import { DirectionsAndWarnings } from './components/public/DirectionsAndWarnings.js';
import { ProductGallery } from './components/public/ProductGallery.js';
import { ArticlesSection } from './components/public/ArticlesSection.js';
import { FaqSection } from './components/public/FaqSection.js';
import { AboutBrand } from './components/public/AboutBrand.js';
import { ContactSection } from './components/public/ContactSection.js';
import { Footer } from './components/public/Footer.js';

// Admin components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminOverview } from './components/admin/AdminOverview.js';
import { AdminProduct } from './components/admin/AdminProduct.js';
import { AdminIngredients } from './components/admin/AdminIngredients.js';
import { AdminMedia } from './components/admin/AdminMedia.js';
import { AdminPages } from './components/admin/AdminPages.js';
import { AdminArticles } from './components/admin/AdminArticles.js';
import { AdminContacts } from './components/admin/AdminContacts.js';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs.js';
import { AdminSettings } from './components/admin/AdminSettings.js';
import { AdminUsers } from './components/admin/AdminUsers.js';
import { AdminBackup } from './components/admin/AdminBackup.js';

function MainApp() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  
  const [publicData, setPublicData] = useState<PublicContentResponse | null>(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(true);

  // Check URL path or hash to see if user requested /admin directly
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
          setIsAdminView(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const loadPublicContent = async () => {
    try {
      const data = await api.getPublicContent();
      setPublicData(data);
    } catch (err) {
      console.error('Failed to load public content:', err);
    } finally {
      setIsLoadingPublic(false);
    }
  };

  useEffect(() => {
    loadPublicContent();
  }, []);

  // When returning from admin to public, refresh public content to show live database edits
  const handleBackToPublic = () => {
    setIsAdminView(false);
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      window.location.hash = '';
    }
    loadPublicContent();
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    if (typeof window !== 'undefined') {
      window.location.hash = 'admin';
    }
  };

  // Render Admin View
  if (isAdminView) {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
          <div className="text-center text-xs font-semibold text-[#7C3AED] animate-pulse">
            جارٍ فحص صلاحيات الجلسة الإدارية المشفرة...
          </div>
        </div>
      );
    }

    if (!user) {
      return <AdminLogin onBackToPublic={handleBackToPublic} />;
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onBackToPublic={handleBackToPublic}
      >
        {adminTab === 'overview' && <AdminOverview onNavigate={setAdminTab} />}
        {adminTab === 'product' && <AdminProduct />}
        {adminTab === 'ingredients' && <AdminIngredients />}
        {adminTab === 'media' && <AdminMedia />}
        {adminTab === 'pages' && <AdminPages />}
        {adminTab === 'articles' && <AdminArticles />}
        {adminTab === 'contacts' && <AdminContacts />}
        {adminTab === 'logs' && <AdminAuditLogs />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'backup' && <AdminBackup />}
      </AdminLayout>
    );
  }

  // Render Public Website
  if (isLoadingPublic || !publicData) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2D4F7] p-1 flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse overflow-hidden">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_2stynd2stynd2sty_570d7d80.jpg"
              alt="Moraherefi"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xs font-semibold text-[#2D1445] tracking-wide">
            موراهيريفي (Moraherefi)
          </div>
          <div className="text-[11px] text-[#7C3AED] mt-1 animate-pulse">
            تحميل الموقع الرسمي المعتمد...
          </div>
        </div>
      </div>
    );
  }

  const { product, ingredients, pages, articles, settings } = publicData;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FD] text-[#1E1926] font-sans selection:bg-[#E2D8F7] selection:text-[#2D1445]">
      {/* Top Navigation */}
      <Navbar
        brandNameAr={product.brandNameAr}
        onAdminClick={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero product={product} />
        <ProductOverview product={product} />
        <IngredientsSection ingredients={ingredients} />
        <DosageGuide ingredients={ingredients} />
        <DirectionsAndWarnings product={product} />
        <ProductGallery gallery={publicData.gallery} />
        <ArticlesSection articles={articles} />
        <FaqSection />
        <AboutBrand settings={settings} />
        <ContactSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        pages={pages}
        onAdminClick={handleOpenAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
