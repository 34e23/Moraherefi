/**
 * @license
 * Mora Herivi Admin Login & Initial Setup Screen
 */

import React, { useState, useEffect } from 'react';
import { Lock, Shield, UserCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface AdminLoginProps {
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { login, setupInitialAdmin } = useAuth();
  
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Setup form state
  const [setupFullName, setSetupFullName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await api.getSetupStatus();
      setIsSetupMode(!res.initialized);
    } catch {
      setIsSetupMode(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(username, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'بيانات الدخول غير صحيحة. يرجى المحاولة مجدداً.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('يجب ألا تقل كلمة المرور عن 8 خانات.');
      setIsLoading(false);
      return;
    }

    try {
      await setupInitialAdmin({
        username,
        password,
        fullName: setupFullName,
        email: setupEmail,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل إعداد الحساب الإداري الأولي.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex items-center justify-center p-4">
        <div className="text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
          جارٍ التحقق من إعدادات الأمان ونظام المصادقة...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Bar Return Button */}
      <div className="max-w-md w-full mx-auto px-4 mb-6 flex justify-between items-center">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B32A8] hover:text-[#2D1445] transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الموقع العام</span>
        </button>

        <span className="text-[11px] text-[#86759E]">
          بوابة الإدارة المشفرة
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo and Brand Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#2D1445]/15 border border-[#E4D7F5] overflow-hidden">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_2stynd2stynd2sty_570d7d80.jpg"
              alt="شعار موراهيريفي Moraherefi"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#2D1445]">
            {isSetupMode ? 'التهيئة الأولية لنظام الإدارة' : 'لوحة تحكم موراهيريفي'}
          </h2>
          <p className="mt-1 text-xs text-[#6E5D85]">
            {isSetupMode
              ? 'لم يتم إنشاء أي مشرف بعد. قم بإنشاء حساب المشرف الرئيسي (Super Admin).'
              : 'منظومة إدارة المحتوى ومواصفات المنتج المحمية والمشفرة'}
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg shadow-[#2D1445]/5 rounded-3xl border border-[#E7DBF7] text-right">
          
          {/* Error Notification */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSetupMode ? (
            /* Initial Setup Form */
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="p-3 bg-[#FAF8FD] border border-[#E9DFFA] rounded-xl text-xs text-[#604E78] mb-4">
                <strong>تنبيه الأمان:</strong> يتم تفعيل هذا النموذج مرة واحدة فقط عند التهيئة الأولى للنظام، ويُغلق بعدها نهائياً.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  اسم المشرف الكامل
                </label>
                <input
                  type="text"
                  required
                  value={setupFullName}
                  onChange={(e) => setSetupFullName(e.target.value)}
                  placeholder="مثال: مسؤول إدارة المحتوى"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  اسم المستخدم (Username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_mora"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  البريد الإلكتروني الرسمي
                </label>
                <input
                  type="email"
                  required
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="admin@moraherivi.com"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  كلمة المرور (8 خانات على الأقل)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'جارٍ تهيئة المشرف...' : 'إنشاء حساب المشرف والدخول'}</span>
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ادخل اسم المستخدم"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all text-[#2D1445]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#86759E] pt-1">
                <span>جلسة مشفرة بنظام HttpOnly و SameSite</span>
                <span className="flex items-center gap-1 text-[#6B32A8]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>محمي من التخمين</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoading ? 'جارٍ التحقق...' : 'تسجيل الدخول إلى لوحة التحكم'}</span>
              </button>

              <div className="pt-2 text-[11px] text-[#86759E] text-center">
                يقتصر الوصول على المشرفين المصرح لهم فقط
              </div>
            </form>
          )}

        </div>

        {/* Security Notice Footer */}
        <div className="mt-8 text-center text-[11px] text-[#9A8AA8]">
          يخضع هذا النظام لسياسات الأمان الدوائية والتدقيق الرقمي. يتم تسجيل جميع محاولات الدخول.
        </div>

      </div>
    </div>
  );
};
