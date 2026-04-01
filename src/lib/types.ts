export const View = {
  LOGIN: 'LOGIN',
  DASHBOARD: 'DASHBOARD',
  CATEGORY_DETAIL: 'CATEGORY_DETAIL',
  ADMIN: 'ADMIN',
} as const;

export type View = typeof View[keyof typeof View];

export interface AppUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  status: 'active' | 'inactive';
}

export interface Resource {
  label: string;
  url: string;
}

export interface Video {
  id: string;
  category_id?: string;
  title: string;
  vimeoId?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  bulletPoints?: string[];
  resources?: Resource[];
}

export interface CategoryContent {
  id: string;
  title: string;
  emoji: string;
  image?: string;
  description: string;
  isComingSoon?: boolean;
  videos?: Video[];
}
