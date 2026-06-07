import type { CmsProduct, LayoutSettings, SiteSettings } from './cmsTypes';
import { yupooProducts } from './yupooProducts';

export const defaultSiteSettings: SiteSettings = {
  brandZh: '临沂瑞澜森炬',
  brandEn: 'Linyi Ruilan Senju',
  tagline: 'SPORTING GOODS',
  heroBadge: 'Football, volleyball, basketball, tennis, cricket, badminton and teamwear supply',
  heroTitle: 'Linyi Ruilan Senju',
  heroSubtitle:
    'A sports goods supplier for schools, clubs, retailers and event organizers, covering balls, rackets, sports bags, T-shirts and team purchasing needs.',
  categoriesTitle: 'Core Sports Goods',
  categoriesIntro: 'Products are organized for training, competitions, school sourcing and team customization.',
  catalogEyebrow: 'Product Catalog',
  catalogTitle: '商品目录',
  catalogIntro: 'Browse selected product images and models. Each item can be selected for inquiry through the contact form.',
  aboutTitle: 'Sports goods sourcing for global customers',
  aboutText:
    'We help buyers select practical sports products for training, retail and team events with clear categories and fast inquiry flow.',
  contactTitle: 'Send a purchase inquiry',
  contactIntro: 'Tell us your target product, quantity and use case. We will contact you by email or WhatsApp.',
  footerText: 'Sports goods showcase website for international buyers',
  emails: ['bayi35250@gmail.com', 'lyslsm8888@gmail.com'],
  whatsapp: ['+86 152 6539 8250', '+86 180 6316 9020'],
};

export const defaultLayoutSettings: LayoutSettings = {
  primaryColor: '#0d6b5f',
  accentColor: '#e9582f',
  catalogColumns: 4,
  sections: [
    { id: 'categories', label: 'Product Categories', visible: true, order: 1 },
    { id: 'products', label: 'Hot Products', visible: true, order: 2 },
    { id: 'benefits', label: 'Brand Advantages', visible: true, order: 3 },
    { id: 'catalog', label: 'Product Catalog', visible: true, order: 4 },
    { id: 'about', label: 'About Us', visible: true, order: 5 },
    { id: 'contact', label: 'Contact Form', visible: true, order: 6 },
  ],
};

export const defaultCmsProducts: CmsProduct[] = yupooProducts.map((product, index) => ({
  ...product,
  visible: true,
  sortOrder: index + 1,
}));

export async function fetchCmsJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const toWhatsAppHref = (value: string) => {
  const digits = value.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '#contact';
};
