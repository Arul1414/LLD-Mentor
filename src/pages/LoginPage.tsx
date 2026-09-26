import React, { useState } from 'react';
import { useAuth, DEMO_USERS, UserProfile } from '../context/AuthContext.js';
import { Brain, Lock, Mail, ArrowRight, CheckCircle2, Shield, Eye, EyeOff, User, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const { login, loginDemo, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your work or personal email address.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      login(email);
      setIsLoading(false);
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        onLoginSuccess();
      }, 600);
    }, 400);
  };

  const handleQuickDemoSelect = (selectedUser: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      loginDemo(selectedUser);
      setIsLoading(false);
      setSuccessMsg(`Welcome back, ${selectedUser.name}!`);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    }, 250);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-600 mb-2">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to LLD Mentor
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Interactive low-level design practice with explainable, evidence-grounded AI reviews.
          </p>
        </div>

        {/* Main Card */}
        <div className="saas-card p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full saas-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={e => {
                    e.preventDefault();
                    alert('Demo Mode: You can sign in with any email or use the one-click demo profiles below!');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full saas-input pl-10 pr-10 py-2.5 text-sm placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary-glow py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">
                Or quick test with demo profiles
              </span>
            </div>
          </div>

          {/* Quick Demo Profile Switcher */}
          <div className="space-y-2">
            {DEMO_USERS.map(demoUser => (
              <button
                key={demoUser.id}
                type="button"
                onClick={() => handleQuickDemoSelect(demoUser)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${demoUser.avatarColor} text-white text-xs font-bold flex items-center justify-center shadow-xs`}
                  >
                    {demoUser.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {demoUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {demoUser.role} · {demoUser.streakDays}d streak
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                  Select →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-2 text-xs text-slate-500">
          <p>
            No registration needed. Sessions persist locally on your client.
          </p>
          <button
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900 font-medium underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
