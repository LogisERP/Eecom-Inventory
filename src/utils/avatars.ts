export interface AvatarOption {
  id: string;
  gender: 'male' | 'female';
  label: string;
  url: string;
}

// 5 Male SVG Avatars with distinct styles, colors & backgrounds
export const MALE_AVATARS: AvatarOption[] = [
  {
    id: 'male_1',
    gender: 'male',
    label: 'Male 1 (Classic Blue)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgM1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%232563eb"/><stop offset="100%" stop-color="%231d4ed8"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgM1)"/><path d="M60 22c-12 0-20 8-20 20 0 7 4 14 10 17 2 1 3 3 3 5v4c-14 4-25 14-25 28h64c0-14-11-24-25-28v-4c0-2 1-4 3-5 6-3 10-10 10-17 0-12-8-20-20-20z" fill="%23ffdbac"/><path d="M40 38c0-12 8-18 20-18s20 6 20 18c-5-4-12-5-20-5s-15 1-20 5z" fill="%231e293b"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%230f172a"/><path d="M52 70l8 10 8-10v8l-8 4-8-4v-8z" fill="%23ffffff"/></svg>`
  },
  {
    id: 'male_2',
    gender: 'male',
    label: 'Male 2 (Emerald Hipster)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgM2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgM2)"/><path d="M60 22c-12 0-20 8-20 20 0 7 4 14 10 17 2 1 3 3 3 5v4c-14 4-25 14-25 28h64c0-14-11-24-25-28v-4c0-2 1-4 3-5 6-3 10-10 10-17 0-12-8-20-20-20z" fill="%23f1c27d"/><path d="M38 34c2-12 11-16 22-16s20 4 22 16c-7-6-15-7-22-7s-15 1-22 7z" fill="%23451a03"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23064e3b"/><circle cx="48" cy="46" r="6" stroke="%231e293b" stroke-width="2" fill="none"/><circle cx="72" cy="46" r="6" stroke="%231e293b" stroke-width="2" fill="none"/><path d="M54 46h12" stroke="%231e293b" stroke-width="2"/></svg>`
  },
  {
    id: 'male_3',
    gender: 'male',
    label: 'Male 3 (Indigo Tech)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgM3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%233730a3"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgM3)"/><path d="M60 22c-12 0-20 8-20 20 0 7 4 14 10 17 2 1 3 3 3 5v4c-14 4-25 14-25 28h64c0-14-11-24-25-28v-4c0-2 1-4 3-5 6-3 10-10 10-17 0-12-8-20-20-20z" fill="%23e0ac69"/><path d="M38 30c4-10 13-12 22-12s18 2 22 12c-5-2-13-3-22-3s-17 1-22 3z" fill="%23d97706"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%231e1b4b"/><path d="M54 68c0 4 3 7 6 7s6-3 6-7v-3h-12v3z" fill="%23e0ac69"/></svg>`
  },
  {
    id: 'male_4',
    gender: 'male',
    label: 'Male 4 (Amber Sharp)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgM4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23d97706"/><stop offset="100%" stop-color="%23b45309"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgM4)"/><path d="M60 22c-12 0-20 8-20 20 0 7 4 14 10 17 2 1 3 3 3 5v4c-14 4-25 14-25 28h64c0-14-11-24-25-28v-4c0-2 1-4 3-5 6-3 10-10 10-17 0-12-8-20-20-20z" fill="%23f1c27d"/><path d="M38 38c0-14 10-18 22-18s22 4 22 18c-6-4-14-5-22-5s-16 1-22 5z" fill="%23475569"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23334155"/><path d="M46 54c4 4 14 4 18 0" stroke="%23334155" stroke-width="2" fill="none"/></svg>`
  },
  {
    id: 'male_5',
    gender: 'male',
    label: 'Male 5 (Purple Modern)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgM5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%239333ea"/><stop offset="100%" stop-color="%237e22ce"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgM5)"/><path d="M60 22c-12 0-20 8-20 20 0 7 4 14 10 17 2 1 3 3 3 5v4c-14 4-25 14-25 28h64c0-14-11-24-25-28v-4c0-2 1-4 3-5 6-3 10-10 10-17 0-12-8-20-20-20z" fill="%23ffdbac"/><path d="M36 36c3-12 12-16 24-16s21 4 24 16c-8-4-16-4-24-4s-16 0-24 4z" fill="%230f172a"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23581c87"/><path d="M50 72l10 12 10-12H50z" fill="%23a855f7"/></svg>`
  }
];

// 5 Female SVG Avatars with distinct styles, colors & backgrounds
export const FEMALE_AVATARS: AvatarOption[] = [
  {
    id: 'female_1',
    gender: 'female',
    label: 'Female 1 (Rose Elegant)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgF1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23e11d48"/><stop offset="100%" stop-color="%23be123c"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgF1)"/><path d="M32 40c0-15 12-24 28-24s28 9 28 24v22c0 8-6 14-14 14H46c-8 0-14-6-14-14V40z" fill="%231e293b"/><path d="M60 22c-10 0-18 8-18 18 0 7 4 13 9 16 2 1 3 3 3 5v4c-14 4-24 14-24 28h60c0-14-10-24-24-28v-4c0-2 1-4 3-5 5-3 9-9 9-16 0-10-8-18-18-18z" fill="%23ffdbac"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23881337"/><path d="M48 42c0-8 6-14 12-14s12 6 12 14c-4-4-8-5-12-5s-8 1-12 5z" fill="%230f172a"/></svg>`
  },
  {
    id: 'female_2',
    gender: 'female',
    label: 'Female 2 (Teal Creative)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgF2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230d9488"/><stop offset="100%" stop-color="%230f766e"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgF2)"/><path d="M34 36c0-14 11-22 26-22s26 8 26 22v26H34V36z" fill="%23451a03"/><path d="M60 22c-10 0-18 8-18 18 0 7 4 13 9 16 2 1 3 3 3 5v4c-14 4-24 14-24 28h60c0-14-10-24-24-28v-4c0-2 1-4 3-5 5-3 9-9 9-16 0-10-8-18-18-18z" fill="%23f1c27d"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23134e4a"/><circle cx="48" cy="44" r="5" stroke="%231e293b" stroke-width="2" fill="none"/><circle cx="72" cy="44" r="5" stroke="%231e293b" stroke-width="2" fill="none"/><path d="M53 44h14" stroke="%231e293b" stroke-width="2"/></svg>`
  },
  {
    id: 'female_3',
    gender: 'female',
    label: 'Female 3 (Purple Executive)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgF3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%237c3aed"/><stop offset="100%" stop-color="%236d28d9"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgF3)"/><path d="M30 42c0-16 13-24 30-24s30 8 30 24v28H30V42z" fill="%23312e81"/><path d="M60 22c-10 0-18 8-18 18 0 7 4 13 9 16 2 1 3 3 3 5v4c-14 4-24 14-24 28h60c0-14-10-24-24-28v-4c0-2 1-4 3-5 5-3 9-9 9-16 0-10-8-18-18-18z" fill="%23e0ac69"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%234c1d95"/><path d="M48 40c0-8 6-12 12-12s12 4 12 12c-4-3-8-4-12-4s-8 1-12 4z" fill="%231e1b4b"/></svg>`
  },
  {
    id: 'female_4',
    gender: 'female',
    label: 'Female 4 (Coral Warm)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgF4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ea580c"/><stop offset="100%" stop-color="%23c2410c"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgF4)"/><path d="M32 38c0-15 12-22 28-22s28 7 28 22v30H32V38z" fill="%23d97706"/><path d="M60 22c-10 0-18 8-18 18 0 7 4 13 9 16 2 1 3 3 3 5v4c-14 4-24 14-24 28h60c0-14-10-24-24-28v-4c0-2 1-4 3-5 5-3 9-9 9-16 0-10-8-18-18-18z" fill="%23ffdbac"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%237c2d12"/><path d="M48 52c4 3 12 3 16 0" stroke="%237c2d12" stroke-width="2" fill="none"/></svg>`
  },
  {
    id: 'female_5',
    gender: 'female',
    label: 'Female 5 (Cyan Energetic)',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="bgF5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%230891b2"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(%23bgF5)"/><path d="M36 34c0-14 11-20 24-20s24 6 24 20v24H36V34z" fill="%230f172a"/><path d="M60 22c-10 0-18 8-18 18 0 7 4 13 9 16 2 1 3 3 3 5v4c-14 4-24 14-24 28h60c0-14-10-24-24-28v-4c0-2 1-4 3-5 5-3 9-9 9-16 0-10-8-18-18-18z" fill="%23f1c27d"/><path d="M28 96c3-16 17-26 32-26s29 10 32 26H28z" fill="%23164e63"/><circle cx="60" cy="30" r="6" fill="%2306b6d4"/></svg>`
  }
];

export const ALL_AVATARS: AvatarOption[] = [...MALE_AVATARS, ...FEMALE_AVATARS];

export const DEFAULT_AVATAR = MALE_AVATARS[0].url;

/**
 * Get avatar metadata or fallback default URL
 */
export function getAvatarUrl(url?: string): string {
  if (!url) return DEFAULT_AVATAR;
  // If url matches one of our avatars or data URI or valid URL, return it
  return url;
}
