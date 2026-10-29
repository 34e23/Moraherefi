/**
 * @license
 * Mora Herivi Public Top Navigation Bar
 * Follows strict 3-zone contract: Brand wordmark — Single-line nav links — Single primary CTA
 */

import React, { useState } from 'react';
import { Menu, X, ShieldCheck, Lock } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  brandNameAr: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick, brandNameAr }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'نظرة عامة', href: '#overview' },
    { label: 'المكونات الفعالة', href: '#ingredients' },
    { label: 'حاسبة الجرعة', href: '#dosage' },
    { label: 'الإرشادات والتحذيرات', href: '#directions' },
    { label: 'معرض المنتج', href: '#gallery' },
    { label: 'المقالات والبحوث', href: '#articles' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8FD]/90 backdrop-blur-md border-b border-[#E8E1F5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 text-decoration-none"
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E2D4F7] p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_2stynd2stynd2sty_570d7d80.jpg"
              alt="شعار موراهيريفي Moraherefi"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-bold tracking-tight text-[#2D1445] font-serif">
              {brandNameAr || 'موراهيريفي'}
            </span>
            <span className="text-[11px] font-medium text-[#7C3AED] tracking-wider uppercase">
              Moraherefi Official
            </span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4B3B60]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="hover:text-[#2D1445] hover:border-b-2 hover:border-[#7C3AED] py-1 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA Button + Discreet Admin portal */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#ingredients"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#ingredients');
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-sm transition-all hover:shadow-md hover:shadow-[#2D1445]/15 whitespace-nowrap shrink-0"
          >
            استكشف التركيبة
          </a>

          {/* Discreet Admin Entry for authorized personnel */}
          <button
            onClick={onAdminClick}
            aria-label="بوابة الإدارة الآمنة"
            title="بوابة الإدارة الآمنة"
            className="p-2 text-[#7C3AED]/70 hover:text-[#2D1445] hover:bg-[#F0EBF8] rounded-lg transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة الرئيسية"
            className="lg:hidden p-2 text-[#2D1445] hover:bg-[#F0EBF8] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8FD] border-b border-[#E8E1F5] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-[#2D1445] hover:bg-[#F0EBF8] rounded-lg transition-colors text-right"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#E8E1F5] flex flex-col gap-2">
              <a
                href="#ingredients"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#ingredients');
                }}
                className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#2D1445] rounded-xl shadow-sm"
              >
                استكشف التركيبة العشبية
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="w-full py-2 text-xs font-medium text-[#7C3AED] hover:bg-[#F0EBF8] rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>لوحة تحكم المشرفين</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
