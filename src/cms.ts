import type { CmsProduct, CurrencyCode, ExchangeRates, LayoutSettings, ProductTranslation, SiteSettings } from './cmsTypes';
import { yupooProducts } from './yupooProducts';

export const defaultSiteSettings: SiteSettings = {
  brandZh: '临沂瑞澜森炬',
  brandEn: 'Linyi Ruilan Senju',
  tagline: 'SPORTING GOODS',
  heroBadge: 'Football, volleyball, basketball, tennis, badminton and teamwear supply',
  heroTitle: 'Linyi Ruilan Senju',
  heroSubtitle:
    'A sports goods supplier for schools, clubs, retailers and event organizers, covering balls, rackets, T-shirts and team purchasing needs.',
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
  footerText: 'Copyright and filing information',
  emails: ['bayi35250@gmail.com', 'lyslsm8888@gmail.com'],
  whatsapp: ['+86 152 6539 8250', '+86 180 6316 9020'],
};

export const defaultLayoutSettings: LayoutSettings = {
  primaryColor: '#0d6b5f',
  accentColor: '#e9582f',
  catalogColumns: 4,
  sections: [
    { id: 'categories', label: 'Product Categories', visible: true, order: 1 },
    { id: 'benefits', label: 'Brand Advantages', visible: true, order: 2 },
    { id: 'catalog', label: 'Product Catalog', visible: true, order: 3 },
    { id: 'about', label: 'About Us', visible: true, order: 4 },
    { id: 'contact', label: 'Contact Form', visible: true, order: 5 },
  ],
};

export const defaultExchangeRates: ExchangeRates = {
  baseCurrency: 'USD',
  rates: {
    USD: 1,
    CNY: 6.771909,
    EUR: 0.86228,
    JPY: 160.165183,
    KRW: 1513.37371,
    VND: 26173.800338,
    IDR: 17706.658841,
    GBP: 0.74516,
    TRY: 46.296866,
    RUB: 72.485592,
  },
};

export const defaultCmsProducts: CmsProduct[] = yupooProducts.map((product, index) => ({
  ...product,
  visible: true,
  sortOrder: index + 1,
  prices: {
    baseCurrency: 'USD',
    basePrice: 12 + (index % 6) * 2,
    priceUnit: 'piece',
  },
  galleryImages: [product.image],
  specs: [
    { label: 'Category', value: product.category },
    { label: 'Album', value: product.album },
  ],
  translations: {
    en: {
      name: product.name,
      category: product.category,
      album: product.album,
      description: `${product.name} from ${product.album}, suitable for team purchase and product inquiry.`,
      scenario: 'Club training, school sourcing, sports goods retail',
      highlights: ['Selected catalog item', 'Bulk inquiry available', 'Custom sourcing support'],
    },
    zh: {
      name: product.name,
      category: product.category,
      album: product.album,
      description: `${product.name}，适合团队采购、门店选品和外贸询盘。`,
      scenario: '俱乐部训练、学校采购、体育用品零售',
      highlights: ['目录精选产品', '支持批量询盘', '支持定制采购沟通'],
    },
  },
  detailSections: [
    {
      title: 'Product Details',
      body: 'This item can be used for sourcing reference. Contact us for quantity, customization and delivery details.',
    },
  ],
}));

export async function fetchCmsJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path);
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

export const currencyByLanguage: Record<string, CurrencyCode> = {
  zh: 'CNY',
  en: 'USD',
  es: 'EUR',
  fr: 'EUR',
  de: 'EUR',
  pt: 'EUR',
  ru: 'RUB',
  ar: 'USD',
  ja: 'JPY',
  ko: 'KRW',
  it: 'EUR',
  nl: 'EUR',
  tr: 'TRY',
  vi: 'VND',
  id: 'IDR',
};

export function normalizeProduct(product: CmsProduct, index = 0): CmsProduct {
  const fallbackTranslation: ProductTranslation = {
    name: product.name,
    category: product.category,
    album: product.album,
    description: `${product.name} from ${product.album || product.category}.`,
    scenario: 'Sports goods sourcing and team purchase',
    highlights: ['Product catalog item', 'Inquiry available'],
  };

  return {
    ...product,
    visible: product.visible ?? true,
    sortOrder: Number(product.sortOrder) || index + 1,
    prices: product.prices || {
      baseCurrency: 'USD',
      basePrice: 12 + (index % 6) * 2,
      priceUnit: 'piece',
    },
    galleryImages: product.galleryImages?.length ? product.galleryImages : [product.image].filter(Boolean),
    specs: product.specs?.length
      ? product.specs
      : [
          { label: 'Category', value: product.category },
          { label: 'Album', value: product.album },
        ],
    translations: {
      en: fallbackTranslation,
      zh: fallbackTranslation,
      ...(product.translations || {}),
    },
    detailSections: product.detailSections?.length
      ? product.detailSections
      : [
          {
            title: 'Product Details',
            body: 'Contact us for price, customization and delivery details.',
          },
        ],
  };
}

export function getProductTranslation(product: CmsProduct, language: string): ProductTranslation {
  return product.translations?.[language] || product.translations?.en || {
    name: product.name,
    category: product.category,
    album: product.album,
  };
}

export function formatProductPrice(product: CmsProduct, language: string, rates: ExchangeRates) {
  const targetCurrency = currencyByLanguage[language] || 'USD';
  const price = product.prices?.basePrice || 0;
  const baseCurrency = product.prices?.baseCurrency || rates.baseCurrency;
  const baseRate = rates.rates[baseCurrency] || 1;
  const targetRate = rates.rates[targetCurrency] || 1;
  const converted = baseRate ? (price / baseRate) * targetRate : price;

  return new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : language, {
    style: 'currency',
    currency: targetCurrency,
    maximumFractionDigits: ['JPY', 'KRW', 'VND', 'IDR'].includes(targetCurrency) ? 0 : 2,
  }).format(converted);
}
