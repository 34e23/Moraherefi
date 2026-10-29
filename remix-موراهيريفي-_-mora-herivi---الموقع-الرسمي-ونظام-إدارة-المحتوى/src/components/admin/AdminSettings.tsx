/**
 * @license
 * Mora Herivi Admin Site Settings & Identity Manager
 */

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { api } from '../../services/api.js';
import type { WebsiteSettings } from '../../types/index.js';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      setSettings(res);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل إعدادات الموقع' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await api.updateSettings(settings);
      setSettings(res.settings);
      setStatusMessage({ type: 'success', text: 'تم حفظ وتحديث إعدادات الموقع بنجاح!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حفظ الإعدادات' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب إعدادات وهوية الموقع...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إعدادات الموقع العام وهوية العلامة
          </h1>
          <p className="text-xs text-[#705E87]">
            بيانات الاتصال الرسمية، المالك، علاقة التوزيع، وحقوق النشر.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</span>
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
        
        {/* Brand & Corporate Details */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            الجهة المسؤولة وهوية العلامة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                اسم الموقع بالعربية
              </label>
              <input
                type="text"
                required
                value={settings.siteNameAr}
                onChange={(e) => setSettings({ ...settings, siteNameAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                اسم الموقع بالإنجليزية
              </label>
              <input
                type="text"
                required
                value={settings.siteNameEn}
                onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value })}
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                الجهة المالكة للعلامة
              </label>
              <input
                type="text"
                value={settings.brandOwnerAr}
                onChange={(e) => setSettings({ ...settings, brandOwnerAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                جهة التصنيع أو التوزيع
              </label>
              <input
                type="text"
                value={settings.manufacturerOrDistributorAr}
                onChange={(e) => setSettings({ ...settings, manufacturerOrDistributorAr: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                صفة العلاقة الرسمية
              </label>
              <input
                type="text"
                value={settings.distributorRelationship}
                onChange={(e) => setSettings({ ...settings, distributorRelationship: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            معلومات الاتصال المعتمدة بالموقع
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                الهاتف الرسمي المعتمد
              </label>
              <input
                type="text"
                value={settings.officialPhone}
                onChange={(e) => setSettings({ ...settings, officialPhone: e.target.value })}
                placeholder="+20 10 50730409"
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                البريد الإلكتروني (ملغى / غير مفعل)
              </label>
              <input
                type="text"
                value={settings.officialEmail || ''}
                onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                placeholder="ملغى - التواصل عبر الهاتف فقط"
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                رقم خدمة واتساب (شامل المفتاح الدولي)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+201050730409"
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                العنوان والمقر الرسمي
              </label>
              <input
                type="text"
                value={settings.officialAddressAr}
                onChange={(e) => setSettings({ ...settings, officialAddressAr: e.target.value })}
                placeholder="مصر"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <h3 className="text-sm font-bold text-[#2D1445] mb-4">
            حقوق النشر والروابط الاجتماعية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                سنة حقوق النشر
              </label>
              <input
                type="number"
                value={settings.copyrightYear}
                onChange={(e) => setSettings({ ...settings, copyrightYear: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                حساب انستغرام
              </label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                حساب تويتر / X
              </label>
              <input
                type="text"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                dir="ltr"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات المعتمدة'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
