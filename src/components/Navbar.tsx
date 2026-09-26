import React, { useState, useRef, useEffect } from 'react';
import { Layers, History, BookOpen, Compass, RefreshCw, ArrowRight, Brain, User, LogOut, LogIn, ChevronDown, Check, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext.js';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onResetData?: () => void;
  onStartPracticeClick?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onResetData,
  onStartPracticeClick,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const { user, logout, loginDemo } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group transition-all shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xs">
            <Brain className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans flex items-center gap-1">
                <span>LLD</span>
                <span className="text-indigo-600">
                  MENTOR
                </span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                AI PLATFORM
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden md:block">
              Interactive System Design Practice
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'home'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('problems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'problems' || currentTab === 'problem-detail'
                ? 'bg-white text-blue-700 shadow-xs font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Problems</span>
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'workspace'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Practice</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'history'
                ? 'bg-white text-amber-700 shadow-xs font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            <span>Attempts</span>
          </button>

          <button
            onClick={() => onNavigate('rubric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'rubric'
                ? 'bg-white text-violet-700 shadow-xs font-semibold border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-violet-500" />
            <span>Rubric</span>
          </button>
        </nav>

        {/* Right Actions: User Profile & Start Practice CTA */}
        <div className="flex items-center gap-2.5">
          {/* User Profile / Login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${user.avatarColor} text-white text-xs font-bold flex items-center justify-center shadow-2xs`}
                >
                  {user.initials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {user.streakDays}d streak
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="text-[10px] font-medium text-indigo-600 mt-0.5">{user.role}</div>
                  </div>

                  <div className="px-2 py-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                      Switch Profile
                    </div>
                    {DEMO_USERS.map(demo => (
                      <button
                        key={demo.id}
                        onClick={() => {
                          loginDemo(demo);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                      >
                        <span className="font-medium truncate">{demo.name}</span>
                        {user.id === demo.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 px-2 pt-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('login');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        onNavigate('login');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen'}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center text-xs cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <Maximize2 className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}

          {/* Reset Demo data helper */}
          {onResetData && (
            <button
              onClick={onResetData}
              title="Reset application demo state"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden lg:flex items-center text-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Glowing CTA Button */}
          <button
            onClick={onStartPracticeClick || (() => onNavigate('problems'))}
            className="btn-primary-glow px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-slate-100 bg-slate-50/90 text-xs font-medium text-slate-600">
        <button
          onClick={() => onNavigate('home')}
          className={`px-2 py-1 rounded-md ${currentTab === 'home' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('problems')}
          className={`px-2 py-1 rounded-md ${currentTab === 'problems' || currentTab === 'problem-detail' ? 'text-blue-600 font-bold' : ''}`}
        >
          Problems
        </button>
        <button
          onClick={() => onNavigate('workspace')}
          className={`px-2 py-1 rounded-md ${currentTab === 'workspace' ? 'text-indigo-600 font-bold' : ''}`}
        >
          Practice
        </button>
        <button
          onClick={() => onNavigate('history')}
          className={`px-2 py-1 rounded-md ${currentTab === 'history' ? 'text-amber-600 font-bold' : ''}`}
        >
          Attempts
        </button>
        <button
          onClick={() => onNavigate('rubric')}
          className={`px-2 py-1 rounded-md ${currentTab === 'rubric' ? 'text-violet-600 font-bold' : ''}`}
        >
          Rubric
        </button>
      </div>
    </header>
  );
};
