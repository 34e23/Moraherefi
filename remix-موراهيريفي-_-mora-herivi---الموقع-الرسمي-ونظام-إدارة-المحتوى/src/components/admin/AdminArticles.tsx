/**
 * @license
 * Mora Herivi Admin Articles & Medical News Manager
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Save, Newspaper } from 'lucide-react';
import { api } from '../../services/api.js';
import type { Article } from '../../types/index.js';

export const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const list = await api.getArticles();
      setArticles(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل المقالات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      if (editingArticle.id) {
        const res = await api.updateArticle(editingArticle.id, editingArticle);
        setArticles(articles.map((a) => (a.id === editingArticle.id ? res.article : a)));
        setStatusMessage({ type: 'success', text: `تم تحديث مقال "${res.article.titleAr}" بنجاح!` });
      } else {
        const res = await api.createArticle(editingArticle);
        setArticles([res.article, ...articles]);
        setStatusMessage({ type: 'success', text: `تم نشر مقال "${res.article.titleAr}" بنجاح!` });
      }
      setEditingArticle(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ المقال' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'تم حذف المقال بنجاح' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حذف المقال' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب المقالات والأبحاث الطبية...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إدارة المقالات والأبحاث الصيدلانية
          </h1>
          <p className="text-xs text-[#705E87]">
            نشر المقالات التثقيفية حول فوائد أوراق اللبلاب، عرق السوس، الزعتر، وصحة الرئة.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingArticle({
              titleAr: '',
              slug: '',
              excerptAr: '',
              contentAr: '',
              category: 'مكونات طبية',
              author: 'هيئة التحرير الدوائية',
              readTimeMinutes: 3,
              isPublished: true,
              imageUrl: '/src/assets/images/herbal_botanical_ingredients_1793189890367.jpg',
            })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>كتابة مقال جديد</span>
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

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#FAF8FD] border-b border-[#EAE0F8] text-[#78668E]">
                <th className="p-4 font-semibold">عنوان المقال</th>
                <th className="p-4 font-semibold">التصنيف</th>
                <th className="p-4 font-semibold">الكاتب</th>
                <th className="p-4 font-semibold">وقت القراءة</th>
                <th className="p-4 font-semibold">حالة النشر</th>
                <th className="p-4 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBFA]">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-[#FAF8FD] transition-colors">
                  <td className="p-4 font-bold text-[#2D1445]">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-[#7C3AED]" />
                      <span className="max-w-md truncate">{art.titleAr}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#604F75]">
                    {art.category}
                  </td>
                  <td className="p-4 text-[#78668E]">
                    {art.author}
                  </td>
                  <td className="p-4 font-mono">
                    {art.readTimeMinutes} دقيقة
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                      art.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {art.isPublished ? 'منشور بالموقع' : 'مسودة'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="p-1.5 text-[#6B32A8] hover:bg-[#F0EAF8] rounded-lg transition-colors cursor-pointer"
                        title="تعديل المقال"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(art.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف المقال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingArticle && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setEditingArticle(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingArticle(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-4">
              {editingArticle.id ? 'تعديل المقال' : 'كتابة مقال جديد'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  عنوان المقال <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.titleAr || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, titleAr: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={editingArticle.category || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    placeholder="مكونات طبية"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    الكاتب أو الجهة المحررة
                  </label>
                  <input
                    type="text"
                    value={editingArticle.author || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    وقت القراءة (دقائق)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingArticle.readTimeMinutes || 3}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  موجز المقال (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.excerptAr || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerptAr: e.target.value })}
                  placeholder="موجز جذاب يظهر في البطاقة التعريفية..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  النص الكامل للمقال
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.contentAr || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, contentAr: e.target.value })}
                  placeholder="المحتوى العلمي والطبي الكامل..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  مسار الصورة المرفقة
                </label>
                <input
                  type="text"
                  value={editingArticle.imageUrl || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D1445]">
                  <input
                    type="checkbox"
                    checked={editingArticle.isPublished !== false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isPublished: e.target.checked })}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>نشر المقال على الموقع العام</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EAF8]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ ونشر المقال</span>
                </button>
              </div>
            </form>
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
              تأكيد حذف المقال
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              هل أنت متأكد من حذف هذا المقال من قاعدة البيانات والموقع؟
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
