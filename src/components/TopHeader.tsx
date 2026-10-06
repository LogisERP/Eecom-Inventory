import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Menu, LogOut, Shield, User, ChevronDown } from 'lucide-react';
import type { UserItem } from '../types/people';
import { DEFAULT_AVATAR } from '../utils/avatars';

interface TopHeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
  currentUser: UserItem | null;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  currentUser,
  onLogout,
  onOpenProfile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarUrl = currentUser?.profilePic || DEFAULT_AVATAR;

  return (
    <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6 pb-4 mb-4 border-b border-slate-200/70 relative z-30">

      {/* Title & Mobile Menu Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">
            {title}
          </h1>
        </div>

        {/* Mobile quick profile icon */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 active:scale-95 transition-transform"
          >
            <img
              src={avatarUrl}
              alt={currentUser?.userName || 'User'}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = DEFAULT_AVATAR;
              }}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          </button>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">

        {/* High Contrast Prominent Search Bar */}
        <div className="flex items-center gap-2.5 bg-white rounded-full px-4 py-2 border-2 border-slate-300/90 flex-1 sm:w-64 focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:border-blue-600 shadow-xs hover:border-slate-400 transition-all">
          <Search className="w-4 h-4 text-blue-600 shrink-0 font-extrabold" />
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-900 font-bold placeholder:text-slate-500 placeholder:font-medium w-full"
          />
        </div>

        {/* Action icons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-xs">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
          </button>

          <button className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-xs">
            <MessageSquare className="w-4 h-4 text-slate-600" />
          </button>

          {/* Premium UI User Profile Card Dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 bg-white rounded-full pl-1.5 pr-3.5 py-1.5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group shadow-xs"
            >
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={currentUser?.userName || 'User'}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null;
                    img.src = DEFAULT_AVATAR;
                  }}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="flex flex-col min-w-0 max-w-[140px]">
                <span className="text-xs font-extrabold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                  {currentUser?.userName || 'Varatharajan R'}
                </span>
                <span className="text-[10px] text-blue-600 font-bold leading-tight flex items-center gap-1 truncate mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                  {currentUser?.roleName || 'Administrator'}
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-scale-in">
                  
                  {/* Quick User Header */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-1 flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt={currentUser?.userName || 'User'}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 truncate">{currentUser?.userName}</p>
                      <p className="text-[11px] font-medium text-slate-500 truncate">{currentUser?.email}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded mt-1">
                        {currentUser?.userId || 'USR-1001'} • {currentUser?.roleName}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>View & Edit Profile</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/70 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>

                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

