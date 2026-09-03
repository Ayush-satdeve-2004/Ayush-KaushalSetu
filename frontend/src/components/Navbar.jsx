import React from 'react';
import { ShieldCheck, UserCheck, Building2, GraduationCap, Award, Settings, Sparkles, Wifi, LogOut, User } from 'lucide-react';

export default function Navbar({ currentRole, currentUser, onLogout }) {
  const roleDetailsMap = {
    student: { name: 'Student Portal', icon: UserCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    company: { name: 'Industry / Company Portal', icon: Building2, color: 'text-slate-800 bg-slate-100 border-slate-300' },
    institution: { name: 'Academic Institution Portal', icon: GraduationCap, color: 'text-amber-800 bg-amber-50 border-amber-200' },
    platform: { name: 'Third-Party Skill Platform', icon: Award, color: 'text-teal-800 bg-teal-50 border-teal-200' },
    admin: { name: 'Ministry Oversight Admin', icon: Settings, color: 'text-purple-800 bg-purple-50 border-purple-200' },
  };

  const activeRoleInfo = roleDetailsMap[currentRole] || roleDetailsMap['student'];
  const RoleIcon = activeRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-sm w-full">
      {/* Top Banner for SIH & Ministry of AYUSH Branding */}
      <div className="gradient-ayush text-white px-3 sm:px-4 py-1.5 text-xs font-medium flex flex-wrap justify-between items-center gap-1.5 w-full">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
            SIH Problem Statement SIH26044
          </span>
          <span className="hidden md:inline">Ministry of AYUSH • Government of India</span>
        </div>
        <div className="flex items-center space-x-2 text-emerald-100 text-[11px]">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Engine Active</span>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 w-full">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-ayush flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md shrink-0">
            KS
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                AYUSH <span className="text-emerald-700">KaushalSetu</span>
              </h1>
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              AI-Driven Academia–Industry–Skill Platform
            </p>
          </div>
        </div>

        {/* Active Logged-In Role Portal Display ONLY */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Role Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border font-bold text-[11px] sm:text-xs shadow-sm ${activeRoleInfo.color}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span className="truncate">{activeRoleInfo.name}</span>
          </div>

          {/* User Name Badge & Log Out Action */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-1 px-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800 max-w-[100px] sm:max-w-[140px] truncate">
                {currentUser?.name || 'Logged In'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="bg-white hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center space-x-1 text-[11px]"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
