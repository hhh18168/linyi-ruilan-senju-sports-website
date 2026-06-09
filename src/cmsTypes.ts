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
  translations?: Record<string, ProductTranslation>;
  prices?: ProductPrices;
  galleryImages?: string[];
  galleryLabels?: string[];
  specs?: ProductSpec[];
  detailSections?: ProductDetailSection[];
};

export type ProductTranslation = {
  name?: string;
  category?: string;
  album?: string;
  description?: string;
  scenario?: string;
  highlights?: string[];
};

export type ProductPrices = {
  baseCurrency: CurrencyCode;
  basePrice: number;
  priceUnit?: string;
};

export type CurrencyCode = 'USD' | 'CNY' | 'EUR' | 'JPY' | 'KRW' | 'VND' | 'IDR' | 'GBP' | 'TRY' | 'RUB';

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetailSection = {
  title: string;
  body: string;
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
  id: string;
  type?: PageModuleType;
  label: string;
  visible: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundColor?: string;
  columns?: number;
};

export type PageModuleType =
  | 'hero'
  | 'category-nav'
  | 'product-grid'
  | 'image-text'
  | 'benefits'
  | 'faq'
  | 'contact'
  | 'rich-text';

export type LayoutSettings = {
  primaryColor: string;
  accentColor: string;
  catalogColumns: number;
  sections: LayoutSection[];
};

export type ExchangeRates = {
  baseCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
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
