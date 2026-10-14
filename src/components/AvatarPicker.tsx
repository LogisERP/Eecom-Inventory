import React, { useState } from 'react';
import { MALE_AVATARS, FEMALE_AVATARS } from '../utils/avatars';
import type { AvatarOption } from '../utils/avatars';
import { Check, User, Sparkles } from 'lucide-react';

interface AvatarPickerProps {
  selectedUrl: string;
  onSelectAvatar: (url: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedUrl, onSelectAvatar }) => {
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');

  const currentAvatars = activeTab === 'male' ? MALE_AVATARS : FEMALE_AVATARS;

  return (
    <div
      className="p-4 flex flex-col gap-4"
      style={{
        background: '#FAF9FF',
        border: '1.5px solid var(--border-base)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      {/* Label and Gender Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Choose Profile Avatar <span className="text-rose-500">*</span>
        </label>

        {/* Male / Female Segmented Control */}
        <div
          className="flex items-center p-1 gap-1"
          style={{
            background: 'var(--clr-primary-lt)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-base)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('male')}
            className="px-3.5 py-1 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: activeTab === 'male' ? 'var(--grad-primary)' : 'transparent',
              color: activeTab === 'male' ? '#FFFFFF' : 'var(--text-muted)',
              boxShadow: activeTab === 'male' ? '0 2px 6px rgba(112, 67, 245, 0.3)' : 'none',
            }}
          >
            <User className="w-3.5 h-3.5" />
            Male (5)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('female')}
            className="px-3.5 py-1 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: activeTab === 'female' ? 'var(--grad-accent)' : 'transparent',
              color: activeTab === 'female' ? '#FFFFFF' : 'var(--text-muted)',
              boxShadow: activeTab === 'female' ? '0 2px 6px rgba(255, 107, 107, 0.3)' : 'none',
            }}
          >
            <User className="w-3.5 h-3.5" />
            Female (5)
          </button>
        </div>
      </div>

      {/* Grid of 5 Avatars */}
      <div className="grid grid-cols-5 gap-3 pt-1">
        {currentAvatars.map((avatar: AvatarOption) => {
          const isSelected = selectedUrl === avatar.url;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.url)}
              className="relative group flex flex-col items-center gap-1.5 p-2 transition-all cursor-pointer active:scale-95"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--clr-primary)' : '2px solid transparent',
                background: isSelected ? 'var(--clr-primary-lt)' : '#FFFFFF',
                boxShadow: isSelected ? '0 4px 12px rgba(112,67,245,0.2)' : 'var(--shadow-sm)',
              }}
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <img
                  src={avatar.url}
                  alt={avatar.label}
                  className="w-full h-full object-cover shadow-inner"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />

                {isSelected && (
                  <div
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white flex items-center justify-center shadow-md animate-scale-in"
                    style={{
                      background: activeTab === 'male' ? 'var(--grad-primary)' : 'var(--grad-accent)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <span
                className="text-[10px] font-black truncate max-w-full"
                style={{
                  color: isSelected ? 'var(--clr-primary)' : 'var(--text-muted)',
                }}
              >
                {avatar.label.split(' ')[0]} {avatar.label.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="text-[11px] font-semibold text-slate-500 flex items-center justify-between border-t pt-2"
        style={{ borderColor: 'var(--border-base)' }}
      >
        <span>Tap to pick your avatar</span>
        <span
          className="font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5"
          style={{
            background: 'var(--clr-primary-lt)',
            color: 'var(--clr-primary)',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {activeTab === 'male' ? '5 Male Styles' : '5 Female Styles'}
        </span>
      </div>
    </div>
  );
};
