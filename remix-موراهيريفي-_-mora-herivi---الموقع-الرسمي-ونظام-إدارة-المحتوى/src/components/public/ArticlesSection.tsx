/**
 * @license
 * Mora Herivi Articles & Health Insights Section
 */

import React, { useState } from 'react';
import { BookOpen, Clock, ArrowLeft, X } from 'lucide-react';
import type { Article } from '../../types/index.js';

interface ArticlesSectionProps {
  articles: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-20 bg-white border-b border-[#EDE6F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            المقالات والدراسات الصيدلانية
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            مقالات وبحوث صحة الجهاز التنفسي
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            اطّلع على أحدث المقالات التثقيفية الصيدلانية الموثقة حول فوائد المستخلصات العشبية ورعاية الجهاز التنفسي.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-[#FAF8FD] rounded-3xl overflow-hidden border border-[#E7DBF7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {art.imageUrl && (
                  <div className="h-48 overflow-hidden bg-[#F0EAF8]">
                    <img
                      src={art.imageUrl}
                      alt={art.titleAr}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-7 text-right">
                  <div className="flex items-center gap-2 text-xs text-[#7C3AED] mb-3">
                    <span>{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-[#86759E]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTimeMinutes} دقائق قراءة</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-3 leading-snug">
                    {art.titleAr}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5B4872] leading-relaxed mb-4">
                    {art.excerptAr}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 flex items-center justify-between border-t border-[#EDE4F8] text-xs">
                <span className="text-[#84739B]">{art.author}</span>
                <button
                  onClick={() => setActiveArticle(art)}
                  className="inline-flex items-center gap-1.5 font-bold text-[#6B32A8] hover:text-[#2D1445] transition-colors cursor-pointer"
                >
                  <span>قراءة المقال كاملاً</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Article Full Reader Modal */}
        {activeArticle && (
          <div
            className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E7DBF7] text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveArticle(null)}
                aria-label="إغلاق المقال"
                className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-xs font-semibold text-[#7C3AED] mb-2">
                {activeArticle.category} · {activeArticle.readTimeMinutes} دقائق قراءة
              </div>

              <h3 className="text-2xl font-bold font-serif text-[#2D1445] mb-4 leading-tight">
                {activeArticle.titleAr}
              </h3>

              <div className="text-xs text-[#86759E] mb-6 pb-4 border-b border-[#F0EAF8]">
                بقلم: {activeArticle.author} · نُشر بتاريخ:{' '}
                {new Date(activeArticle.publishedAt).toLocaleDateString('ar-SA')}
              </div>

              <div className="text-sm text-[#4D3D63] leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {activeArticle.contentAr}
              </div>

              <div className="mt-8 pt-4 border-t border-[#F0EAF8] text-xs text-[#86759E] flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2D1445] rounded-xl hover:bg-[#3D1C5E]"
                >
                  إغلاق المقال
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
