/**
 * @license
 * Mora Herivi Admin Media & Product Gallery Manager
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Save, Image as ImageIcon, Eye } from 'lucide-react';
import { api } from '../../services/api.js';
import type { GalleryItem } from '../../types/index.js';

export const AdminMedia: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const list = await api.getGallery();
      setItems(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل وسائط المعرض' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        const res = await api.updateGalleryItem(editingItem.id, editingItem);
        setItems(items.map((i) => (i.id === editingItem.id ? res.item : i)));
        setStatusMessage({ type: 'success', text: `تم تحديث الصورة "${res.item.titleAr}" بنجاح!` });
      } else {
        const res = await api.createGalleryItem(editingItem);
        setItems([...items, res.item]);
        setStatusMessage({ type: 'success', text: `تمت إضافة الصورة "${res.item.titleAr}" إلى المعرض بنجاح!` });
      }
      setEditingItem(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ الصورة' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
      setItems(items.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'تم حذف الصورة من المعرض بنجاح' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حذف الصورة' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب صور ووسائط المعرض...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إدارة وسائط ومعرض صور المنتج
          </h1>
          <p className="text-xs text-[#705E87]">
            التحكم في صور عبوة موراهيريفي، صور المستخلصات، ومعايير الرقابة المخبرية المعروضة للجمهور.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              titleAr: '',
              titleEn: '',
              subtitleAr: '',
              subtitleEn: '',
              categoryAr: 'صور المنتج',
              categoryEn: 'Product Photos',
              src: '/src/assets/images/moraherivi_syrup_bottle_1793189890091.jpg',
              order: items.length + 1,
              isPublished: true,
            })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صورة جديدة للمعرض</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border border-rose-200 text-rose-900'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 bg-[#FAF8FD] overflow-hidden group">
                <img
                  src={item.src}
                  alt={item.titleAr}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(item.src)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة</span>
                </button>
              </div>

              <div className="p-5 text-right">
                <div className="text-[11px] font-semibold text-[#7C3AED] mb-1">
                  {item.categoryAr}
                </div>
                <h3 className="text-base font-bold text-[#2D1445] mb-1 truncate">
                  {item.titleAr}
                </h3>
                <p className="text-xs text-[#635378] leading-relaxed line-clamp-2">
                  {item.subtitleAr}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8FD] border-t border-[#EFE8F8] flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                item.isPublished
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.isPublished ? 'منشورة' : 'مسودة'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-1.5 text-[#6B32A8] hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="تعديل الصورة"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-4">
              {editingItem.id ? 'تعديل بيانات الصورة' : 'إضافة صورة جديدة للمعرض'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  عنوان الصورة بالعربية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.titleAr || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                  placeholder="مثال: عبوة شراب موراهيريفي 120 مل"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  الوصف التوضيحي بالعربية
                </label>
                <input
                  type="text"
                  value={editingItem.subtitleAr || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitleAr: e.target.value })}
                  placeholder="الزجاج الصيدلاني المعتم والملصق الرسمي المعتمد"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={editingItem.categoryAr || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryAr: e.target.value })}
                    placeholder="العبوة والتغليف"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    مسار أو رابط الصورة (URL / Path)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.src || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, src: e.target.value })}
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D1445]">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>نشر الصورة في معرض الموقع العام</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EAF8]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ الصورة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl w-full p-2 bg-black rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="معاينة"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-right shadow-2xl border border-[#E7DBF7]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#2D1445] mb-2">
              تأكيد حذف الصورة
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف هذه الصورة من معرض المنتج؟
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
              >
                تراجع
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
