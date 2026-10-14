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
  title, searchQuery, setSearchQuery,
  onOpenMobileMenu, currentUser, onLogout, onOpenProfile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarUrl = currentUser?.profilePic || DEFAULT_AVATAR;

  return (
    <header
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-5 pb-4 mb-2 relative z-30"
      style={{
        borderBottom: '1.5px solid var(--border-base)',
        fontFamily: 'var(--font-game)',
      }}
    >
      {/* ── Left: Title + Mobile Menu ─────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2.5 rounded-2xl transition-all shrink-0 cursor-pointer active:scale-95"
            aria-label="Open Navigation Menu"
            style={{
              background: 'var(--clr-primary-lt)',
              border: '1px solid var(--border-base)',
              color: 'var(--clr-primary)',
            }}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo Mark */}
          <div
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl p-1 bg-white shadow-xs shrink-0"
            style={{ border: '1.5px solid var(--border-base)' }}
          >
            <img src="/logo-mark.png" alt="Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-lg md:text-xl font-black tracking-tight whitespace-nowrap"
            style={{ color: 'var(--txt-primary)' }}>
            {title}
          </h1>
        </div>

        {/* Mobile quick profile */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 rounded-full transition-transform active:scale-95"
            style={{ background: 'var(--clr-primary-lt)', border: '1.5px solid var(--border-base)' }}
          >
            <img src={avatarUrl} alt={currentUser?.userName || 'User'}
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
              className="w-8 h-8 rounded-full object-cover" />
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-xl transition-all"
            title="Sign Out"
            style={{ background: 'var(--clr-error-lt)', color: 'var(--clr-error)' }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Right: Search + Actions ───────────────────── */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">

        {/* Search pill */}
        <div
          className="flex items-center gap-2.5 flex-1 sm:w-72 px-4 py-2.5 transition-all"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--border-base)',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Search className="w-4 h-4 shrink-0 stroke-[2.5]" style={{ color: 'var(--clr-primary)' }} />
          <input
            type="text"
            placeholder="Search products, orders, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold w-full"
            style={{ color: 'var(--txt-primary)' }}
            onFocus={(e) => {
              const parent = e.target.parentElement!;
              parent.style.borderColor = 'var(--clr-primary)';
              parent.style.boxShadow = '0 0 0 3px var(--clr-primary-glow)';
            }}
            onBlur={(e) => {
              const parent = e.target.parentElement!;
              parent.style.borderColor = 'var(--border-base)';
              parent.style.boxShadow = 'var(--shadow-sm)';
            }}
          />
        </div>

        {/* Desktop action icons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Bell */}
          <button className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: '#fff', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-primary)'; e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.background = '#fff'; }}
          >
            <Bell className="w-4 h-4" style={{ color: 'var(--txt-secondary)' }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white"
              style={{ background: 'var(--clr-accent)' }} />
          </button>

          {/* Message */}
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: '#fff', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-primary)'; e.currentTarget.style.background = 'var(--clr-primary-lt)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.background = '#fff'; }}
          >
            <MessageSquare className="w-4 h-4" style={{ color: 'var(--txt-secondary)' }} />
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer group transition-all rounded-2xl pl-1.5 pr-3 py-1.5"
              style={{
                background: '#fff',
                border: '1.5px solid var(--border-base)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--clr-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-base)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={currentUser?.userName || 'User'}
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                  className="w-8 h-8 rounded-xl object-cover"
                  style={{ border: '2px solid var(--clr-primary-lt)' }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                  style={{ background: 'var(--clr-success)' }} />
              </div>
              <div className="flex flex-col min-w-0 max-w-[130px]">
                <span className="text-xs font-extrabold truncate" style={{ color: 'var(--txt-primary)' }}>
                  {currentUser?.userName || 'Admin'}
                </span>
                <span className="text-[10px] font-bold flex items-center gap-1 truncate"
                  style={{ color: 'var(--clr-primary)' }}>
                  <Shield className="w-2.5 h-2.5 shrink-0" />
                  {currentUser?.roleName || 'Administrator'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform ml-0.5"
                style={{
                  color: 'var(--txt-muted)',
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                }} />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div
                  className="absolute right-0 mt-2 w-64 p-2 z-50 animate-scale-in"
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--border-base)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {/* User header */}
                  <div className="p-3 rounded-xl mb-1 flex items-center gap-3"
                    style={{ background: 'var(--clr-primary-lt)', border: '1px solid var(--border-base)' }}>
                    <img src={avatarUrl} alt={currentUser?.userName || 'User'}
                      className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold truncate" style={{ color: 'var(--txt-primary)' }}>
                        {currentUser?.userName}
                      </p>
                      <p className="text-[11px] font-medium truncate" style={{ color: 'var(--txt-secondary)' }}>
                        {currentUser?.email}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full mt-1"
                        style={{ background: 'var(--clr-primary)', color: '#fff' }}>
                        {currentUser?.userId || 'USR-1001'} · {currentUser?.roleName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setIsDropdownOpen(false); onOpenProfile(); }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all"
                    style={{ color: 'var(--txt-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-primary-lt)'; e.currentTarget.style.color = 'var(--clr-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-primary)'; }}
                  >
                    <User className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />
                    View & Edit Profile
                  </button>

                  <div className="h-px my-1" style={{ background: 'var(--border-base)' }} />

                  <button
                    onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all"
                    style={{ color: 'var(--clr-error)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-error-lt)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
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
