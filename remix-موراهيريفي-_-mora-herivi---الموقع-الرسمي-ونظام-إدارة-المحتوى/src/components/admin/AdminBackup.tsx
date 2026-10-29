/**
 * @license
 * Mora Herivi Admin Database Backup & Disaster Recovery Manager
 */

import React, { useState } from 'react';
import { Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';
import { api } from '../../services/api.js';

export const AdminBackup: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreJson, setRestoreJson] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportBackup = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const backupText = await api.exportBackup();
      
      // Trigger client file download
      const blob = new Blob([backupText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moraherivi-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({ type: 'success', text: 'تم تنزيل النسخة الاحتياطية الكاملة بنجاح وحفظها محلياً.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تصدير النسخة الاحتياطية' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreJson.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى إدخال محتوى ملف النسخة الاحتياطية بصيغة JSON' });
      return;
    }

    setIsRestoring(true);
    setStatusMessage(null);

    try {
      const res = await api.restoreBackup(restoreJson);
      setShowRestoreModal(false);
      setRestoreJson('');
      setStatusMessage({ type: 'success', text: res.message || 'تمت استعادة قاعدة البيانات والنسخة بنجاح!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشلت استعادة النسخة الاحتياطية' });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRestoreJson(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E8DEF7]">
        <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
          النسخ الاحتياطي وإدارة التعافي من الكوارث (Backup & Disaster Recovery)
        </h1>
        <p className="text-xs text-[#705E87]">
          تصدير قاعدة البيانات بالكامل بما يشمل مواصفات المنتج، المكونات، الصفحات، المقالات، وسجلات التدقيق.
        </p>
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

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FD] text-[#6B32A8] flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2D1445] mb-2">
              تصدير نسخة احتياطية فورية
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              يتم إنشاء وتنزيل ملف JSON موثق يحتوي على كامل سجلات قاعدة البيانات، ويتم تسجيل عملية التصدير في سجل الأمان.
            </p>
          </div>

          <button
            onClick={handleExportBackup}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'جارٍ التصدير...' : 'تنزيل نسخة احتياطية كاملة (JSON)'}</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2D1445] mb-2">
              استعادة قاعدة البيانات من نسخة سابقة
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-6">
              استبدال بيانات النظام الحالية بنسخة احتياطية سابقة معتمدة بعد فحص سلامة الهيكل وتسجيل الإجراء في سجل التدقيق.
            </p>
          </div>

          <button
            onClick={() => setShowRestoreModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>بدء إجراء الاستعادة</span>
          </button>
        </div>

      </div>

      {/* Recovery Guidance Document */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7DBF7] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2D1445]">
          <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
          <span>دليل خطة التعافي واستمرارية التشغيل (Disaster Recovery Plan)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#FAF8FD] rounded-2xl border border-[#EDE4F8]">
            <h4 className="text-xs font-bold text-[#2D1445] mb-1">1. دورية النسخ</h4>
            <p className="text-[11px] text-[#635378] leading-relaxed">
              يُنصح بتنزيل نسخة احتياطية قبل إجراء أي تعديلات جوهرية على المكونات أو نسب التراكيز أو حذف الصفحات.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8FD] rounded-2xl border border-[#EDE4F8]">
            <h4 className="text-xs font-bold text-[#2D1445] mb-1">2. التخزين الآمن</h4>
            <p className="text-[11px] text-[#635378] leading-relaxed">
              احفظ ملفات النسخ الاحتياطي في وسائط مشفرة أو سحابة تخزين مستقلة خاصة بالمؤسسة خارج بيئة الخادم.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8FD] rounded-2xl border border-[#EDE4F8]">
            <h4 className="text-xs font-bold text-[#2D1445] mb-1">3. التحقق الدوري</h4>
            <p className="text-[11px] text-[#635378] leading-relaxed">
              قم باختبار صحة ملفات النسخ واستعادتها في بيئة تجريبية للتأكد من عدم تلف البيانات عند الحاجة للتعافي.
            </p>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowRestoreModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#2D1445]">
                تأكيد استعادة قاعدة البيانات
              </h3>
            </div>

            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed mb-4">
              <strong>تحذير هام:</strong> هذه العملية ستقوم باستبدال كافة البيانات الحالية بمحتوى النسخة المرفوعة. يُرجى توخي الحذر الشديد والتأكد من الملف.
            </p>

            <form onSubmit={handleRestoreSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  رفع ملف النسخة الاحتياطية (JSON)
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-[#635378] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FAF8FD] file:text-[#2D1445] hover:file:bg-[#F2EBF9] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  أو لصق محتوى الـ JSON هنا
                </label>
                <textarea
                  rows={6}
                  required
                  value={restoreJson}
                  onChange={(e) => setRestoreJson(e.target.value)}
                  placeholder='{"version": 1, "product": {...}}'
                  dir="ltr"
                  className="w-full px-4 py-2 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl font-mono text-[#2D1445]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isRestoring}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {isRestoring ? 'جارٍ الاستعادة...' : 'تأكيد واستعادة البيانات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
