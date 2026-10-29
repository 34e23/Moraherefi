/**
 * @license
 * Mora Herivi Hero Presentation Section
 */

import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Droplets, Leaf } from 'lucide-react';
import type { ProductInfo } from '../../types/index.js';

interface HeroProps {
  product: ProductInfo;
}

export const Hero: React.FC<HeroProps> = ({ product }) => {
  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF8FD] via-[#F4EEFC] to-[#FAF8FD]">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8DCF9]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#DDD0F7]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Responsive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Presentation Column (7 cols on lg) */}
          <div className="lg:col-span-7 text-right">
            
            {/* Unboxed Editorial Kicker (No pills) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-4">
              <span>{product.categoryAr}</span>
              <span aria-hidden="true">·</span>
              <span>عبوة {product.volume}</span>
              <span aria-hidden="true">·</span>
              <span>{product.flavorAr}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#2D1445] tracking-tight leading-[1.2] mb-6">
              شراب <span className="text-[#6B32A8]">{product.brandNameAr}</span>
              <span className="block text-2xl sm:text-3xl font-sans font-medium text-[#5B3E7A] mt-2">
                تركيبة نباتية ثلاثية لدعم الجهاز التنفسي
              </span>
            </h1>

            {/* Sub-headline description */}
            <p className="text-base sm:text-lg text-[#524466] leading-relaxed mb-8 max-w-2xl font-normal">
              {product.purposeAr}
            </p>

            {/* Trust points list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-4 border-t border-[#E8E1F5]">
              <div className="flex items-start gap-2.5">
                <Leaf className="w-5 h-5 text-[#6B32A8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2D1445]">3 مستخلصات طبيعية</h4>
                  <p className="text-[11px] text-[#6E5D85]">اللبلاب، عرق السوس، والزعتر</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Droplets className="w-5 h-5 text-[#6B32A8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2D1445]">جرعة معايرة بدقة</h4>
                  <p className="text-[11px] text-[#6E5D85]">أساس قياس موثق لكل 2.5 مل</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#6B32A8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2D1445]">مذاق محبب ومستساغ</h4>
                  <p className="text-[11px] text-[#6E5D85]">بنكهة البرتقال الطبيعية</p>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#overview"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md shadow-[#2D1445]/20 hover:shadow-lg transition-all"
              >
                <span>اكتشف تفاصيل المنتج</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <a
                href="#ingredients"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-[#2D1445] bg-white hover:bg-[#F5EFFC] border border-[#DCCDF5] rounded-xl shadow-xs transition-colors"
              >
                <span>تعرّف على المكونات</span>
              </a>
            </div>

            {/* Unboxed quiet caption */}
            <div className="mt-6 text-[12px] text-[#86759E] flex items-center gap-2">
              <span>مكمل غذائي عشبي</span>
              <span aria-hidden="true">·</span>
              <span>خالٍ من الإدعاءات غير الموثقة</span>
              <span aria-hidden="true">·</span>
              <span>مرخّص وفق النظم الصيدلانية</span>
            </div>
          </div>

          {/* Product Bottle Visual Column (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-md">
              {/* Decorative aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6B32A8]/20 to-[#9370DB]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

              {/* Main Packaging Frame */}
              <div className="relative bg-white p-3 sm:p-4 rounded-3xl border border-[#E4D9F5] shadow-xl shadow-[#2D1445]/10 overflow-hidden">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_5833bj5833bj5833_4ab147e3.jpg"
                  alt="عبوة شراب موراهيريفي العشبي 120 مل"
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Packaging details strip */}
                <div className="p-3 bg-[#FAF8FD] rounded-xl mt-3 flex items-center justify-between text-xs border border-[#EDE5F8]">
                  <div className="text-right">
                    <span className="block font-bold text-[#2D1445]">عبوة أصلية 120 مل</span>
                    <span className="text-[11px] text-[#78678F]">زجاج معتم طبي لحماية المستخلصات</span>
                  </div>
                  <div className="text-left font-serif font-bold text-[#7C3AED]">
                    Moraherefi
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
