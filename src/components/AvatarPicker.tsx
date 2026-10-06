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
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-4">
      {/* Label and Gender Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Choose Profile Avatar <span className="text-rose-500">*</span>
        </label>

        {/* Male / Female Segmented Control */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('male')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'male'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Male (5)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('female')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'female'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
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
              className={`relative group flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all border-2 cursor-pointer ${
                isSelected
                  ? activeTab === 'male'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                    : 'border-rose-600 bg-rose-50/80 shadow-md ring-2 ring-rose-500/20'
                  : 'border-transparent bg-white hover:bg-slate-100 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <img
                  src={avatar.url}
                  alt={avatar.label}
                  className="w-full h-full rounded-2xl object-cover shadow-inner"
                />

                {isSelected && (
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center shadow-md animate-scale-in ${
                      activeTab === 'male' ? 'bg-blue-600' : 'bg-rose-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] font-bold truncate max-w-full ${
                  isSelected
                    ? activeTab === 'male'
                      ? 'text-blue-700'
                      : 'text-rose-700'
                    : 'text-slate-600'
                }`}
              >
                {avatar.label.split(' ')[0]} {avatar.label.split(' ')[1]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-2">
        <span>Click to select avatar (Male 1-5 or Female 1-5)</span>
        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-wider">
          {activeTab === 'male' ? '5 Male Options' : '5 Female Options'}
        </span>
      </div>
    </div>
  );
};
