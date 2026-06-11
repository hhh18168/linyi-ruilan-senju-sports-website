import { FormEvent, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dumbbell,
  Globe2,
  Mail,
  Menu,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { detectLanguage, getText, languages, type LanguageCode } from './i18n';
import {
  defaultCmsProducts,
  defaultExchangeRates,
  defaultLayoutSettings,
  defaultSiteSettings,
  fetchCmsJson,
  formatProductPrice,
  normalizeProduct,
  toWhatsAppHref,
} from './cms';
import type { CmsProduct, ExchangeRates, LayoutSettings, SiteSettings } from './cmsTypes';

type FormState = {
  name: string;
  contact: string;
  product: string;
  quantity: string;
  message: string;
};

type RouteState = {
  type: 'home' | 'category' | 'product';
  slug?: string;
  productId?: string;
};

const initialForm: FormState = { name: '', contact: '', product: '', quantity: '', message: '' };
const pageSize = 12;
const liteProduct = (product: CmsProduct): CmsProduct => ({
  ...product,
  image: lightProductImage(product),
  galleryImages: [lightProductImage(product)],
  galleryLabels: [],
  detailSections: [],
  specs: [],
});

const ui: Record<string, Record<string, string>> = {
  zh: {
    catalog: '\u5546\u54c1\u76ee\u5f55',
    allProducts: '\u5168\u90e8\u5546\u54c1',
    categories: '\u4ea7\u54c1\u5206\u7c7b',
    products: '\u5546\u54c1',
    details: '\u67e5\u770b\u8be6\u60c5',
    inquiry: '\u8be2\u76d8',
    loadMore: '\u52a0\u8f7d\u66f4\u591a',
    back: '\u8fd4\u56de\u5546\u54c1\u5217\u8868',
    inquiryNow: '\u7acb\u5373\u8be2\u76d8',
    specifications: '\u4ea7\u54c1\u89c4\u683c',
    detailTitle: '\u4ea7\u54c1\u8be6\u60c5',
    colors: '\u989c\u8272 / \u56fe\u7247',
    showing: '\u5f53\u524d\u663e\u793a',
    category: '\u5206\u7c7b',
    useCase: '\u9002\u7528\u573a\u666f',
    description: '\u8be5\u5546\u54c1\u9002\u5408\u56e2\u961f\u91c7\u8d2d\u3001\u95e8\u5e97\u9009\u54c1\u548c\u4f53\u80b2\u8bad\u7ec3\u573a\u666f\u3002\u8bf7\u8054\u7cfb\u6211\u4eec\u83b7\u53d6\u6570\u91cf\u3001\u5b9a\u5236\u548c\u4ea4\u4ed8\u4fe1\u606f\u3002',
    scenario: '\u56e2\u961f\u91c7\u8d2d\u3001\u5b66\u6821\u8bad\u7ec3\u3001\u4f53\u80b2\u7528\u54c1\u96f6\u552e',
    highlight1: '\u652f\u6301\u6279\u91cf\u8be2\u76d8',
    highlight2: '\u652f\u6301\u5b9a\u5236\u91c7\u8d2d\u6c9f\u901a',
    contactFailed: '\u63d0\u4ea4\u5931\u8d25\uff0c\u8bf7\u901a\u8fc7\u90ae\u7bb1\u6216 WhatsApp \u8054\u7cfb\u6211\u4eec\u3002',
    loadingImages: '\u6b63\u5728\u52a0\u8f7d\u5b8c\u6574\u914d\u8272\u56fe\u96c6...',
    previousImage: '\u4e0a\u4e00\u5f20',
    nextImage: '\u4e0b\u4e00\u5f20',
    scrollUp: '\u5411\u4e0a\u67e5\u770b',
    scrollDown: '\u5411\u4e0b\u67e5\u770b',
  },
  en: {
    catalog: 'Product Catalog',
    allProducts: 'All Products',
    categories: 'Product Categories',
    products: 'Products',
    details: 'Details',
    inquiry: 'Inquiry',
    loadMore: 'Load More',
    back: 'Back to products',
    inquiryNow: 'Inquiry Now',
    specifications: 'Specifications',
    detailTitle: 'Product Details',
    colors: 'Colors / Images',
    showing: 'Showing',
    category: 'Category',
    useCase: 'Use Case',
    description: 'This product is suitable for team purchasing, retail sourcing and sports training. Contact us for quantity, customization and delivery details.',
    scenario: 'Team purchasing, school training, sports goods retail',
    highlight1: 'Bulk inquiry available',
    highlight2: 'Customization support',
    contactFailed: 'Submit failed. Please contact us by email or WhatsApp.',
    loadingImages: 'Loading full color gallery...',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    scrollUp: 'Scroll up',
    scrollDown: 'Scroll down',
  },
  es: {
    catalog: 'Catalogo de productos',
    allProducts: 'Todos los productos',
    categories: 'Categorias',
    products: 'Productos',
    details: 'Ver detalles',
    inquiry: 'Consulta',
    loadMore: 'Cargar mas',
    back: 'Volver a productos',
    inquiryNow: 'Solicitar cotizacion',
    specifications: 'Especificaciones',
    detailTitle: 'Detalles del producto',
    colors: 'Colores / Imagenes',
    showing: 'Mostrando',
    category: 'Categoria',
    useCase: 'Uso',
    description: 'Este producto es adecuado para compras de equipo, seleccion minorista y entrenamiento deportivo.',
    scenario: 'Compras de equipo, entrenamiento escolar, venta deportiva',
    highlight1: 'Consulta por volumen disponible',
    highlight2: 'Soporte de personalizacion',
    contactFailed: 'Error al enviar. Contactenos por correo o WhatsApp.',
    loadingImages: 'Cargando galeria completa...',
    previousImage: 'Imagen anterior',
    nextImage: 'Imagen siguiente',
    scrollUp: 'Subir',
    scrollDown: 'Bajar',
  },
};

const termTranslations: Record<string, Record<string, string>> = {
  zh: { Football: '足球', Volleyball: '排球', Basketball: '篮球', Tennis: '网球', Badminton: '羽毛球', 'Sports Bag': '运动书包', 'Sports T-shirt': '运动T恤', 'Thermal Bonded': '热粘合', 'Machine Stitched': '机缝', 'World Cup': '世界杯', 'European Cup': '欧洲杯', Product: '商品' },
  es: { Football: 'Futbol', Volleyball: 'Voleibol', Basketball: 'Baloncesto', Tennis: 'Tenis', Badminton: 'Badminton', 'Sports Bag': 'Bolsa deportiva', 'Sports T-shirt': 'Camiseta deportiva', 'Thermal Bonded': 'Termosellado', 'Machine Stitched': 'Cosido a maquina', 'World Cup': 'Copa Mundial', 'European Cup': 'Copa Europea', Product: 'Producto' },
  fr: { Football: 'Football', Volleyball: 'Volley-ball', Basketball: 'Basket-ball', Tennis: 'Tennis', Badminton: 'Badminton', 'Sports Bag': 'Sac de sport', 'Sports T-shirt': 'T-shirt de sport', Product: 'Produit' },
  de: { Football: 'Fussball', Volleyball: 'Volleyball', Basketball: 'Basketball', Tennis: 'Tennis', Badminton: 'Badminton', 'Sports Bag': 'Sporttasche', 'Sports T-shirt': 'Sport-T-Shirt', Product: 'Produkt' },
  pt: { Football: 'Futebol', Volleyball: 'Voleibol', Basketball: 'Basquete', Tennis: 'Tenis', Badminton: 'Badminton', 'Sports Bag': 'Bolsa esportiva', 'Sports T-shirt': 'Camiseta esportiva', Product: 'Produto' },
  ru: { Football: 'Футбол', Volleyball: 'Волейбол', Basketball: 'Баскетбол', Tennis: 'Теннис', Badminton: 'Бадминтон', 'Sports Bag': 'Спортивный рюкзак', 'Sports T-shirt': 'Спортивная футболка', Product: 'Товар' },
  ar: { Football: 'كرة القدم', Volleyball: 'الكرة الطائرة', Basketball: 'كرة السلة', Tennis: 'التنس', Badminton: 'الريشة الطائرة', 'Sports Bag': 'حقيبة رياضية', 'Sports T-shirt': 'قميص رياضي', Product: 'منتج' },
  ja: { Football: 'サッカー', Volleyball: 'バレーボール', Basketball: 'バスケットボール', Tennis: 'テニス', Badminton: 'バドミントン', 'Sports Bag': 'スポーツバッグ', 'Sports T-shirt': 'スポーツTシャツ', Product: '商品' },
  ko: { Football: '축구', Volleyball: '배구', Basketball: '농구', Tennis: '테니스', Badminton: '배드민턴', 'Sports Bag': '스포츠 백팩', 'Sports T-shirt': '스포츠 티셔츠', Product: '상품' },
  it: { Football: 'Calcio', Volleyball: 'Pallavolo', Basketball: 'Basket', Tennis: 'Tennis', Badminton: 'Badminton', 'Sports Bag': 'Borsa sportiva', 'Sports T-shirt': 'T-shirt sportiva', Product: 'Prodotto' },
  nl: { Football: 'Voetbal', Volleyball: 'Volleybal', Basketball: 'Basketbal', Tennis: 'Tennis', Badminton: 'Badminton', 'Sports Bag': 'Sporttas', 'Sports T-shirt': 'Sport T-shirt', Product: 'Product' },
  tr: { Football: 'Futbol', Volleyball: 'Voleybol', Basketball: 'Basketbol', Tennis: 'Tenis', Badminton: 'Badminton', 'Sports Bag': 'Spor çantası', 'Sports T-shirt': 'Spor tişörtü', Product: 'Ürün' },
  vi: { Football: 'Bong da', Volleyball: 'Bong chuyen', Basketball: 'Bong ro', Tennis: 'Quan vot tennis', Badminton: 'Cau long', 'Sports Bag': 'Ba lo the thao', 'Sports T-shirt': 'Ao thun the thao', Product: 'San pham' },
  id: { Football: 'Sepak bola', Volleyball: 'Voli', Basketball: 'Bola basket', Tennis: 'Tenis', Badminton: 'Bulu tangkis', 'Sports Bag': 'Tas olahraga', 'Sports T-shirt': 'Kaos olahraga', Product: 'Produk' },
};

const t = (language: string, key: string) => ui[language]?.[key] || ui.en[key] || key;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const isCricket = (value = '') => /cricket|板球|\u677f\u7403/i.test(value);
const lightProductImage = (product: CmsProduct) => {
  const categoryIcon: Record<string, string> = {
    football: '/assets/football.svg',
    volleyball: '/assets/volleyball.svg',
    basketball: '/assets/basketball.svg',
    tennis: '/assets/tennis.svg',
    badminton: '/assets/badminton.svg',
    'sports-bag': '/assets/backpack.svg',
    'sports-tshirt': '/assets/tshirt.svg',
  };
  return categoryIcon[product.categorySlug] || product.image;
};
const displayProductImage = (product: CmsProduct) => product.image || lightProductImage(product);
const fallbackProductImage = (event: React.SyntheticEvent<HTMLImageElement>, product: CmsProduct) => {
  const fallback = lightProductImage(product);
  if (event.currentTarget.src.endsWith(fallback)) return;
  event.currentTarget.src = fallback;
};

const translateTerm = (language: string, value = '') => {
  if (!value) return value;
  if (language === 'en') return value;
  const dictionary = termTranslations[language] || {};
  if (dictionary[value]) return dictionary[value];
  const key = Object.keys(dictionary).find((item) => value.toLowerCase().includes(item.toLowerCase()));
  return key ? dictionary[key] : value;
};

const productCopy = (product: CmsProduct, language: string) => {
  const direct = product.translations?.[language];
  if (language === 'en' && direct?.name) return direct;
  const baseName = direct?.name || product.name;
  const number = baseName.match(/(\d+)$/)?.[1] || '';
  const translatedName = direct?.name || translateTerm(language, baseName);
  return {
    name: translatedName === baseName && language !== 'en' ? `${termTranslations[language]?.Product || t(language, 'products')}${number ? `-${number}` : ''}` : translatedName,
    category: translateTerm(language, direct?.category || product.category),
    album: translateTerm(language, direct?.album || product.album),
    description: direct?.description && language === 'en' ? direct.description : t(language, 'description'),
    scenario: direct?.scenario && language === 'en' ? direct.scenario : t(language, 'scenario'),
    highlights: direct?.highlights && language === 'en' ? direct.highlights : [t(language, 'highlight1'), t(language, 'highlight2')],
  };
};

function parseRoute(): RouteState {
  const productMatch = window.location.pathname.match(/^\/products\/([^/]+)/);
  if (productMatch?.[1]) return { type: 'product', productId: decodeURIComponent(productMatch[1]) };
  const categoryMatch = window.location.pathname.match(/^\/categories\/([^/]+)/);
  if (categoryMatch?.[1]) return { type: 'category', slug: decodeURIComponent(categoryMatch[1]) };
  return { type: 'home' };
}

function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [route, setRoute] = useState<RouteState>(() => (typeof window === 'undefined' ? { type: 'home' } : parseRoute()));
  const [lastListPath, setLastListPath] = useState('/');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>(defaultCmsProducts);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [fullProducts, setFullProducts] = useState<CmsProduct[] | null>(null);
  const [productDetails, setProductDetails] = useState<Record<string, CmsProduct>>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(defaultExchangeRates);
  const [catalogPage, setCatalogPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setLanguage(detectLanguage());
  }, []);

  useEffect(() => {
    Promise.all([
      fetchCmsJson<CmsProduct[]>('/cms/products-lite.json', defaultCmsProducts.map(liteProduct)),
      fetchCmsJson<SiteSettings>('/cms/site-settings.json', defaultSiteSettings),
      fetchCmsJson<LayoutSettings>('/cms/layout-settings.json', defaultLayoutSettings),
      fetchCmsJson<ExchangeRates>('/cms/exchange-rates.json', defaultExchangeRates),
    ]).then(([nextProducts, nextSettings, nextLayout, nextRates]) => {
      setCmsProducts(nextProducts.map(normalizeProduct));
      setProductsLoaded(true);
      setSiteSettings(nextSettings);
      setLayoutSettings(nextLayout);
      setExchangeRates(nextRates);
    });
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const text = getText(language);
  const direction = languages.find((item) => item.code === language)?.dir ?? 'ltr';
  const displayBrand = language === 'zh' ? '\u4e34\u6c82\u745e\u6f9c\u68ee\u70ac' : text.brand;

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = direction;
    document.title = language === 'zh' ? '\u4e34\u6c82\u745e\u6f9c\u68ee\u70ac | \u4f53\u80b2\u7528\u54c1\u5b98\u7f51' : `${text.brand} | ${text.tagline}`;
  }, [direction, language, text.brand, text.tagline]);

  const visibleProducts = useMemo(
    () => cmsProducts.filter((product) => product.visible && !isCricket(product.category) && !isCricket(product.categorySlug) && !isCricket(product.name)).sort((a, b) => a.sortOrder - b.sortOrder),
    [cmsProducts],
  );

  const categories = useMemo(() => {
    const pairs = visibleProducts.map((product) => [product.categorySlug || slugify(product.category), product.category] as const);
    return Array.from(new Map(pairs).entries()).map(([slug, name]) => ({ slug, name }));
  }, [visibleProducts]);

  const routeCategory = route.type === 'category' ? route.slug || 'all' : activeCategory;
  const listedProducts = useMemo(() => {
    if (!routeCategory || routeCategory === 'all') return visibleProducts;
    return visibleProducts.filter((product) => (product.categorySlug || slugify(product.category)) === routeCategory);
  }, [routeCategory, visibleProducts]);
  const pagedProducts = listedProducts.slice(0, catalogPage * pageSize);
  useEffect(() => {
    if (route.type !== 'product' || !route.productId || productDetails[route.productId]) return;
    fetchCmsJson<CmsProduct | null>(`/cms/products/${route.productId}.json`, null).then((nextProduct) => {
      if (nextProduct) setProductDetails((current) => ({ ...current, [nextProduct.id]: normalizeProduct(nextProduct) }));
    });
  }, [productDetails, route.productId, route.type]);

  const selectedProduct = route.type === 'product'
    ? (route.productId ? productDetails[route.productId] : null) || (fullProducts || visibleProducts).find((product) => product.id === route.productId) || visibleProducts.find((product) => product.id === route.productId) || null
    : null;
  const homeProducts = route.type === 'home' && !productsLoaded ? defaultCmsProducts : visibleProducts;

  useEffect(() => setCatalogPage(1), [routeCategory]);

  const navigate = (path: string, nextRoute: RouteState, rememberList = true) => {
    if (rememberList && route.type !== 'product') setLastListPath(window.location.pathname + window.location.hash);
    window.history.pushState(null, '', path);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openProduct = (productId: string) => {
    navigate(`/products/${productId}`, { type: 'product', productId });
    if (!productDetails[productId]) {
      fetchCmsJson<CmsProduct | null>(`/cms/products/${productId}.json`, null).then((nextProduct) => {
        if (nextProduct) setProductDetails((current) => ({ ...current, [nextProduct.id]: normalizeProduct(nextProduct) }));
      });
    }
  };
  const openCategory = (slug: string) => {
    setActiveCategory(slug);
    navigate(slug === 'all' ? '/' : `/categories/${slug}`, slug === 'all' ? { type: 'home' } : { type: 'category', slug }, false);
  };
  const closeProduct = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', lastListPath || '/');
    setRoute(parseRoute());
  };

  const sectionVisible = (id: LayoutSettings['sections'][number]['id']) => layoutSettings.sections.find((section) => section.id === id)?.visible ?? true;
  const sectionOrder = (id: LayoutSettings['sections'][number]['id']) => layoutSettings.sections.find((section) => section.id === id)?.order ?? 10;
  const catalogGridClass = layoutSettings.catalogColumns <= 2 ? 'sm:grid-cols-2' : layoutSettings.catalogColumns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  const useCmsCopy = language === 'en';
  const cmsCopy = {
    tagline: useCmsCopy ? siteSettings.tagline : text.tagline,
    heroBadge: useCmsCopy ? siteSettings.heroBadge : text.hero.badge,
    heroTitle: useCmsCopy ? siteSettings.heroTitle : text.hero.title,
    heroSubtitle: useCmsCopy ? siteSettings.heroSubtitle : text.hero.subtitle,
    categoriesTitle: useCmsCopy ? siteSettings.categoriesTitle : text.sections.categoriesTitle,
    categoriesIntro: useCmsCopy ? siteSettings.categoriesIntro : text.sections.categoriesIntro,
    catalogTitle: useCmsCopy ? siteSettings.catalogTitle : t(language, 'catalog'),
    catalogIntro: useCmsCopy ? siteSettings.catalogIntro : t(language, 'description'),
    aboutTitle: useCmsCopy ? siteSettings.aboutTitle : text.sections.aboutTitle,
    aboutText: useCmsCopy ? siteSettings.aboutText : text.sections.aboutText,
    contactTitle: useCmsCopy ? siteSettings.contactTitle : text.sections.contactTitle,
    contactIntro: useCmsCopy ? siteSettings.contactIntro : text.sections.contactIntro,
    footerText: useCmsCopy ? siteSettings.footerText : text.footer,
  };
  const contactEmails = siteSettings.emails.length ? siteSettings.emails : defaultSiteSettings.emails;
  const whatsappContacts = (siteSettings.whatsapp.length ? siteSettings.whatsapp : defaultSiteSettings.whatsapp).map((value) => ({ label: value, href: toWhatsAppHref(value) }));

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('rsj-language', nextLanguage);
    setSubmitted(false);
  };

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<FormState> = {};
    if (!form.name.trim()) nextErrors.name = text.form.errors.name;
    if (!form.contact.trim()) nextErrors.contact = text.form.errors.contact;
    if (!form.product.trim()) nextErrors.product = text.form.errors.product;
    if (!form.quantity.trim()) nextErrors.quantity = text.form.errors.quantity;
    else if (!/^\d+$/.test(form.quantity) || Number(form.quantity) < 1) nextErrors.quantity = text.form.errors.quantityInvalid;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website-contact-form' }),
      });
      if (!response.ok) throw new Error('Inquiry API failed');
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError(t(language, 'contactFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-field text-ink" dir={direction} style={{ '--cms-primary': layoutSettings.primaryColor, '--cms-accent': layoutSettings.accentColor } as CSSProperties}>
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate('/', { type: 'home' }, false)} className="flex min-w-0 items-center gap-3 text-left" aria-label={displayBrand}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-court text-white"><Dumbbell size={24} strokeWidth={2.4} /></span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-normal sm:text-lg">{displayBrand}</span>
              <span className="block text-xs font-semibold text-slate-500">{cmsCopy.tagline || text.tagline}</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => navigate('/', { type: 'home' }, false)} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court">{text.nav.home}</button>
            <div className="group relative">
              <button type="button" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court">{text.nav.categories}</button>
              <div className="invisible absolute left-0 top-full z-50 min-w-56 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100">
                <button type="button" onClick={() => openCategory('all')} className="block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-field">{t(language, 'allProducts')}</button>
                {categories.map((category) => (
                  <button key={category.slug} type="button" onClick={() => openCategory(category.slug)} className="block w-full rounded-md px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-field">
                    {translateTerm(language, category.name)}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => openCategory('all')} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court">{text.nav.products}</button>
            <a href="/#about" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court">{text.nav.about}</a>
            <a href="/#contact" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court">{text.nav.contact}</a>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSelect language={language} onChange={changeLanguage} label={text.language} />
            <a href="/#contact" className="inline-flex items-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-court">{text.hero.secondary} <ArrowRight size={16} /></a>
          </div>
          <button className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-ink lg:hidden" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-3">
              <LanguageSelect language={language} onChange={changeLanguage} label={text.language} />
              <button type="button" onClick={() => navigate('/', { type: 'home' }, false)} className="rounded-md px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-field">{text.nav.home}</button>
              <button type="button" onClick={() => openCategory('all')} className="rounded-md px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-field">{t(language, 'allProducts')}</button>
              {categories.map((category) => (
                <button key={category.slug} type="button" onClick={() => openCategory(category.slug)} className="rounded-md px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-field">{translateTerm(language, category.name)}</button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex flex-col">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            language={language}
            rates={exchangeRates}
            onBack={closeProduct}
            loadingFullGallery={Boolean(route.type === 'product' && route.productId && !productDetails[route.productId])}
          />
        ) : (
          <>
            {route.type === 'home' && (
              <HomeSections
                text={text}
                language={language}
                cmsCopy={cmsCopy}
                products={homeProducts}
                categories={categories}
                openProduct={openProduct}
                openCategory={openCategory}
                rates={exchangeRates}
                sectionVisible={sectionVisible}
                sectionOrder={sectionOrder}
              />
            )}
            {(route.type === 'category' || (route.type === 'home' && sectionVisible('catalog'))) && (
              <CatalogSection
                sectionId={route.type === 'home' ? 'catalog' : 'products'}
                order={route.type === 'home' ? sectionOrder('catalog') : 1}
                language={language}
                title={route.type === 'category' ? translateTerm(language, categories.find((item) => item.slug === routeCategory)?.name || t(language, 'products')) : cmsCopy.catalogTitle}
                intro={cmsCopy.catalogIntro}
                products={productsLoaded ? pagedProducts : homeProducts.slice(0, pageSize)}
                total={productsLoaded ? listedProducts.length : homeProducts.length}
                categories={categories}
                activeCategory={routeCategory || 'all'}
                gridClass={catalogGridClass}
                openCategory={openCategory}
                openProduct={openProduct}
                loadMore={() => setCatalogPage((page) => page + 1)}
                hasMore={productsLoaded && pagedProducts.length < listedProducts.length}
                rates={exchangeRates}
              />
            )}
            {route.type === 'home' && (
              <>
                <AboutContact
                  text={text}
                  language={language}
                  cmsCopy={cmsCopy}
                  products={visibleProducts}
                  contactEmails={contactEmails}
                  whatsappContacts={whatsappContacts}
                  form={form}
                  errors={errors}
                  submitted={submitted}
                  submitError={submitError}
                  updateForm={updateForm}
                  handleSubmit={handleSubmit}
                  sectionVisible={sectionVisible}
                  sectionOrder={sectionOrder}
                />
                {layoutSettings.sections
                  .filter((section) => section.visible && !['categories', 'products', 'benefits', 'catalog', 'about', 'contact'].includes(section.id))
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <section key={section.id} style={{ order: section.order, backgroundColor: section.backgroundColor || undefined }} className="py-14">
                      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className={`grid gap-6 ${section.type === 'image-text' ? 'lg:grid-cols-2 lg:items-center' : ''}`}>
                          {section.image && <img className="w-full rounded-md object-cover ring-1 ring-slate-200" src={section.image} alt={section.title || section.label} />}
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{section.label}</p>
                            <h2 className="mt-2 text-3xl font-black tracking-normal">{section.title || section.label}</h2>
                            {(section.body || section.subtitle) && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{section.body || section.subtitle}</p>}
                            {section.buttonText && section.buttonHref && <a className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-court px-4 text-sm font-black text-white" href={section.buttonHref}>{section.buttonText}</a>}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
              </>
            )}
          </>
        )}
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="font-bold text-ink">{displayBrand}</span>
          <span>{cmsCopy.footerText || text.footer}</span>
        </div>
      </footer>
    </div>
  );
}

function HomeSections({
  text,
  language,
  cmsCopy,
  products,
  categories,
  openProduct,
  openCategory,
  rates,
  sectionVisible,
  sectionOrder,
}: {
  text: ReturnType<typeof getText>;
  language: LanguageCode;
  cmsCopy: Record<string, string>;
  products: CmsProduct[];
  categories: { slug: string; name: string }[];
  openProduct: (id: string) => void;
  openCategory: (slug: string) => void;
  rates: ExchangeRates;
  sectionVisible: (id: LayoutSettings['sections'][number]['id']) => boolean;
  sectionOrder: (id: LayoutSettings['sections'][number]['id']) => number;
}) {
  const featured = products.slice(0, 4);
  const hotProducts = products.slice(0, 8);
  return (
    <>
      <section id="home" className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,239,78,0.25),transparent_32%),linear-gradient(135deg,#17202a_0%,#0d6b5f_62%,#2676d6_100%)]" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold text-lime ring-1 ring-white/15">
              <Sparkles className="shrink-0" size={17} />
              <span>{cmsCopy.heroBadge || text.hero.badge}</span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">{cmsCopy.heroTitle || text.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">{cmsCopy.heroSubtitle || text.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openCategory('all')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-lime px-5 py-3 text-sm font-black text-ink transition hover:bg-white">
                {text.hero.primary} <Search size={18} />
              </button>
              <a href="/#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">{text.hero.secondary} <ArrowRight size={18} /></a>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              {featured.map((product) => (
                <button key={product.id} type="button" onClick={() => openProduct(product.id)} className="overflow-hidden rounded-md bg-white/12 text-left ring-1 ring-white/15 transition hover:-translate-y-1">
                  <img loading="lazy" decoding="async" className="aspect-[4/3] w-full object-contain p-6" src={lightProductImage(product)} alt={productCopy(product, language).name || product.name} />
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {text.hero.stats.map((stat) => <div key={stat} className="rounded-md border border-white/15 bg-white/10 p-4 text-sm font-black text-lime backdrop-blur">{stat}</div>)}
            </div>
          </div>
        </div>
      </section>

      {sectionVisible('categories') && (
        <section id="categories" style={{ order: sectionOrder('categories') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.categoriesEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.categoriesTitle || text.sections.categoriesTitle}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">{cmsCopy.categoriesIntro || text.sections.categoriesIntro}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const sample = products.find((product) => (product.categorySlug || slugify(product.category)) === category.slug);
              return (
                <button key={category.slug} type="button" onClick={() => openCategory(category.slug)} className="group overflow-hidden rounded-md bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                    {sample && <img loading="lazy" decoding="async" className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105" src={lightProductImage(sample)} alt={translateTerm(language, category.name)} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 rounded-md bg-white px-3 py-1 text-sm font-black text-ink">{translateTerm(language, category.name)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <span className="text-sm font-semibold text-slate-600">{products.filter((product) => (product.categorySlug || slugify(product.category)) === category.slug).length} {t(language, 'products')}</span>
                    <ArrowRight className="shrink-0 text-court transition group-hover:translate-x-1" size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {sectionVisible('benefits') && (
        <section style={{ order: sectionOrder('benefits') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[PackageCheck, ShieldCheck, Truck].map((Icon, index) => (
              <div key={text.benefits[index].title} className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-court text-white"><Icon size={26} /></div>
                <h3 className="mt-5 text-xl font-black tracking-normal">{text.benefits[index].title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text.benefits[index].text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisible('products') && (
        <section id="hot-products" style={{ order: sectionOrder('products') }} className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.productsEyebrow}</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{text.sections.productsTitle}</h2>
              </div>
              <button type="button" onClick={() => openCategory('all')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-court px-4 text-sm font-black text-white transition hover:bg-flame">
                {t(language, 'allProducts')} <ArrowRight size={17} />
              </button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hotProducts.map((product) => {
                const copy = productCopy(product, language);
                return (
                  <article key={product.id} className="cursor-pointer overflow-hidden rounded-md border border-slate-200 bg-field shadow-sm transition hover:-translate-y-1 hover:shadow-lift" onClick={() => openProduct(product.id)}>
                    <div className="relative aspect-[4/3] bg-white">
                      <img loading="lazy" decoding="async" onError={(event) => fallbackProductImage(event, product)} className="h-full w-full object-contain p-4" src={displayProductImage(product)} alt={copy.name || product.name} />
                      <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-black text-court shadow-sm">{translateTerm(language, copy.category || product.category)}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 min-h-12 text-base font-black tracking-normal">{copy.name || product.name}</h3>
                      <p className="mt-2 text-lg font-black text-court">{formatProductPrice(product, language, rates)}</p>
                      <button type="button" onClick={(event) => { event.stopPropagation(); openProduct(product.id); }} className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-court px-3 text-sm font-black text-white transition hover:bg-flame">
                        {t(language, 'details')}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function CatalogSection({
  sectionId,
  order,
  language,
  title,
  intro,
  products,
  total,
  categories,
  activeCategory,
  gridClass,
  openCategory,
  openProduct,
  loadMore,
  hasMore,
  rates,
}: {
  sectionId: string;
  order: number;
  language: LanguageCode;
  title: string;
  intro: string;
  products: CmsProduct[];
  total: number;
  categories: { slug: string; name: string }[];
  activeCategory: string;
  gridClass: string;
  openCategory: (slug: string) => void;
  openProduct: (id: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  rates: ExchangeRates;
}) {
  return (
    <section id={sectionId} style={{ order }} className="bg-field py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{t(language, 'catalog')}</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{intro}</p>
          </div>
          <div className="text-sm font-semibold text-slate-500">{t(language, 'showing')} <span className="font-black text-court">{total}</span></div>
        </div>
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          <button type="button" onClick={() => openCategory('all')} className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-black transition ${activeCategory === 'all' ? 'bg-court text-white shadow-sm' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}>{t(language, 'allProducts')}</button>
          {categories.map((category) => (
            <button key={category.slug} type="button" onClick={() => openCategory(category.slug)} className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-black transition ${activeCategory === category.slug ? 'bg-court text-white shadow-sm' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}>{translateTerm(language, category.name)}</button>
          ))}
        </div>
        <div className={`mt-8 grid gap-5 ${gridClass}`}>
          {products.map((product) => {
            const copy = productCopy(product, language);
            return (
              <article key={product.id} className="cursor-pointer overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift" onClick={() => openProduct(product.id)}>
                <div className="relative aspect-[4/3] bg-white">
                  <img loading="lazy" decoding="async" onError={(event) => fallbackProductImage(event, product)} className="h-full w-full object-contain p-4" src={displayProductImage(product)} alt={copy.name || product.name} />
                  <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-black text-court shadow-sm">{translateTerm(language, copy.category || product.category)}</div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-black tracking-normal">{copy.name || product.name}</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{translateTerm(language, copy.album || product.album)}</p>
                  <p className="mt-3 text-lg font-black text-court">{formatProductPrice(product, language, rates)}</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button type="button" onClick={(event) => { event.stopPropagation(); openProduct(product.id); }} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-court px-3 text-sm font-black text-white transition hover:bg-flame">{t(language, 'details')}</button>
                    <a href="/#contact" onClick={(event) => event.stopPropagation()} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-field px-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100">{t(language, 'inquiry')}</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {hasMore && <div className="mt-8 text-center"><button className="inline-flex min-h-11 items-center justify-center rounded-md bg-court px-5 text-sm font-black text-white" type="button" onClick={loadMore}>{t(language, 'loadMore')}</button></div>}
      </div>
    </section>
  );
}

function AboutContact({
  text,
  language,
  cmsCopy,
  products,
  contactEmails,
  whatsappContacts,
  form,
  errors,
  submitted,
  submitError,
  updateForm,
  handleSubmit,
  sectionVisible,
  sectionOrder,
}: {
  text: ReturnType<typeof getText>;
  language: LanguageCode;
  cmsCopy: Record<string, string>;
  products: CmsProduct[];
  contactEmails: string[];
  whatsappContacts: { label: string; href: string }[];
  form: FormState;
  errors: Partial<FormState>;
  submitted: boolean;
  submitError: string;
  updateForm: (key: keyof FormState, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  sectionVisible: (id: LayoutSettings['sections'][number]['id']) => boolean;
  sectionOrder: (id: LayoutSettings['sections'][number]['id']) => number;
}) {
  return (
    <>
      {sectionVisible('about') && (
        <section id="about" style={{ order: sectionOrder('about') }} className="bg-ink py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-lime">{text.sections.aboutEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.aboutTitle || text.sections.aboutTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">{cmsCopy.aboutText || text.sections.aboutText}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {products.slice(0, 4).map((product) => {
                const copy = productCopy(product, language);
                return (
                  <div key={product.id} className="rounded-md border border-white/12 bg-white/8 p-5">
                    <BadgeCheck className="text-lime" size={22} />
                    <h3 className="mt-4 text-lg font-black">{translateTerm(language, copy.category || product.category)}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{copy.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {sectionVisible('contact') && (
        <section id="contact" style={{ order: sectionOrder('contact') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.contactEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.contactTitle || text.sections.contactTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{cmsCopy.contactIntro || text.sections.contactIntro}</p>
              <div className="mt-7 grid gap-3">
                <div className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <Mail className="shrink-0 text-court" size={20} />
                  <div>
                    <div className="text-sm font-bold">{text.form.emailLabel}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{contactEmails.map((email) => <a key={email} className="text-sm font-black text-court hover:text-flame" href={`mailto:${email}`}>{email}</a>)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <Phone className="shrink-0 text-court" size={20} />
                  <div>
                    <div className="text-sm font-bold">{text.form.whatsappLabel}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{whatsappContacts.map((contact) => <a key={contact.href} className="text-sm font-black text-court hover:text-flame" href={contact.href} target="_blank" rel="noreferrer">{contact.label}</a>)}</div>
                    <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">{text.form.audienceLabel}</p>
                  </div>
                </div>
              </div>
            </div>
            <form className="rounded-md bg-white p-5 shadow-lift ring-1 ring-slate-200 sm:p-7" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={text.form.name} error={errors.name}><input className="input" value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder={text.form.namePlaceholder} /></Field>
                <Field label={text.form.contact} error={errors.contact}><input className="input" value={form.contact} onChange={(event) => updateForm('contact', event.target.value)} placeholder={text.form.contactPlaceholder} /></Field>
                <Field label={text.form.product} error={errors.product}>
                  <select className="input" value={form.product} onChange={(event) => updateForm('product', event.target.value)}>
                    <option value="">{text.form.productPlaceholder}</option>
                    {products.map((product) => <option key={product.id} value={product.name}>{productCopy(product, language).name || product.name}</option>)}
                  </select>
                </Field>
                <Field label={text.form.quantity} error={errors.quantity}><input className="input" inputMode="numeric" value={form.quantity} onChange={(event) => updateForm('quantity', event.target.value)} placeholder={text.form.quantityPlaceholder} /></Field>
                <div className="sm:col-span-2"><Field label={text.form.message} error={errors.message}><textarea className="input min-h-32 resize-y" value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder={text.form.messagePlaceholder} /></Field></div>
              </div>
              {submitted && <div className="mt-5 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">{text.form.success}</div>}
              {submitError && <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200">{submitError}</div>}
              <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-flame px-5 text-sm font-black text-white transition hover:bg-court sm:w-auto" type="submit">{text.form.submit} <ArrowRight size={18} /></button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

function LanguageSelect({ language, onChange, label }: { language: LanguageCode; onChange: (language: LanguageCode) => void; label: string }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <Globe2 className="shrink-0 text-court" size={17} />
      <span className="sr-only">{label}</span>
      <select className="min-w-0 bg-transparent py-2 text-sm font-bold outline-none" value={language} onChange={(event) => onChange(event.target.value as LanguageCode)} aria-label={label}>
        {languages.map((item) => <option key={item.code} value={item.code}>{item.native}</option>)}
      </select>
    </label>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs font-bold text-flame">{error}</span>}
    </label>
  );
}

function ProductDetail({
  product,
  language,
  rates,
  onBack,
  loadingFullGallery,
}: {
  product: CmsProduct;
  language: LanguageCode;
  rates: ExchangeRates;
  onBack: () => void;
  loadingFullGallery?: boolean;
}) {
  const copy = productCopy(product, language);
  const images = product.galleryImages?.length ? product.galleryImages : [product.image].filter(Boolean);
  const [activeImage, setActiveImage] = useState(images[0] || product.image);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImage(images[0] || product.image);
  }, [product.id, product.image, images.length]);

  const activeIndex = Math.max(0, images.findIndex((image) => image === activeImage));
  const goImage = (step: number) => {
    if (!images.length) return;
    const nextIndex = (activeIndex + step + images.length) % images.length;
    setActiveImage(images[nextIndex]);
  };
  const scrollThumbnails = (step: number) => {
    thumbnailRef.current?.scrollBy({ top: step * 240, behavior: 'smooth' });
  };

  const specs = product.specs?.length
    ? product.specs.map((spec) => ({
        label: spec.label === 'Category' ? t(language, 'category') : spec.label === 'Use Case' ? t(language, 'useCase') : spec.label,
        value: translateTerm(language, spec.value),
      }))
    : [
        { label: t(language, 'category'), value: translateTerm(language, product.category) },
        { label: t(language, 'useCase'), value: copy.scenario || t(language, 'scenario') },
      ];

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button className="mb-6 inline-flex min-h-11 items-center justify-center rounded-md bg-field px-4 text-sm font-black text-slate-700 ring-1 ring-slate-200" type="button" onClick={onBack}>{t(language, 'back')}</button>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            <div className="relative">
              <img className="aspect-square w-full rounded-md bg-field object-contain ring-1 ring-slate-200" src={activeImage} alt={copy.name || product.name} />
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => goImage(-1)} aria-label={t(language, 'previousImage')} className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-court shadow-lg ring-1 ring-slate-200 transition hover:bg-court hover:text-white"><ChevronLeft size={22} /></button>
                  <button type="button" onClick={() => goImage(1)} aria-label={t(language, 'nextImage')} className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-court shadow-lg ring-1 ring-slate-200 transition hover:bg-court hover:text-white"><ChevronRight size={22} /></button>
                  <div className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-3 py-1 text-xs font-black text-white">{activeIndex + 1} / {images.length}</div>
                </>
              )}
            </div>
            {loadingFullGallery && <div className="rounded-md bg-amber-50 px-4 py-3 text-sm font-black text-amber-800 ring-1 ring-amber-200">{t(language, 'loadingImages')}</div>}
            {images.length > 1 && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-black text-slate-600">{t(language, 'colors')} / {images.length}</h2>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => scrollThumbnails(-1)} aria-label={t(language, 'scrollUp')} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-court ring-1 ring-slate-200 hover:bg-field"><ChevronUp size={18} /></button>
                    <button type="button" onClick={() => scrollThumbnails(1)} aria-label={t(language, 'scrollDown')} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-court ring-1 ring-slate-200 hover:bg-field"><ChevronDown size={18} /></button>
                  </div>
                </div>
                <div ref={thumbnailRef} className="grid max-h-[520px] grid-cols-4 gap-3 overflow-y-auto pr-1 sm:grid-cols-6">
                  {images.map((image, index) => (
                    <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(image)} className={`rounded-md ring-2 ${activeImage === image ? 'ring-court' : 'ring-slate-200'}`}>
                      <img loading="lazy" decoding="async" className="aspect-square rounded-md bg-field object-cover" src={image} alt={`${copy.name || product.name}-${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{translateTerm(language, copy.category || product.category)}</p>
            <h1 className="mt-2 text-4xl font-black tracking-normal">{copy.name || product.name}</h1>
            <p className="mt-3 text-lg font-bold text-slate-500">{translateTerm(language, copy.album || product.album)}</p>
            <p className="mt-6 text-3xl font-black text-court">{formatProductPrice(product, language, rates)}</p>
            <p className="mt-5 text-base leading-8 text-slate-600">{copy.description}</p>
            {copy.highlights?.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{copy.highlights.map((item) => <div key={item} className="rounded-md bg-field px-4 py-3 text-sm font-bold text-slate-700">{item}</div>)}</div> : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-flame px-5 text-sm font-black text-white" href="/#contact">{t(language, 'inquiryNow')}</a>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md bg-field p-5">
            <h2 className="text-xl font-black">{t(language, 'specifications')}</h2>
            <div className="mt-4 grid gap-3">{specs.map((spec) => <div key={`${spec.label}-${spec.value}`} className="flex justify-between gap-4 border-b border-slate-200 pb-2 text-sm"><span className="font-bold text-slate-500">{spec.label}</span><span className="font-black text-ink">{spec.value}</span></div>)}</div>
          </div>
          <div className="rounded-md bg-field p-5">
            <h2 className="text-xl font-black">{t(language, 'detailTitle')}</h2>
            <div className="mt-4 grid gap-4">
              {(language === 'en' && product.detailSections?.length ? product.detailSections : [{ title: t(language, 'detailTitle'), body: copy.description || t(language, 'description') }]).map((section) => (
                <article key={section.title}>
                  <h3 className="font-black">{language === 'en' ? section.title : t(language, 'detailTitle')}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{language === 'en' ? section.body : copy.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
