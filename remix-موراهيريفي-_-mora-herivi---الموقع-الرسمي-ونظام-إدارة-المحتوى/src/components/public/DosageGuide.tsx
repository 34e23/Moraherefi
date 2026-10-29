/**
 * @license
 * Mora Herivi Interactive Dosage & Serving Guide Calculator
 */

import React, { useState } from 'react';
import { Beaker, Clock, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import type { Ingredient } from '../../types/index.js';

interface DosageGuideProps {
  ingredients: Ingredient[];
}

export const DosageGuide: React.FC<DosageGuideProps> = ({ ingredients }) => {
  const [selectedDose, setSelectedDose] = useState<number>(2.5); // 2.5 ml or 5 ml

  // Factor relative to 2.5 ml base
  const multiplier = selectedDose / 2.5;

  return (
    <section id="dosage" className="py-20 bg-white border-b border-[#EDE6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            دليل الجرعة المعيارية والمقاييس الدوائية
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            حاسبة ودليل المعايرة الدقيقة للجرعة
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            استعرض المقادير الدقيقة للمستخلصات العشبية الفعالة المستلمة في كل مقدار من الجرعة وفق أساس القياس الصيدلاني المعتمد.
          </p>
        </div>

        {/* Interactive Selector & Visual Representation */}
        <div className="bg-[#FAF8FD] rounded-3xl p-6 sm:p-10 border border-[#E7DBF7] shadow-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Measuring Tool (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E4D9F5] shadow-xs text-center">
              
              <div className="inline-flex items-center gap-2 p-1.5 bg-[#FAF8FD] rounded-2xl border border-[#E8DEF7] mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedDose(2.5)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedDose === 2.5
                      ? 'bg-[#2D1445] text-white shadow-sm'
                      : 'text-[#68567F] hover:text-[#2D1445]'
                  }`}
                >
                  الجرعة المعيارية: 2.5 مل
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDose(5.0)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedDose === 5.0
                      ? 'bg-[#2D1445] text-white shadow-sm'
                      : 'text-[#68567F] hover:text-[#2D1445]'
                  }`}
                >
                  جرعة مضاعفة: 5.0 مل
                </button>
              </div>

              {/* Graphic Cup Illustration */}
              <div className="relative w-36 h-48 mx-auto border-4 border-[#2D1445]/20 border-t-0 rounded-b-3xl flex flex-col justify-end p-2 bg-[#FAF8FD] overflow-hidden">
                <div
                  className="w-full bg-gradient-to-t from-[#6B32A8] to-[#9370DB] rounded-b-2xl transition-all duration-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-inner"
                  style={{ height: selectedDose === 2.5 ? '50%' : '90%' }}
                >
                  {selectedDose} ml
                </div>

                {/* Calibration markings */}
                <div className="absolute right-2 top-6 text-[10px] text-[#86759E] font-mono">5.0 ml —</div>
                <div className="absolute right-2 top-24 text-[10px] text-[#86759E] font-mono">2.5 ml —</div>
              </div>

              <div className="mt-4 text-xs font-bold text-[#2D1445]">
                كوب القياس المرفق مع العبوة (سعة 120 مل)
              </div>
              <p className="text-[11px] text-[#7A6993] mt-1">
                استخدم دائماً المعيار المدرج لتجنب زيادة الجرعة المقررة.
              </p>
            </div>

            {/* Calculated Botanical Extract Breakdown (7 cols) */}
            <div className="lg:col-span-7 text-right">
              
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-2">
                <Beaker className="w-4 h-4" />
                <span>المحتوى الفعلي المستخلص في جرعة ({selectedDose} مل)</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D1445] mb-6">
                تركيز المواد الفعالة بدقة تامة
              </h3>

              {/* Ingredient calculation cards */}
              <div className="space-y-3 mb-6">
                
                {/* Ivy Leaf */}
                <div className="p-4 bg-white rounded-2xl border border-[#EDE4F8] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="block text-xs font-bold text-[#2D1445]">مستخلص أوراق اللبلاب (Ivy Leaf)</span>
                    <span className="text-[11px] text-[#705F87]">الأساس: 17.5 ملغ لكل 2.5 مل</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-lg font-bold text-[#6B32A8]">
                      {(17.5 * multiplier).toFixed(1)} ملغ
                    </span>
                  </div>
                </div>

                {/* Licorice Root */}
                <div className="p-4 bg-white rounded-2xl border border-[#EDE4F8] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="block text-xs font-bold text-[#2D1445]">مستخلص عرق السوس (Licorice Root)</span>
                    <span className="text-[11px] text-[#705F87]">الأساس: 10.8 ملغ لكل 2.5 مل</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-lg font-bold text-[#6B32A8]">
                      {(10.8 * multiplier).toFixed(1)} ملغ
                    </span>
                  </div>
                </div>

              </div>

              {/* Caution Callout */}
              <div className="p-3.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>تنبيه طبي:</strong> تحدد الجرعة المناسبة وعدد المرات يومياً من قبل الطبيب المعالج أو الصيدلي بناءً على الحالة الصحية والعمر. لا يُصرف للأطفال دون 6 سنوات دون إشراف طبي.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
