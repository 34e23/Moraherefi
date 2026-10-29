/**
 * @license
 * Mora Herivi Admin Overview & Metrics Component
 */

import React, { useState, useEffect } from 'react';
import {
  Package,
  Leaf,
  FileText,
  Newspaper,
  Inbox,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { api, AdminOverviewResponse } from '../../services/api.js';
import type { AdminTab } from './AdminLayout.js';

interface AdminOverviewProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const res = await api.getOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب إحصائيات النظام ومؤشرات الأداء...
      </div>
    );
  }

  const { stats, recentLogs, productSummary } = data;

  return (
    <div className="space-y-8 text-right max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D1445] mb-1">
          لوحة التحكم والمؤشرات الإدارية
        </h1>
        <p className="text-xs sm:text-sm text-[#705E87]">
          نظرة شاملة على حالة محتوى موقع موراهيريفي، الرسائل الواردة، وسجلات التدقيق والأمان.
        </p>
      </div>

      {/* Label Verification Status Callout */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        stats.isLabelVerified
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          {stats.isLabelVerified ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {stats.isLabelVerified
                ? 'حالة الملصق: معتمد ومطابق رسمياً'
                : 'حالة الملصق: قيد المطابقة والتحقق النهائي'}
            </h4>
            <p className="text-xs opacity-85 mt-0.5">
              {stats.isLabelVerified
                ? 'تم تأكيد جميع المقادير والمكونات وفق العبوة المسجلة الرسمية.'
                : 'البيانات المنشورة تستند إلى المسودة الأولية وتنتظر المطابقة النهائية مع العبوة المادية.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('product')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-black/10 hover:bg-black/5 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          تعديل مواصفات المنتج
        </button>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Ingredients */}
        <div
          onClick={() => onNavigate('ingredients')}
          className="bg-white p-5 rounded-2xl border border-[#E7DBF7] shadow-xs hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86759E]">المكونات الفعالة</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF8FD] text-[#6B32A8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1445] mb-1">
            {stats.totalIngredients}
          </div>
          <div className="text-[11px] text-[#6B32A8]">
            {stats.publishedIngredients} منشورة في الموقع
          </div>
        </div>

        {/* Metric 2: Pages */}
        <div
          onClick={() => onNavigate('pages')}
          className="bg-white p-5 rounded-2xl border border-[#E7DBF7] shadow-xs hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86759E]">الصفحات الثابتة</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF8FD] text-[#6B32A8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1445] mb-1">
            {stats.totalPages}
          </div>
          <div className="text-[11px] text-[#6B32A8]">
            {stats.publishedPages} صفحات منشورة ومفعلة
          </div>
        </div>

        {/* Metric 3: Articles */}
        <div
          onClick={() => onNavigate('articles')}
          className="bg-white p-5 rounded-2xl border border-[#E7DBF7] shadow-xs hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86759E]">المقالات الطبية</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF8FD] text-[#6B32A8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1445] mb-1">
            {stats.totalArticles}
          </div>
          <div className="text-[11px] text-[#6B32A8]">
            {stats.publishedArticles} مقال منشور للجمهور
          </div>
        </div>

        {/* Metric 4: Contact Inquiries */}
        <div
          onClick={() => onNavigate('contacts')}
          className="bg-white p-5 rounded-2xl border border-[#E7DBF7] shadow-xs hover:border-[#7C3AED] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86759E]">الرسائل الواردة</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF8FD] text-[#6B32A8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1445] mb-1">
            {stats.totalMessages}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            {stats.newMessages} رسالة جديدة غير مقروءة
          </div>
        </div>

      </div>

      {/* 2-Column Split: Product Summary & Recent Audit Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Product Quick Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#2D1445]">
                ملخص مواصفات المنتج
              </h3>
              <button
                onClick={() => onNavigate('product')}
                className="text-xs font-semibold text-[#7C3AED] hover:underline"
              >
                تعديل الكل
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8FD] rounded-xl flex items-center justify-between border border-[#EFE8F8]">
                <span className="text-[#84739B]">الاسم الرسمي:</span>
                <span className="font-bold text-[#2D1445]">{productSummary.brandNameAr} ({productSummary.brandNameEn})</span>
              </div>

              <div className="p-3 bg-[#FAF8FD] rounded-xl flex items-center justify-between border border-[#EFE8F8]">
                <span className="text-[#84739B]">حجم العبوة:</span>
                <span className="font-bold text-[#2D1445]">{productSummary.volume}</span>
              </div>

              <div className="p-3 bg-[#FAF8FD] rounded-xl flex items-center justify-between border border-[#EFE8F8]">
                <span className="text-[#84739B]">النكهة:</span>
                <span className="font-bold text-[#2D1445]">{productSummary.flavorAr}</span>
              </div>

              <div className="p-3 bg-[#FAF8FD] rounded-xl flex items-center justify-between border border-[#EFE8F8]">
                <span className="text-[#84739B]">آخر تحديث للمواصفات:</span>
                <span className="font-bold text-[#2D1445] font-mono text-[11px]">
                  {new Date(stats.productLastUpdated).toLocaleString('ar-SA')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2EBFA] flex items-center justify-between text-xs">
            <span className="text-[#86759E]">المشرفون النشطون: {stats.totalUsers}</span>
            <button
              onClick={() => onNavigate('backup')}
              className="text-[#6B32A8] font-semibold hover:underline"
            >
              النسخ الاحتياطي
            </button>
          </div>
        </div>

        {/* Recent Audit Activity Log (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E7DBF7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-base font-bold text-[#2D1445]">
                سجل الأنشطة والأمان الأخير
              </h3>
            </div>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs font-semibold text-[#7C3AED] hover:underline"
            >
              عرض السجل الكامل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-[#F0EAF8] text-[#86759E]">
                  <th className="pb-2 font-medium">الوقت</th>
                  <th className="pb-2 font-medium">المستخدم</th>
                  <th className="pb-2 font-medium">الإجراء</th>
                  <th className="pb-2 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFFC]">
                {recentLogs.slice(0, 6).map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8FD]">
                    <td className="py-2.5 font-mono text-[11px] text-[#7A6993]">
                      {new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 font-semibold text-[#2D1445]">
                      {log.username}
                    </td>
                    <td className="py-2.5 text-[#54436A] max-w-xs truncate" title={log.details}>
                      {log.action}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : log.status === 'failure'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {log.status === 'success' ? 'ناجح' : log.status === 'failure' ? 'فشل' : 'تنبيه'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
