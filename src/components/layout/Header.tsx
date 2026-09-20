import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  Clock, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  Search,
  Lock
} from 'lucide-react';
import { NavTab, UserRole } from '../../types';

interface HeaderProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenDemoGuide: () => void;
  notificationsCount: number;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenDemoGuide,
  notificationsCount,
  userRole,
  onRoleChange
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleLabels: Record<UserRole, { label: string; agency: string }> = {
    SYSTEM_ADMIN: { label: 'System Admin', agency: 'AEROVIS Cloud Admin' },
    TRANSPORT_AUTHORITY: { label: 'Transport Authority', agency: 'CMTC / MTC Chennai' },
    TRAFFIC_AUTHORITY: { label: 'Traffic Authority', agency: 'Traffic Police Ops' },
    PUBLIC_SAFETY_OFFICER: { label: 'Public Safety Officer', agency: 'RPF & Emergency Desk' },
    ANALYST: { label: 'Intelligence Analyst', agency: 'Urban Planning Analytics' }
  };

  return (
    <header className="h-16 bg-[#0B0D11] border-b border-[#1E222A] px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3 lg:gap-5">
        <button 
          onClick={() => onNavigate('command-center')} 
          className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-[#F97316]/10 border border-[#F97316]/40 flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316]/20 transition-colors">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-wider text-white font-sans">
                AEROVIS
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#171A20] text-gray-400 border border-[#232730]">
                v1.4-edge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden md:block leading-none">
              AI Transportation & Public Safety
            </p>
          </div>
        </button>

        <div className="h-5 w-px bg-[#1E222A] hidden sm:block" />

        {/* Tagline */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
          <span className="text-gray-300 font-semibold">SEE.</span>
          <span className="text-gray-400">UNDERSTAND.</span>
          <span className="text-[#F97316] font-semibold">VERIFY.</span>
          <span className="text-gray-400">RESPOND.</span>
        </div>
      </div>

      {/* Right controls: Demo Guide, Status, Role switcher, Clock, Notifications */}
      <div className="flex items-center gap-2.5 lg:gap-3.5">
        {/* 3-Minute Hackathon Demo Story Guide button */}
        <button
          onClick={onOpenDemoGuide}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#F97316]/10 hover:bg-[#F97316]/20 border border-[#F97316]/30 text-[#F97316] text-xs font-medium transition-all cursor-pointer shadow-sm"
          title="Open 3-Minute Hackathon Demo Storyboard"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">3-Min Demo Guide</span>
        </button>

        {/* Demo Environment Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-[#171A20] border border-[#232730] text-[10px] font-mono text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>DEMO ENVIRONMENT</span>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111318] border border-[#232730] text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="font-mono text-gray-300 text-[11px] font-medium hidden sm:inline">
            SYSTEM OPERATIONAL
          </span>
        </div>

        {/* Live Clock */}
        <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-gray-400 font-mono bg-[#111318] px-2.5 py-1 rounded border border-[#232730]">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{currentTime || '14:02:18 UTC'}</span>
        </div>

        {/* Notifications Icon */}
        <button 
          onClick={() => onNavigate('incident-center')}
          className="relative p-2 rounded hover:bg-[#171A20] text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Active Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F97316]" />
          )}
        </button>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded bg-[#13161D] hover:bg-[#1A1E26] border border-[#232730] text-xs font-mono text-gray-200 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded bg-[#F97316]/20 text-[#F97316] flex items-center justify-center text-[10px] font-bold">
              {userRole[0]}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-[11px] font-semibold text-white leading-tight">
                {roleLabels[userRole].label}
              </span>
              <span className="block text-[9px] text-gray-400 leading-tight">
                {roleLabels[userRole].agency}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
          </button>

          {isRoleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-lg bg-[#111318] border border-[#2A303C] shadow-2xl p-1.5 z-50 text-xs font-mono"
              onClick={() => setIsRoleDropdownOpen(false)}
            >
              <div className="px-2.5 py-1.5 text-[10px] uppercase text-gray-400 border-b border-[#1E222A] font-bold">
                Switch Operational Role
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between hover:bg-[#1A1E26] transition-colors cursor-pointer ${
                    userRole === role ? 'text-[#F97316] bg-[#171A20]' : 'text-gray-300'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{roleLabels[role].label}</span>
                    <span className="block text-[10px] text-gray-400">{roleLabels[role].agency}</span>
                  </div>
                  {userRole === role && <ShieldCheck className="w-4 h-4 text-[#F97316]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
