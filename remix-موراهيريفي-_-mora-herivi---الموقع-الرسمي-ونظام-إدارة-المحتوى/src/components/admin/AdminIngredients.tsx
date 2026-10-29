/**
 * @license
 * Mora Herivi Admin Ingredients Manager
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Save, Leaf } from 'lucide-react';
import { api } from '../../services/api.js';
import type { Ingredient } from '../../types/index.js';

export const AdminIngredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<Ingredient> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const list = await api.getIngredients();
      setIngredients(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل المكونات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        // Update
        const res = await api.updateIngredient(editingItem.id, editingItem);
        setIngredients(ingredients.map((i) => (i.id === editingItem.id ? res.ingredient : i)));
        setStatusMessage({ type: 'success', text: `تم تحديث المكون "${res.ingredient.nameAr}" بنجاح!` });
      } else {
        // Create
        const res = await api.createIngredient(editingItem);
        setIngredients([...ingredients, res.ingredient]);
        setStatusMessage({ type: 'success', text: `تم إضافة المكون "${res.ingredient.nameAr}" بنجاح!` });
      }
      setEditingItem(null);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ المكون' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteIngredient(id);
      setIngredients(ingredients.filter((i) => i.id !== id));
      setDeleteConfirmId(null);
      setStatusMessage({ type: 'success', text: 'تم حذف المكون بنجاح من قاعدة البيانات' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حذف المكون' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب قائمة المكونات العشبية...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إدارة المكونات النباتية والفعالة
          </h1>
          <p className="text-xs text-[#705E87]">
            تعديل المقادير، أسس القياس (لكل 2.5 مل)، والوصف العلمي لكل مكون.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              nameAr: '',
              nameEn: '',
              scientificName: '',
              amount: '10 ملغ',
              servingBasis: 'لكل 2.5 مل',
              descriptionAr: '',
              isVerified: true,
              isPublished: true,
              order: ingredients.length + 1,
            })
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مكون عشبي جديد</span>
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

      {/* Ingredients Table */}
      <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#FAF8FD] border-b border-[#EAE0F8] text-[#78668E]">
                <th className="p-4 font-semibold">المكون العشبي</th>
                <th className="p-4 font-semibold">الاسم العلمي / الإنجليزي</th>
                <th className="p-4 font-semibold">الكمية المقررة</th>
                <th className="p-4 font-semibold">أساس القياس</th>
                <th className="p-4 font-semibold">الحالة والنشر</th>
                <th className="p-4 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBFA]">
              {ingredients.map((ing) => (
                <tr key={ing.id} className="hover:bg-[#FAF8FD] transition-colors">
                  <td className="p-4 font-bold text-[#2D1445]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F5EFFC] text-[#6B32A8] flex items-center justify-center shrink-0">
                        <Leaf className="w-3.5 h-3.5" />
                      </div>
                      <span>{ing.nameAr}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#604F75] font-serif">
                    {ing.nameEn} {ing.scientificName ? `(${ing.scientificName})` : ''}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#2D1445]">
                    {ing.amount}
                  </td>
                  <td className="p-4 text-[#7C3AED] font-semibold">
                    {ing.servingBasis}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                      ing.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {ing.isPublished ? 'منشور بالموقع' : 'مسودة غير منشورة'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingItem(ing)}
                        className="p-1.5 text-[#6B32A8] hover:bg-[#F0EAF8] rounded-lg transition-colors cursor-pointer"
                        title="تعديل المكون"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(ing.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف المكون"
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
              {editingItem.id ? 'تعديل المكون العشبي' : 'إضافة مكون عشبي جديد'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    الاسم بالعربية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.nameAr || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    type="text"
                    value={editingItem.nameEn || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  الاسم العلمي اللاتيني
                </label>
                <input
                  type="text"
                  value={editingItem.scientificName || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, scientificName: e.target.value })}
                  placeholder="مثال: Hedera helix L."
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    الكمية المقررة
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.amount || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, amount: e.target.value })}
                    placeholder="17.5 ملغ"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    أساس القياس (Serving Basis)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.servingBasis || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, servingBasis: e.target.value })}
                    placeholder="لكل 2.5 مل"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  الوصف والتأثير الدوائي
                </label>
                <textarea
                  rows={3}
                  value={editingItem.descriptionAr || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D1445]">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>نشر في الموقع العام</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D1445]">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.isVerified)}
                    onChange={(e) => setEditingItem({ ...editingItem, isVerified: e.target.checked })}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>مطابق ومعتمد رسمياً</span>
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
                  <span>حفظ المكون</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
              تأكيد حذف المكون العشبي
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في حذف هذا المكون؟ سيختفي المكون نهائياً من الموقع العام وقاعدة البيانات.
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
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
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
