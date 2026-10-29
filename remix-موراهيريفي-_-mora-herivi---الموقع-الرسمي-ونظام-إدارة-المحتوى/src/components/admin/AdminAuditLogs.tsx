/**
 * @license
 * Mora Herivi Admin Security & Audit Activity Logs
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api.js';
import type { AuditLogEntry } from '../../types/index.js';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('');

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAuditLogs(filterAction);
      setLogs(res.logs);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            سجلات الأمان والأنشطة الإدارية (Audit Logs)
          </h1>
          <p className="text-xs text-[#705E87]">
            توثيق رقمي فوري لجميع عمليات تسجيل الدخول، تعديل ونشر المحتوى، وإدارة النسخ الاحتياطية.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#2D1445] bg-white border border-[#E3D6F5] rounded-xl hover:bg-[#FAF8FD] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>تحديث السجلات</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7DBF7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-xs font-semibold text-[#2D1445]">تصفية الإجراء:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445] focus:outline-none"
          >
            <option value="">جميع العمليات</option>
            <option value="LOGIN">تسجيل الدخول (LOGIN)</option>
            <option value="UPDATE">تعديل المحتوى (UPDATE)</option>
            <option value="CREATE">إنشاء محتوى (CREATE)</option>
            <option value="DELETE">حذف محتوى (DELETE)</option>
            <option value="BACKUP">النسخ والاستعادة (BACKUP)</option>
          </select>
        </div>

        <div className="text-xs text-[#86759E]">
          إجمالي السجلات المعروضة: {logs.length}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#FAF8FD] border-b border-[#EAE0F8] text-[#78668E]">
                <th className="p-4 font-semibold">التوقيت والتاريخ</th>
                <th className="p-4 font-semibold">المشرف</th>
                <th className="p-4 font-semibold">نوع العملية</th>
                <th className="p-4 font-semibold">عنوان IP</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">تفاصيل العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBFA]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8FD] transition-colors">
                  <td className="p-4 font-mono text-[11px] text-[#7A6993] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('ar-SA')}
                  </td>
                  <td className="p-4 font-bold text-[#2D1445] whitespace-nowrap">
                    {log.username}
                  </td>
                  <td className="p-4 font-mono font-semibold text-[#6B32A8] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#86759E] dir-ltr text-right">
                    {log.ipAddress}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                      log.status === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : log.status === 'failure'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {log.status === 'success' ? 'ناجحة' : log.status === 'failure' ? 'فاشلة' : 'تحذير'}
                    </span>
                  </td>
                  <td className="p-4 text-[#594770] max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
