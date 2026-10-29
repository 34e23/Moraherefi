/**
 * @license
 * Mora Herivi Admin Product Specifications Editor
 */

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import type { ProductInfo } from '../../types/index.js';

export const AdminProduct: React.FC = () => {
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await api.getProduct();
      setProduct(res);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل بيانات المنتج' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await api.updateProduct(product);
      setProduct(res.product);
      setStatusMessage({ type: 'success', text: 'تم حفظ مواصفات المنتج والبيانات المعتمدة بنجاح!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ التعديلات' });
    } finally {
      setIsSaving(false);
    }
  };

  const addWarning = () => {
    if (!product) return;
    setProduct({
      ...product,
      warningsAr: [...product.warningsAr, ''],
    });
  };

  const updateWarning = (index: number, text: string) => {
    if (!product) return;
    const updated = [...product.warningsAr];
    updated[index] = text;
    setProduct({ ...product, warningsAr: updated });
  };

  const removeWarning = (index: number) => {
    if (!product) return;
    const updated = product.warningsAr.filter((_, i) => i !== index);
    setProduct({ ...product, warningsAr: updated });
  };

  if (isLoading || !product) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب بيانات ومواصفات المنتج...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right">
      
      {/* Title & Save Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            تعديل بيانات ومواصفات المنتج
          </h1>
          <p className="text-xs text-[#705E87]">
            تنعكس التعديلات المحفوظة هنا مباشرة على الموقع العام للجمهور وقاعدة البيانات.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Verification Toggle Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            حالة التحقق والمطابقة مع العبوة الأصلية
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-[#FAF8FD] rounded-2xl border border-[#EAE0F8] mb-4">
            <div>
              <span className="block text-xs font-bold text-[#2D1445]">
                اعتماد المطابقة الرسمية الكاملة للملصق
              </span>
              <span className="text-[11px] text-[#7A6993]">
                عند التفعيل، يختفي تنبيه "قيد المراجعة" ويظهر للمستخدمين أن البيانات مطابقة رسمياً 100%.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={product.isLabelVerified}
                onChange={(e) => setProduct({ ...product, isLabelVerified: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
              نص تنبيه التحقق (يظهر في حال لم يتم الاعتماد النهائي بعد)
            </label>
            <input
              type="text"
              value={product.verificationNoticeAr}
              onChange={(e) => setProduct({ ...product, verificationNoticeAr: e.target.value })}
              className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
            />
          </div>
        </div>

        {/* Identity & Naming Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            الهوية والتسمية الرسمية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                الاسم باللغة العربية
              </label>
              <input
                type="text"
                required
                value={product.brandNameAr}
                onChange={(e) => setProduct({ ...product, brandNameAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                الاسم باللغة الإنجليزية
              </label>
              <input
                type="text"
                required
                value={product.brandNameEn}
                onChange={(e) => setProduct({ ...product, brandNameEn: e.target.value })}
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                حجم العبوة
              </label>
              <input
                type="text"
                required
                value={product.volume}
                onChange={(e) => setProduct({ ...product, volume: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                النكهة
              </label>
              <input
                type="text"
                required
                value={product.flavorAr}
                onChange={(e) => setProduct({ ...product, flavorAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                التصنيف الدوائي / الرقابي
              </label>
              <input
                type="text"
                required
                value={product.categoryAr}
                onChange={(e) => setProduct({ ...product, categoryAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>
          </div>
        </div>

        {/* Indication & Purpose */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            الاستخدام والغرض المصرح به
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                شرح الغرض والتأثير المعتمد
              </label>
              <textarea
                rows={3}
                value={product.purposeAr}
                onChange={(e) => setProduct({ ...product, purposeAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  طريقة الاستخدام وتناول الجرعة
                </label>
                <textarea
                  rows={2}
                  value={product.directionsAr}
                  onChange={(e) => setProduct({ ...product, directionsAr: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  شروط الحفظ والتخزين
                </label>
                <textarea
                  rows={2}
                  value={product.storageConditionsAr}
                  onChange={(e) => setProduct({ ...product, storageConditionsAr: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                إخلاء المسؤولية الطبية
              </label>
              <textarea
                rows={2}
                value={product.medicalDisclaimerAr}
                onChange={(e) => setProduct({ ...product, medicalDisclaimerAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
              />
            </div>
          </div>
        </div>

        {/* Warnings List Editor */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2D1445]">
              التحذيرات والاحتياطات المعتمدة ({product.warningsAr.length})
            </h3>
            <button
              type="button"
              onClick={addWarning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B32A8] bg-[#F4EDFC] hover:bg-[#EAE0F8] rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تحذير جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {product.warningsAr.map((warning, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs text-[#86759E] font-mono">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={warning}
                  onChange={(e) => updateWarning(index, e.target.value)}
                  placeholder="نص التحذير..."
                  className="flex-1 px-4 py-2 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
                <button
                  type="button"
                  onClick={() => removeWarning(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="حذف هذا التحذير"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ ونشر التعديلات'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
