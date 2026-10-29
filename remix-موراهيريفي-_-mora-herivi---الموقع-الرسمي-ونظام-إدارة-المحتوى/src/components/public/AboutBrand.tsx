/**
 * @license
 * Mora Herivi About the Brand & Company Section
 */

import React from 'react';
import { Award, Building2, CheckCircle2, ShieldCheck, Microscope } from 'lucide-react';
import type { WebsiteSettings } from '../../types/index.js';

interface AboutBrandProps {
  settings: WebsiteSettings;
}

export const AboutBrand: React.FC<AboutBrandProps> = ({ settings }) => {
  return (
    <section id="about" className="py-20 bg-white border-b border-[#EDE6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Quality Laboratory Image Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#E6DAF7] shadow-lg group">
              <img
                src="/src/assets/images/pharma_laboratory_quality_1793189889844.jpg"
                alt="فحص الجودة والرقابة الصيدلانية لمنتج موراهيريفي"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1445]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white text-right">
                  <div className="text-xs font-semibold text-[#DDD0F7] mb-1">
                    معايير تصنيع موثقة
                  </div>
                  <div className="text-base font-bold font-serif">
                    رقابة مخبرية صارمة لضمان نقاء المستخلصات
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Column (7 cols) */}
          <div className="lg:col-span-7 text-right">
            
            <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
              حول العلامة والجهة المسؤولة
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
              التزام {settings.siteNameAr} بأعلى معايير الرعاية
            </h2>

            <p className="text-sm sm:text-base text-[#5C4B72] leading-relaxed mb-6 font-normal">
              تأسست علامة موراهيريفي برؤية تهدف إلى الجمع بين المعرفة النباتية الموثقة وأحدث تقنيات المعايرة الصيدلانية، لتوفير مكملات غذائية عشبية تتسم بأعلى درجات النقاء والأمان الموثق مخبرياً.
            </p>

            {/* Corporate Entity Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-[#FAF8FD] rounded-xl border border-[#EDE5F8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D1445] mb-1">
                  <Building2 className="w-4 h-4 text-[#7C3AED]" />
                  <span>الجهة المالكة للعلامة:</span>
                </div>
                <p className="text-xs text-[#635378] leading-relaxed">
                  {settings.brandOwnerAr}
                </p>
              </div>

              <div className="p-4 bg-[#FAF8FD] rounded-xl border border-[#EDE5F8]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D1445] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                  <span>التوزيع والتصنيع المعتمد:</span>
                </div>
                <p className="text-xs text-[#635378] leading-relaxed">
                  {settings.manufacturerOrDistributorAr} ({settings.distributorRelationship})
                </p>
              </div>
            </div>

            {/* Quality Principles */}
            <div className="space-y-3 pt-4 border-t border-[#F0E8F8]">
              <div className="flex items-start gap-2.5 text-xs text-[#594770]">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <span>فحص دوري لكل دفعة إنتاجية لضمان ثبات تركيز المواد الفعالة في مستخلصات اللبلاب والزعتر.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#594770]">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                <span>تغليف في عبوات معتمة مطابقة لمواصفات دستور الأدوية لحفظ ثبات المستخلصات العشبية.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
