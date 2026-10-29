/**
 * @license
 * Mora Herivi Admin Content Pages Manager
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Save, FileText } from 'lucide-react';
import { api } from '../../services/api.js';
import type { ContentPage } from '../../types/index.js';

export const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Partial<ContentPage> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const list = await api.getPages();
      setPages(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل الصفحات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    try {
      if (editingPage.id) {
        const res = await api.updatePage(editingPage.id, editingPage);
        setPages(pages.map((p) => (p.id === editingPage.id ? res.page : p)));
        setStatusMessage({ type: 'success', text: `تم تحديث صفحة "${res.page.titleAr}" بنجاح!` });
      } else {
        const res = await api.createPage(editingPage);
        setPages([...pages, res.page]);
        setStatusMessage({ type: 'success', text: `تم إنشاء صفحة "${res.page.titleAr}" بنجاح!` });
      }
      setEditingPage(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ الصفحة' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePage(id);
      setPages(pages.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'تم حذف الصفحة بنجاح' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حذف الصفحة' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب قائمة الصفحات الثابتة...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إدارة الصفحات الثابتة والسياسات
          </h1>
          <p className="text-xs text-[#705E87]">
            إنشاء وتعديل صفحات مثل (عن المنتج، الأسئلة الشائعة، سياسة الخصوصية، إخلاء المسؤولية).
          </p>
        </div>

        <button
          onClick={() =>
            setEditingPage({
              titleAr: '',
              titleEn: '',
              slug: '',
              contentAr: '',
              isPublished: true,
              order: pages.length + 1,
            })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء صفحة جديدة</span>
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

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#FAF8FD] border-b border-[#EAE0F8] text-[#78668E]">
                <th className="p-4 font-semibold">عنوان الصفحة</th>
                <th className="p-4 font-semibold">المسار (Slug)</th>
                <th className="p-4 font-semibold">تاريخ التحديث</th>
                <th className="p-4 font-semibold">حالة النشر</th>
                <th className="p-4 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBFA]">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-[#FAF8FD] transition-colors">
                  <td className="p-4 font-bold text-[#2D1445]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#7C3AED]" />
                      <span>{page.titleAr}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#604F75] dir-ltr text-right">
                    /{page.slug}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#78668E]">
                    {new Date(page.updatedAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                      page.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {page.isPublished ? 'منشورة بالموقع' : 'مسودة'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingPage(page)}
                        className="p-1.5 text-[#6B32A8] hover:bg-[#F0EAF8] rounded-lg transition-colors cursor-pointer"
                        title="تعديل الصفحة"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(page.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف الصفحة"
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
      {editingPage && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setEditingPage(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingPage(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-4">
              {editingPage.id ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    عنوان الصفحة بالعربية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.titleAr || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, titleAr: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    المسار (Slug)
                  </label>
                  <input
                    type="text"
                    value={editingPage.slug || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="about-product"
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  محتوى الصفحة بالتفصيل
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingPage.contentAr || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, contentAr: e.target.value })}
                  placeholder="اكتب المحتوى الكامل للصفحة هنا..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D1445]">
                  <input
                    type="checkbox"
                    checked={editingPage.isPublished !== false}
                    onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>نشر الصفحة على الموقع العام</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EAF8]">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ الصفحة</span>
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
              تأكيد حذف الصفحة
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف هذه الصفحة؟ سيتم حذفها نهائياً.
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
