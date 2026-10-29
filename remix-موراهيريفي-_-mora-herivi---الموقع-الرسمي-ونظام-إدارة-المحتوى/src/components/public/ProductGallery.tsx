/**
 * @license
 * Mora Herivi Official Product Gallery with Interactive Lightbox
 */

import React, { useState } from 'react';
import { Eye, X, ZoomIn, Sparkles } from 'lucide-react';

import type { GalleryItem } from '../../types/index.js';

interface ProductGalleryProps {
  gallery?: GalleryItem[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  const defaultItems = [
    {
      src: '/assets/aistudio/Gemini_Generated_Image_5833bj5833bj5833_4ab147e3.jpg',
      title: 'عبوة شراب موراهيريفي 120 مل',
      subtitle: 'الزجاج الصيدلاني المعتم والملصق الرسمي المعتمد',
      category: 'العبوة والتغليف',
    },
    {
      src: '/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg',
      title: 'المستخلصات النباتية العشبية',
      subtitle: 'خلاصات أوراق اللبلاب، جذور عرق السوس، وعشبة الزعتر',
      category: 'المكونات الطبيعية',
    },
    {
      src: '/src/assets/images/pharma_laboratory_quality_1793189889844.jpg',
      title: 'معايير الجودة والرقابة الصيدلانية',
      subtitle: 'مختبرات متطورة تضمن دقة العيار وثبات الفاعلية للمنتج',
      category: 'الرقابة المخبرية',
    },
  ];

  const galleryItems = gallery && gallery.length > 0
    ? gallery.map((g) => ({
        src: g.src,
        title: g.titleAr,
        subtitle: g.subtitleAr,
        category: g.categoryAr,
      }))
    : defaultItems;

  return (
    <section id="gallery" className="py-20 bg-[#FAF8FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            معرض الوسائط والتوثيق البصري
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            معرض منتج موراهيريفي (Moraherefi)
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            استعرض الصور الرسمية المعتمدة للعبوة وتفاصيل الملصق والمستخلصات الطبيعية ومعايير الجودة الصيدلانية.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#E7DBF7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8FD]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#2D1445]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#2D1445] flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between text-right">
                <div>
                  <div className="text-[11px] font-semibold text-[#7C3AED] mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-base font-bold text-[#2D1445] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#635378] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F1E9FA] text-[11px] text-[#86769B] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>انقر للتكبير والمعاينة بالحجم الكامل</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-[#140822]/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-[#E8DEF7]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="إغلاق المعاينة"
                className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-h-[70vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-white text-right">
                <div className="text-xs font-semibold text-[#7C3AED] mb-1">
                  معاينة موثقة للمنتج الرسمي
                </div>
                <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5B4A72] leading-relaxed">
                  {selectedImage.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
