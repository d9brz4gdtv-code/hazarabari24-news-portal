import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import {
  loginAdmin,
  resetAdminPassword,
  getBengaliAuthError,
  DESIGNATED_ADMIN,
} from '../services/authService';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onSuccess: (admin: AdminUser) => void;
  onBackToHome: () => void;
}

type AuthMode = 'signin' | 'forgot';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToHome }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  // Auto-fill disabled: fields start empty as requested
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [noticeMsg, setNoticeMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNoticeMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Guard: strictly block unauthorized accounts from logging in or resetting
      if (cleanEmail !== DESIGNATED_ADMIN.email.toLowerCase()) {
        throw new Error(
          'প্রবেশাধিকার সংরক্ষিত! শুধুমাত্র প্রধান সম্পাদক (ibrahimsm652@gmail.com) এর জন্য এই প্যানেল। নতুন কোনো অ্যাকাউন্ট খোলার অনুমতি নেই।'
        );
      }

      if (mode === 'forgot') {
        await resetAdminPassword(cleanEmail);
        setNoticeMsg(`আপনার ইমেইল (${cleanEmail}) এ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।`);
        setMode('signin');
        return;
      }

      // Sign In only
      const adminUser = await loginAdmin(cleanEmail, password);
      onSuccess(adminUser);
    } catch (err: any) {
      console.error('Auth error:', err);
      const code = err?.code || '';
      setErrorMsg(
        getBengaliAuthError(code) ||
          err.message ||
          'লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-[#eef2f6] to-slate-200 flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-4 sm:mb-6">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 bg-white/80 hover:bg-white backdrop-blur px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল সংবাদপত্রে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="font-serif-bn font-bold text-slate-700">হাজরাবাড়ী২৪.কম</span>
        </div>
      </header>

      {/* Main Split Card (Exact style requested: White Form + Royal Blue Hero Panel) */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 my-auto grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        
        {/* ==================== LEFT / MAIN FORM AREA (7 Cols on desktop) ==================== */}
        <div className="md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          
          {/* Security Notice: Registration strictly closed */}
          <div className="mb-4 py-2 px-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-[11px] text-amber-900 font-medium shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>নিরাপত্তা লক: নতুন অ্যাডমিন রেজিস্ট্রেশন স্থায়ীভাবে বন্ধ রাখা হয়েছে।</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Sign In' : 'Reset Password'}
            </h2>
            <p className="text-xs text-slate-500 font-serif-bn mt-1.5">
              {mode === 'signin'
                ? 'হাজরাবাড়ী২৪ সম্পাদকীয় ড্যাশবোর্ডে প্রবেশ করুন'
                : 'পাসওয়ার্ড পুনরুদ্ধারের জন্য অনুমোদিত ইমেইল দিন'}
            </p>

            {/* Social Circle Icons (from the reference UI mockup: Facebook, Google+, LinkedIn) */}
            <div className="flex items-center justify-center gap-3 my-4">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs group"
                title="Facebook"
              >
                <span className="font-bold text-sm leading-none group-hover:scale-110 transition-transform font-serif">f</span>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-500 hover:bg-red-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs group"
                title="Google"
              >
                <span className="font-bold text-xs leading-none group-hover:scale-110 transition-transform">G+</span>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-700 hover:bg-blue-50/50 flex items-center justify-center transition-all cursor-pointer shadow-2xs group"
                title="LinkedIn"
              >
                <span className="font-bold text-xs leading-none group-hover:scale-110 transition-transform font-sans">in</span>
              </button>
            </div>

            <p className="text-[12px] text-slate-400 font-light">
              {mode === 'signin' ? 'or use your admin email' : 'enter registered admin email'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {noticeMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{noticeMsg}</span>
            </div>
          )}

          {/* Actual Form - Autocomplete disabled */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-3.5"
          >
            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ইমেইল (Email)"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f4f6] hover:bg-[#eef0f4] focus:bg-white border border-transparent focus:border-blue-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড (Password)"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="w-full pl-10 pr-10 py-3 bg-[#f3f4f6] hover:bg-[#eef0f4] focus:bg-white border border-transparent focus:border-blue-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMsg('');
                    setNoticeMsg('');
                  }}
                  className="text-xs text-slate-500 hover:text-blue-700 transition-colors cursor-pointer tracking-tight"
                >
                  Forgot your password? (পাসওয়ার্ড ভুলে গেছেন?)
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                    setNoticeMsg('');
                  }}
                  className="text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  ← সাইন ইন এ ফিরে যান
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-auto min-w-[180px] px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>প্রক্রিয়াধীন...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'SIGN IN' : 'SEND LINK'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ==================== RIGHT / HERO PANEL (5 Cols on desktop - Royal Blue) ==================== */}
        <div className="relative md:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white p-8 sm:p-10 md:p-12 flex flex-col justify-center items-center text-center overflow-hidden">
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xs flex flex-col items-center">
            {/* Electric Border Container for হাজরাবাড়ী২৪ */}
            <div className="electric-border-box mb-5 w-full max-w-[290px] shadow-2xl">
              <div className="bg-gradient-to-b from-[#0b1f4c]/90 to-[#0e2a6d]/90 backdrop-blur-md px-5 py-3.5 rounded-[1.1rem] border border-cyan-400/50 text-center shadow-inner flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 text-cyan-300 text-[10px] font-bold tracking-widest uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  <span>অনলাইন নিউজ পোর্টাল</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-[38px] font-black tracking-normal font-serif-bn text-white electric-glow-text leading-tight drop-shadow-md">
                  হাজরাবাড়ী২৪
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-cyan-200/90 font-medium">
                  <span>মেলান্দহ</span>
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  <span>জামালপুর</span>
                </div>
              </div>
            </div>

            {/* Locked Access Badge & Explainer */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center my-2 w-full shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>প্রবেশাধিকার সংরক্ষিত</span>
              </div>
              <p className="text-xs text-blue-100 font-serif-bn leading-relaxed">
                নতুন কোনো অ্যাডমিন অ্যাকাউন্ট খোলার সুযোগ সম্পূর্ণ বন্ধ। শুধুমাত্র অনুমোদিত প্রধান সম্পাদক এই প্যানেলে প্রবেশ করতে পারবেন।
              </p>
            </div>

            {/* Bottom mini status badge */}
            <div className="mt-6 pt-4 border-t border-white/15 w-full flex items-center justify-center gap-1.5 text-[11px] text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>নিরাপদ এনক্রিপ্টেড অ্যাডমিন অ্যাক্সেস</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl text-center text-[11px] text-slate-500 mt-4 sm:mt-6">
        হাজরাবাড়ী২৪.কম © {new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত। মেলান্দহ, জামালপুর।
      </footer>
    </div>
  );
};
