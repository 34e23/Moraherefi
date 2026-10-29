/**
 * @license
 * Mora Herivi Admin Contact Inquiries Inbox
 */

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, AlertCircle, X, MessageSquare, Clock } from 'lucide-react';
import { api } from '../../services/api.js';
import type { ContactMessage } from '../../types/index.js';

export const AdminContacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const list = await api.getContacts();
      setMessages(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل الرسائل' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const res = await api.updateContactStatus(id, status);
      setMessages(messages.map((m) => (m.id === id ? res.message : m)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(res.message);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحديث حالة الرسالة' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteContact(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      setStatusMessage({ type: 'success', text: 'تم حذف الرسالة بنجاح' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل حذف الرسالة' });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب صندوق الرسائل والاستفسارات الواردة...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            صندوق رسائل واستفسارات الجمهور
          </h1>
          <p className="text-xs text-[#705E87]">
            الرسائل المرسلة عبر نموذج التواصل بالموقع بعد التحقق الأمني ومكافحة السبام.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E7DBF7] rounded-xl text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-[#2D1445] text-white' : 'text-[#68567F] hover:text-[#2D1445]'
            }`}
          >
            الكل ({messages.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'new' ? 'bg-[#2D1445] text-white' : 'text-[#68567F] hover:text-[#2D1445]'
            }`}
          >
            جديدة ({messages.filter((m) => m.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'read' ? 'bg-[#2D1445] text-white' : 'text-[#68567F] hover:text-[#2D1445]'
            }`}
          >
            مقروءة
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'replied' ? 'bg-[#2D1445] text-white' : 'text-[#68567F] hover:text-[#2D1445]'
            }`}
          >
            تم الرد
          </button>
        </div>
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

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E7DBF7]">
          <MessageSquare className="w-12 h-12 text-[#C4B2E6] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2D1445] mb-1">
            لا توجد رسائل مطابقة
          </h3>
          <p className="text-xs text-[#7B6A93]">
            لم يتم العثور على أي رسائل في هذا التصنيف حالياً.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#F2EBFA]">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'new') handleUpdateStatus(msg.id, 'read');
                }}
                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8FD] transition-colors cursor-pointer ${
                  msg.status === 'new' ? 'bg-[#F9F5FC]' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.status === 'new'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-[#FAF8FD] text-[#86759E] border border-[#EAE0F8]'
                  }`}>
                    <Mail className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-[#2D1445] truncate">
                        {msg.fullName}
                      </span>
                      <span className="text-[11px] text-[#7A6993]">
                        ({msg.email})
                      </span>
                      {msg.status === 'new' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7C3AED] text-white">
                          جديدة
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-[#44335A] truncate mb-0.5">
                      {msg.subject}
                    </h4>

                    <p className="text-xs text-[#705E87] truncate">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                  <span className="font-mono text-[11px] text-[#88789C]">
                    {new Date(msg.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    msg.status === 'new'
                      ? 'bg-purple-100 text-purple-800'
                      : msg.status === 'replied'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {msg.status === 'new' ? 'جديد' : msg.status === 'replied' ? 'تم الرد' : 'مقروء'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف الرسالة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Viewer Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-4">
              تفاصيل استفسار المتواصل
            </h3>

            <div className="space-y-4 mb-6 text-xs">
              <div className="p-4 bg-[#FAF8FD] rounded-2xl border border-[#EDE4F8] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#84739B]">الاسم الكامل:</span>
                  <span className="font-bold text-[#2D1445]">{selectedMessage.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#84739B]">البريد الإلكتروني:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-mono text-[#7C3AED] hover:underline dir-ltr">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex justify-between">
                    <span className="text-[#84739B]">رقم الهاتف:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="font-mono text-[#2D1445] dir-ltr">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#84739B]">تاريخ الإرسال:</span>
                  <span className="font-mono text-[#705E87]">
                    {new Date(selectedMessage.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#2D1445] mb-1">
                  الموضوع: {selectedMessage.subject}
                </h4>
                <div className="p-4 bg-[#FAF8FD] rounded-2xl border border-[#EDE4F8] text-[#44335A] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F0EAF8]">
                <div className="flex items-center gap-2">
                  <span className="text-[#86759E]">تحديث الحالة:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedMessage.status === 'read' ? 'bg-[#2D1445] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    مقروءة
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      selectedMessage.status === 'replied' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    تم الرد
                  </button>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=رد على استفساركم بخصوص موراهيريفي: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-sm"
                >
                  الرد عبر البريد
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
