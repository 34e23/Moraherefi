/**
 * @license
 * Mora Herivi Frequently Asked Questions Section
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما هو شراب موراهيريفي (Moraherefi) وما هي استخداماته؟',
      a: 'موراهيريفي هو شراب مكمل غذائي عشبي يجمع بين خلاصة أوراق اللبلاب وجذور عرق السوس وعشبة الزعتر بنكهة البرتقال، صُمم للمساعدة في تهدئة السعال المصاحب لنزلات البرد وتسهيل خروج البلغم وتخفيف تهيج الحلق.',
    },
    {
      q: 'ما هو أساس الجرعة والمقادير المحددة في المنتج؟',
      a: 'جميع مقادير المواد الفعالة محتسبة على أساس معياري محدد وهو (2.5 مل) لكل جرعة (اللبلاب: 17.5 ملغ، عرق السوس: 10.8 ملغ، الزعتر: 10.7 ملغ). يُرجى دائماً الالتزام بالجرعة الموصوفة من الطبيب أو الصيدلي.',
    },
    {
      q: 'هل يناسب الأطفال؟',
      a: 'نظراً لاحتوائه على مستخلصات عشبية مركزة، يُمنع إعطاء المنتج للأطفال دون سن 6 سنوات دون استشارة الطبيب المختص أو الصيدلي لتحديد الملاءمة والجرعة الدقيقة.',
    },
    {
      q: 'كيف يُحفظ شراب موراهيريفي؟',
      a: 'يُحفظ في مكان بارد وجاف تحت درجة حرارة أقل من 25 درجة مئوية، بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال. يُنصح برج العبوة جيداً قبل كل استخدام واستهلاكها خلال 3 أشهر من الفتح.',
    },
    {
      q: 'هل شراب موراهيريفي دواء لعلاج الأمراض المزمنة؟',
      a: 'كلا، موراهيريفي مكمل غذائي عشبي وليس دواءً بديلاً عن الرعاية الطبية أو المضادات الحيوية عند وجود عدوى بكتيرية أو حالات السعال المزمن غير المشخص.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FAF8FD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            الإجابات المعتمدة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            الأسئلة الشائعة حول موراهيريفي
          </h2>
          <p className="text-sm text-[#615175] leading-relaxed">
            جمعنا لكم أهم الاستفسارات المتكررة حول طريقة الاستعمال، الحفظ، والمكونات للإجابة عليها بكل وضوح وشفافية.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E7DBF7] shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 hover:bg-[#FAF8FD] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-[#2D1445]">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#F4EDFC] text-[#6B32A8] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#2D1445] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#5B4972] leading-relaxed border-t border-[#F2EBFA] pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
