import React from 'react';
import { Search, Bell, MessageSquare, Menu, LogOut, Shield } from 'lucide-react';
import type { UserItem } from '../types/people';
import { DEFAULT_AVATAR } from '../utils/avatars';

interface TopHeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
  currentUser: UserItem | null;
  onLogout: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  currentUser,
  onLogout,
}) => {
  const avatarUrl = currentUser?.profilePic || DEFAULT_AVATAR;

  return (
    <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6 pb-4 mb-4 border-b border-slate-200/70">

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

        {/* Search pill */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 sm:py-2 border border-slate-200/60 flex-1 sm:w-56 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Product...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-700 font-medium placeholder-slate-400 w-full"
          />
        </div>

        {/* Action icons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
          </button>

          <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <MessageSquare className="w-4 h-4 text-slate-600" />
          </button>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5 bg-white rounded-full pl-1 pr-3 py-1 border border-slate-200/80 hover:shadow-sm transition-all">
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
            <div className="flex flex-col min-w-0 max-w-[140px]">
              <span className="text-xs font-extrabold text-slate-800 leading-tight truncate">
                {currentUser?.userName || 'Varatharajan R'}
              </span>
              <span className="text-[10px] text-blue-600 font-bold leading-tight flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                {currentUser?.roleName || 'Administrator'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="ml-1 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

