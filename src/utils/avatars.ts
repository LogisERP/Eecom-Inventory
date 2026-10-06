export interface AvatarOption {
  id: string;
  gender: 'male' | 'female';
  label: string;
  url: string;
}

// 5 Realistic Male Human Portraits
export const MALE_AVATARS: AvatarOption[] = [
  {
    id: 'male_1',
    gender: 'male',
    label: 'Male 1 (Classic Business)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'male_2',
    gender: 'male',
    label: 'Male 2 (Modern Executive)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'male_3',
    gender: 'male',
    label: 'Male 3 (Tech Leader)',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'male_4',
    gender: 'male',
    label: 'Male 4 (Corporate Senior)',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'male_5',
    gender: 'male',
    label: 'Male 5 (Creative Lead)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80'
  }
];

// 5 Realistic Female Human Portraits
export const FEMALE_AVATARS: AvatarOption[] = [
  {
    id: 'female_1',
    gender: 'female',
    label: 'Female 1 (Corporate Manager)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'female_2',
    gender: 'female',
    label: 'Female 2 (Executive Officer)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'female_3',
    gender: 'female',
    label: 'Female 3 (Business Leader)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'female_4',
    gender: 'female',
    label: 'Female 4 (Senior Specialist)',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'female_5',
    gender: 'female',
    label: 'Female 5 (Creative Specialist)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
  }
];

export const ALL_AVATARS: AvatarOption[] = [...MALE_AVATARS, ...FEMALE_AVATARS];

export const DEFAULT_AVATAR = MALE_AVATARS[0].url;

/**
 * Get avatar metadata or fallback default URL
 */
export function getAvatarUrl(url?: string): string {
  if (!url) return DEFAULT_AVATAR;
  return url;
}
