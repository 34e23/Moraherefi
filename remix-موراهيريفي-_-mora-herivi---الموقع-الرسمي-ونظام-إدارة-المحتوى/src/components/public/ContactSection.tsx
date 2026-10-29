/**
 * @license
 * Mora Herivi Official Contact Section with Anti-Spam Protection
 */

import React, { useState } from 'react';
import { Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api.js';
import type { WebsiteSettings } from '../../types/index.js';

interface ContactSectionProps {
  settings: WebsiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    subject: '',
    message: '',
    website_fax_honey: '', // Anti-spam honeypot (must remain empty)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await api.sendContactMessage(formData);
      setSuccessMessage(res.message);
      setFormData({
        fullName: '',
        phone: '',
        subject: '',
        message: '',
        website_fax_honey: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر إرسال الرسالة، يرجى التحقق من المدخلات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayPhone = settings.officialPhone || '+20 10 50730409';
  const cleanPhoneTel = displayPhone.replace(/[^0-9+]/g, '');
  const displayAddress = settings.officialAddressAr || 'مصر';

  return (
    <section id="contact" className="py-20 bg-[#FAF8FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#7C3AED] mb-2 tracking-wide">
            قنوات الاتصال المعتمدة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2D1445] tracking-tight mb-4">
            تواصل مع فريق {settings.siteNameAr}
          </h2>
          <p className="text-sm sm:text-base text-[#615175] leading-relaxed">
            يسعدنا استقبال استفساراتكم الطبية أو الإدارية أو التجارية وملاحظاتكم عبر القنوات الرسمية المعتمدة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Information & Channels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-right">
            <div>
              <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-6">
                معلومات الاتصال المباشرة
              </h3>

              <div className="space-y-6 mb-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E7DBF7] text-[#6B32A8] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#86759E] mb-0.5">الهاتف الرسمي المعتمد</span>
                    <a
                      href={`tel:${cleanPhoneTel}`}
                      className="text-sm font-semibold text-[#2D1445] hover:text-[#7C3AED] transition-colors dir-ltr font-mono inline-block"
                    >
                      {displayPhone}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E7DBF7] text-[#6B32A8] flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-[#86759E] mb-0.5">المقر والعنوان</span>
                    <span className="text-sm font-semibold text-[#2D1445]">
                      {displayAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct action */}
              <div className="p-4 bg-white rounded-2xl border border-[#E4D9F5] mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-[#2D1445]">خدمة العملاء عبر واتساب</span>
                    <span className="text-[11px] text-[#86759E]">محادثة واستجابة سريعة للاستفسارات</span>
                  </div>
                  <a
                    href="https://wa.me/201050730409"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                  >
                    محادثة فورية
                  </a>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#88789C] pt-4 border-t border-[#E8DEF7]">
              ساعات العمل الرسمية: طوال أيام الأسبوع من 9:00 صباحاً حتى 9:00 مساءً.
            </div>
          </div>

          {/* Contact Inquiry Form with Anti-Spam (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DBF7] shadow-sm text-right">
            
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-[#6B32A8]" />
              <h3 className="text-xl font-bold font-serif text-[#2D1445]">
                نموذج الاستفسار والمراسلة الرسمية
              </h3>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Anti-spam honeypot input (hidden from legitimate users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_fax_honey">Fax verification</label>
                <input
                  type="text"
                  id="website_fax_honey"
                  name="website_fax_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_fax_honey}
                  onChange={(e) => setFormData({ ...formData, website_fax_honey: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact_fullname" className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact_fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="مثال: د. عبد الله السعيد"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                  />
                </div>

                <div>
                  <label htmlFor="contact_phone" className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    رقم الهاتف للتواصل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact_phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 10 50730409"
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact_subject" className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  موضوع الاستفسار
                </label>
                <input
                  id="contact_subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="استفسار عن التوافر بالصيدليات أو طريقة الاستعمال"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label htmlFor="contact_message" className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  تفاصيل الاستفسار أو الرسالة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact_message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب استفسارك هنا بالتفصيل (10 أحرف على الأقل)..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#86759E]">
                  يتم التحقق من الرسائل وحمايتها تلقائياً ضد البريد العشوائي.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
