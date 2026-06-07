export type CmsProduct = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  album: string;
  image: string;
  sourceUrl?: string;
  visible: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  brandZh: string;
  brandEn: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  categoriesTitle: string;
  categoriesIntro: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogIntro: string;
  aboutTitle: string;
  aboutText: string;
  contactTitle: string;
  contactIntro: string;
  footerText: string;
  emails: string[];
  whatsapp: string[];
};

export type LayoutSection = {
  id: 'categories' | 'products' | 'benefits' | 'catalog' | 'about' | 'contact';
  label: string;
  visible: boolean;
  order: number;
};

export type LayoutSettings = {
  primaryColor: string;
  accentColor: string;
  catalogColumns: number;
  sections: LayoutSection[];
};

export type Inquiry = {
  id: string;
  name: string;
  contact: string;
  product: string;
  quantity: string;
  message: string;
  source?: string;
  createdAt: string;
};
