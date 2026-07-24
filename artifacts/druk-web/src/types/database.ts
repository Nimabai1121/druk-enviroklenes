export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface CompanyInfo {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
