/**
 * @license
 * Mora Herivi Official Website Footer
 */

import React, { useState } from 'react';
import { Lock, ShieldAlert, X } from 'lucide-react';
import type { WebsiteSettings, ContentPage } from '../../types/index.js';

interface FooterProps {
  settings: WebsiteSettings;
  pages: ContentPage[];
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, pages, onAdminClick }) => {
  const [activeModalPage, setActiveModalPage] = useState<ContentPage | null>(null);

  return (
    <footer className="bg-[#1F0C30] text-[#E0D5F2] pt-16 pb-12 border-t border-[#3B1C5A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#371954]">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 text-right">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs overflow-hidden">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_2stynd2stynd2sty_570d7d80.jpg"
                  alt="شعار موراهيريفي Moraherefi"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">
                {settings.siteNameAr}
              </span>
            </div>

            <p className="text-xs text-[#BFAEDC] leading-relaxed mb-6 max-w-sm">
              الموقع الرسمي الموثق لشراب موراهيريفي العشبي. تركيبة نباتية ثلاثية مخصصة لدعم الجهاز التنفسي وتهدئة الشعب الهوائية.
            </p>

            <div className="text-xs text-[#9E8BBF]">
              <span className="font-semibold text-white">الجهة المسؤولة: </span>
              <span>{settings.brandOwnerAr}</span>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="lg:col-span-3 text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              أقسام الموقع
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEDC]">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  المواصفات والبيانات
                </a>
              </li>
              <li>
                <a href="#ingredients" className="hover:text-white transition-colors">
                  المكونات الفعالة
                </a>
              </li>
              <li>
                <a href="#directions" className="hover:text-white transition-colors">
                  إرشادات الاستخدام
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  معرض الوسائط
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Pages & Regulatory (4 cols) */}
          <div className="lg:col-span-4 text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              الصفحات والسياسات المعتمدة
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#BFAEDC] mb-6">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setActiveModalPage(page)}
                  className="text-right hover:text-white transition-colors cursor-pointer"
                >
                  {page.titleAr}
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#2A1140] rounded-xl border border-[#441E69] text-[11px] text-[#A896C7] leading-relaxed">
              المعلومات الواردة لأغراض التثقيف بالمنتج ولا تُعد استشارة طبية مباشرة. استشر الطبيب دائماً.
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9581B5]">
          <div>
            جميع الحقوق محفوظة © {settings.copyrightYear} {settings.siteNameAr}.
          </div>

          <div className="flex items-center gap-6">
            <span>النسخة الرسمية 1.0</span>
            <span aria-hidden="true">·</span>
            {/* Discreet Admin Entry for administrators */}
            <button
              onClick={onAdminClick}
              className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer text-[11px]"
              title="دخول المشرفين والمحررين"
            >
              <Lock className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>بوابة الإدارة</span>
            </button>
          </div>
        </div>

      </div>

      {/* Page Content Modal (e.g. Privacy Policy, FAQ) */}
      {activeModalPage && (
        <div
          className="fixed inset-0 z-50 bg-[#0F051A]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalPage(null)}
        >
          <div
            className="relative bg-white text-[#2D1445] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[80vh] overflow-y-auto shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalPage(null)}
              aria-label="إغلاق الصفحة"
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold font-serif text-[#2D1445] mb-4">
              {activeModalPage.titleAr}
            </h3>

            <div className="text-xs text-[#86759E] mb-6 pb-3 border-b border-[#F0EAF8]">
              آخر مراجعة:{' '}
              {new Date(activeModalPage.updatedAt).toLocaleDateString('ar-SA')}
            </div>

            <div className="text-sm text-[#4D3D63] leading-relaxed whitespace-pre-line space-y-4">
              {activeModalPage.contentAr}
            </div>

            <div className="mt-8 pt-4 border-t border-[#F0EAF8] text-xs flex justify-end">
              <button
                onClick={() => setActiveModalPage(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2D1445] rounded-xl hover:bg-[#3D1C5E]"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
