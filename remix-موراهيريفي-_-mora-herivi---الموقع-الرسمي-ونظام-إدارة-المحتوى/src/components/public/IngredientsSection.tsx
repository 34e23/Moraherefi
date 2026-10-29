/**
 * @license
 * Mora Herivi Ingredients Presentation Section
 * Shows exact active ingredient amounts and official serving basis (per 2.5 ml)
 */

import React from 'react';
import { Leaf, Info, Check, Beaker } from 'lucide-react';
import type { Ingredient } from '../../types/index.js';

interface IngredientsSectionProps {
  ingredients: Ingredient[];
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({ ingredients }) => {
  return (
    <section id="ingredients" className="py-20 bg-[#FAF8FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            التركيبة النباتية الفعالة والمعايرة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            المكونات العشبية لشراب موراهيريفي
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            تعتمد تركيبة موراهيريفي على ثلاثة مستخلصات نباتية منتقاة بعناية، تم تحديد تراكيزها بمقاييس دقيقة وفق الحصة المعيارية الرسمية.
          </p>
        </div>

        {/* Serving Basis Notice */}
        <div className="max-w-2xl mx-auto mb-12 p-3 bg-white border border-[#E3D6F5] rounded-xl shadow-xs flex items-center justify-between text-xs text-[#523F6B]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <span>أساس احتساب المقادير: <strong>لكل جرعة 2.5 مل</strong> (مطابقة للملصق قيد التحقق النهائي).</span>
          </div>
          <span className="text-[11px] font-medium text-[#7C3AED] hidden sm:inline">
            جرعة معايرة بدقة
          </span>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ingredients.map((ing, idx) => (
            <div
              key={ing.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E6DBF7] shadow-sm hover:shadow-md hover:border-[#C4B2E6] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Botanical index */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#7C3AED] font-mono">
                    0{idx + 1}. المستخلص العشبي
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFFC] text-[#6B32A8] flex items-center justify-center">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-1">
                  {ing.nameAr}
                </h3>
                <div className="text-xs text-[#7B6994] font-medium mb-3">
                  {ing.nameEn} {ing.scientificName ? `(${ing.scientificName})` : ''}
                </div>

                {/* Amount Highlight Card */}
                <div className="my-4 p-3.5 bg-[#FAF8FD] rounded-xl border border-[#EDE4F8]">
                  <div className="text-[11px] text-[#7E6E96] mb-1">الكمية المقررة بالجرعة:</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-[#2D1445] font-mono">
                      {ing.amount}
                    </span>
                    <span className="text-xs font-medium text-[#6B32A8]">
                      {ing.servingBasis}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5E4D74] leading-relaxed mt-2">
                  {ing.descriptionAr}
                </p>
              </div>

              {/* Verification tag */}
              <div className="pt-4 mt-4 border-t border-[#F2EBFA] flex items-center justify-between text-[11px]">
                <span className="text-[#8B7C9E]">حالة المطابقة:</span>
                <span className="inline-flex items-center gap-1 text-[#4E287C] font-semibold">
                  <Check className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>معتمد بالتركيبة</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botanical Visual Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4D9F5] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-[#EDE5F8]">
              <img
                src="/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg"
                alt="أوراق اللبلاب وعرق السوس والزعتر الطبيعية"
                className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-7 text-right">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-2">
                <Beaker className="w-4 h-4" />
                <span>الانسجام والتكامل الدوائي العشبي</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#2D1445] mb-3">
                تآزر ثلاثي مدروس يجمع بين التهدئة وتسهيل التنفس
              </h3>
              <p className="text-xs sm:text-sm text-[#5B4972] leading-relaxed mb-4">
                تتكامل خلاصات اللبلاب، عرق السوس، والزعتر لتعطي تأثيراً متناغماً؛ حيث يركز اللبلاب على سيولة الإفرازات الشعبية، بينما يوفر عرق السوس الترطيب والتهدئة الفورية لبطانة الحلق، في حين تعمل الزيوت العطرية في الزعتر على تخفيف تشنجات السعال وإنعاش المجرى التنفسي.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A6993]">
                <span>خالٍ من الإضافات الكيميائية الضارة</span>
                <span aria-hidden="true">·</span>
                <span>مستخلصات نباتية منتقاة</span>
                <span aria-hidden="true">·</span>
                <span>تصنيع يراعي معايير الجودة</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
