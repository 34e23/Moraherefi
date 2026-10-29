/**
 * @license
 * Mora Herivi Admin User Accounts & RBAC Manager
 */

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, KeyRound, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';
import { api } from '../../services/api.js';
import type { User, UserRole } from '../../types/index.js';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'content_admin' as UserRole,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const list = await api.getUsers();
      setUsers(list);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحميل قائمة المشرفين' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password.length < 8) {
      setStatusMessage({ type: 'error', text: 'كلمة المرور يجب ألا تقل عن 8 خانات' });
      return;
    }

    try {
      const res = await api.createUser(newUser);
      setUsers([...users, res.user]);
      setShowAddModal(false);
      setNewUser({ username: '', password: '', fullName: '', email: '', role: 'content_admin' });
      setStatusMessage({ type: 'success', text: `تم إنشاء حساب المشرف "${res.user.username}" بنجاح!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل إنشاء المشرف' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'كلمة المرور يجب ألا تقل عن 8 خانات' });
      return;
    }

    try {
      await api.updateUser(passwordModalUser.id, { newPassword });
      setPasswordModalUser(null);
      setNewPassword('');
      setStatusMessage({ type: 'success', text: `تم تحديث كلمة المرور للمشرف "${passwordModalUser.username}" بنجاح!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تحديث كلمة المرور' });
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const res = await api.updateUser(user.id, { isActive: !user.isActive });
      setUsers(users.map((u) => (u.id === user.id ? res.user : u)));
      setStatusMessage({ type: 'success', text: `تم تحديث حالة حساب المشرف "${user.username}"` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'فشل تعديل حالة الحساب' });
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'مدير النظام (Super Admin)';
      case 'content_admin':
        return 'محرر محتوى (Content Admin)';
      case 'read_only_admin':
        return 'مشرف قراءة (Read-Only)';
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#7C3AED] font-semibold animate-pulse">
        جارٍ جلب حسابات المشرفين وصلاحيات الوصول...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEF7]">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2D1445]">
            إدارة المشرفين والصلاحيات (RBAC)
          </h1>
          <p className="text-xs text-[#705E87]">
            التحكم في أدوار المشرفين وحسابات الوصول إلى لوحة تحكم موراهيريفي.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مشرف جديد</span>
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

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E7DBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#FAF8FD] border-b border-[#EAE0F8] text-[#78668E]">
                <th className="p-4 font-semibold">المشرف</th>
                <th className="p-4 font-semibold">اسم المستخدم</th>
                <th className="p-4 font-semibold">الدور والصلاحية</th>
                <th className="p-4 font-semibold">آخر تسجيل دخول</th>
                <th className="p-4 font-semibold">حالة الحساب</th>
                <th className="p-4 font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBFA]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF8FD] transition-colors">
                  <td className="p-4 font-bold text-[#2D1445]">
                    <div>
                      <span>{u.fullName}</span>
                      <span className="block text-[11px] text-[#86759E] font-normal dir-ltr text-right">
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-[#6B32A8]">
                    {u.username}
                  </td>
                  <td className="p-4 font-semibold text-[#2D1445]">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8FD] border border-[#EAE0F8] text-xs">
                      <Shield className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>{getRoleLabel(u.role)}</span>
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-[#78668E]">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('ar-SA') : 'لم يسجل دخول بعد'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.isActive ? 'حساب نشط' : 'معطل مؤقتاً'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setPasswordModalUser(u)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#2D1445] bg-[#FAF8FD] hover:bg-[#F0EAF8] border border-[#E3D6F5] rounded-xl transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>تعيين كلمة مرور</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7DBF7] text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-[#FAF8FD] text-[#55456A] hover:bg-[#F0EAF8]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-[#2D1445] mb-4">
              إضافة مشرف جديد
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="مثال: د. فيصل القحطاني"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    اسم المستخدم (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="editor_faisal"
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="faisal@moraherivi.com"
                    dir="ltr"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  الدور والصلاحية
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl text-[#2D1445]"
                >
                  <option value="content_admin">محرر محتوى (Content Admin - تعديل ونشر المحتوى)</option>
                  <option value="super_admin">مدير نظام كامل (Super Admin - إدارة المشرفين والنسخ)</option>
                  <option value="read_only_admin">مشرف قراءة (Read-Only Admin - اطلاع فقط)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  كلمة المرور (8 خانات على الأقل)
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white text-[#2D1445]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EAF8]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-md"
                >
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModalUser && (
        <div
          className="fixed inset-0 z-50 bg-[#140822]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPasswordModalUser(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-right shadow-2xl border border-[#E7DBF7]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#2D1445] mb-2">
              تعيين كلمة مرور جديدة
            </h3>
            <p className="text-xs text-[#635378] leading-relaxed mb-4">
              تغيير كلمة المرور للمشرف <strong>{passwordModalUser.fullName}</strong> ({passwordModalUser.username}).
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D1445] mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8 خانات على الأقل..."
                  dir="ltr"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8FD] border border-[#E3D6F5] rounded-xl focus:outline-none focus:border-[#7C3AED] text-[#2D1445]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#66547C] hover:bg-[#FAF8FD] rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2D1445] hover:bg-[#3D1C5E] rounded-xl shadow-sm"
                >
                  حفظ كلمة المرور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
