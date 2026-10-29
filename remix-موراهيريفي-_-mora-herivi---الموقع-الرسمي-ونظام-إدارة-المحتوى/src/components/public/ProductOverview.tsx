/**
 * @license
 * Mora Herivi Product Overview Section
 */

import React from 'react';
import { Package, Sparkles, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';
import type { ProductInfo } from '../../types/index.js';

interface ProductOverviewProps {
  product: ProductInfo;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  return (
    <section id="overview" className="py-20 bg-white border-y border-[#EDE6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            المواصفات والبيانات المعتمدة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            نظرة عامة على منتج {product.brandNameAr}
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            تم تطوير هذا الشراب بمزيج من التراث العشبي العريق والمعايير الصيدلانية الدقيقة لتقديم دعم طبيعي متكامل للمجاري التنفسية.
          </p>
        </div>

        {/* Specifications Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Category & Identity */}
          <div className="bg-[#FAF8FD] p-6 rounded-2xl border border-[#E9DFFA] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9FA] text-[#6B32A8] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2D1445] mb-2">التصنيف الرسمي للمنتج</h3>
            <p className="text-xs text-[#5E4D74] leading-relaxed mb-4">
              {product.categoryAr} — مخصص للاستخدام كدعم عشبي تكميلي للجهاز التنفسي وصحة الشعب الهوائية.
            </p>
            <div className="text-xs text-[#7C3AED] font-medium pt-3 border-t border-[#E8DEF7]">
              Moraherefi Dietary Supplement
            </div>
          </div>

          {/* Card 2: Packaging Volume & Form */}
          <div className="bg-[#FAF8FD] p-6 rounded-2xl border border-[#E9DFFA] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9FA] text-[#6B32A8] flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2D1445] mb-2">حجم العبوة ونوعها</h3>
            <p className="text-xs text-[#5E4D74] leading-relaxed mb-4">
              عبوة زجاجية صيدلانية معتمة سعة {product.volume}، مصممة لحماية المستخلصات العشبية من تأثيرات الضوء والأكسدة.
            </p>
            <div className="text-xs text-[#7C3AED] font-medium pt-3 border-t border-[#E8DEF7]">
              سعة 120 ml محكمة الإغلاق
            </div>
          </div>

          {/* Card 3: Flavor & Palatability */}
          <div className="bg-[#FAF8FD] p-6 rounded-2xl border border-[#E9DFFA] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9FA] text-[#6B32A8] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2D1445] mb-2">النكهة والمذاق</h3>
            <p className="text-xs text-[#5E4D74] leading-relaxed mb-4">
              {product.flavorAr} — تم اختيار نكهة البرتقال بعناية لجعل تناول الجرعة مستساغاً ومريحاً للأطفال والبالغين على حد سواء.
            </p>
            <div className="text-xs text-[#7C3AED] font-medium pt-3 border-t border-[#E8DEF7]">
              نكهة برتقال مقبولة مخبرياً
            </div>
          </div>

        </div>

        {/* Detailed Purpose */}
        <div className="bg-[#FAF8FD] rounded-2xl p-6 sm:p-8 border border-[#E4D7F5]">
          <div className="text-right">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B32A8] mb-2">
              <HeartPulse className="w-4 h-4" />
              <span>الغاية والاستخدام المقصود</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D1445] mb-3">
              الراحة التنفسية الطبيعية بفضل توليفة المستخلصات الفعالة
            </h3>
            <p className="text-sm text-[#55436B] leading-relaxed mb-4">
              {product.purposeAr}
            </p>
            <div className="text-xs text-[#7B6994] flex flex-wrap items-center gap-3">
              <span>تخفيف لزوجة الإفرازات</span>
              <span aria-hidden="true">·</span>
              <span>تهدئة تهيج الحلق</span>
              <span aria-hidden="true">·</span>
              <span>مرونة المجرى التنفسي</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
