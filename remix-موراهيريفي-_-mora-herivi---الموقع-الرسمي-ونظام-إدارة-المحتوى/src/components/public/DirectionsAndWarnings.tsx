/**
 * @license
 * Mora Herivi Directions, Storage & Warnings Section
 */

import React from 'react';
import { Compass, AlertTriangle, Thermometer, ShieldAlert } from 'lucide-react';
import type { ProductInfo } from '../../types/index.js';

interface DirectionsAndWarningsProps {
  product: ProductInfo;
}

export const DirectionsAndWarnings: React.FC<DirectionsAndWarningsProps> = ({ product }) => {
  return (
    <section id="directions" className="py-20 bg-white border-b border-[#EDE6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            دليل الاستخدام والسلامة الدوائية
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            إرشادات الاستعمال وشروط الحفظ والتحذيرات
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            لضمان الفائدة المثلى والسلامة التامة، يرجى الالتزام الصارم بالإرشادات الرسمية المعتمدة المدونة على عبوة منتج {product.brandNameAr}.
          </p>
        </div>

        {/* 2-Column Split: Directions & Storage vs Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Directions of Use & Storage Conditions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Directions Card */}
            <div className="bg-[#FAF8FD] p-6 sm:p-7 rounded-2xl border border-[#E7DBF7]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFE8FA] text-[#6B32A8] flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D1445]">
                  طريقة الاستخدام وتناول الجرعة
                </h3>
              </div>
              <p className="text-sm text-[#5B4872] leading-relaxed mb-4">
                {product.directionsAr}
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#EDE4F8] text-xs text-[#6B32A8]">
                <strong>تذكير مهم:</strong> استخدم دائماً المعيار أو الملعقة المدرجة مع العبوة لتحديد الجرعة بدقة دون زيادة أو نقصان.
              </div>
            </div>

            {/* Storage Conditions Card */}
            <div className="bg-[#FAF8FD] p-6 sm:p-7 rounded-2xl border border-[#E7DBF7]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFE8FA] text-[#6B32A8] flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2D1445]">
                  شروط وظروف الحفظ والتخزين
                </h3>
              </div>
              <p className="text-sm text-[#5B4872] leading-relaxed">
                {product.storageConditionsAr}
              </p>
            </div>

          </div>

          {/* Column 2: Official Warnings & Precautions (6 cols) */}
          <div className="lg:col-span-6 bg-[#FAF8FD] p-6 sm:p-7 rounded-2xl border border-[#E7DBF7] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8E7E7] text-[#B91C1C] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2D1445]">
                    التحذيرات والاحتياطات الرسمية
                  </h3>
                  <span className="text-xs text-[#8B7C9E]">يُرجى قراءتها بدقة قبل البدء في الاستخدام</span>
                </div>
              </div>

              {/* Warnings List */}
              <ul className="space-y-3 mb-6">
                {product.warningsAr.map((warning, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#594770] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] mt-2 shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-[#867699] pt-4 border-t border-[#EFE8F8]">
              * هذه التحذيرات قابلة للتحديث عبر لوحة إدارة النظام فور اعتماد أي ملحق تنظيمي من السلطات الصحية.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
