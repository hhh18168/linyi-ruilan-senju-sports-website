import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  BadgeCheck,
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
  categoryIds,
  categoryImages,
  categoryLabels,
  featuredProducts,
  getProductText,
  products,
  type CategoryId,
} from './products';
import { yupooProducts } from './yupooProducts';
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

type Filter = 'all' | CategoryId;

type FormState = {
  name: string;
  contact: string;
  product: string;
  quantity: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  contact: '',
  product: '',
  quantity: '',
  message: '',
};

const navKeys = ['home', 'categories', 'products', 'about', 'contact'] as const;

const cmsCategoryTranslations: Record<string, Record<string, string>> = {
  es: {
    'Thermal Bonded': 'Termosellado',
    'Machine Stitched': 'Cosido a máquina',
    'World Cup': 'Copa Mundial',
    'European Cup': 'Copa Europea',
    'Machine Stitched-01': 'Cosido a máquina-01',
    'Machine Stitched-02': 'Cosido a máquina-02',
  },
  zh: {
    'Thermal Bonded': '热粘合',
    'Machine Stitched': '机缝',
    'World Cup': '世界杯',
    'European Cup': '欧洲杯',
  },
};

const uiByLanguage: Record<string, Record<string, string>> = {
  zh: {
    catalogEyebrow: '商品目录',
    catalogTitle: '商品目录',
    catalogIntro: '浏览精选产品图片和型号，可直接进入详情或提交询盘。',
    showing: '当前显示',
    items: '个商品',
    allProducts: '全部商品',
    details: '查看详情',
    inquiry: '询盘',
    loadMore: '加载更多',
    back: '返回商品列表',
    inquiryNow: '立即询盘',
    source: '来源',
    specifications: '产品规格',
    detailTitle: '产品详情',
    productDescription: '这是一款适合团队采购、门店选品和体育训练场景的产品。请联系我们获取数量、定制和交付信息。',
    scenario: '团队采购、学校训练、体育用品零售',
    highlight1: '支持批量询盘',
    highlight2: '支持定制采购沟通',
    specCategory: '分类',
    specUseCase: '适用场景',
    sectionProductDetails: '产品详情',
    aboutTitle: '面向全球客户的体育用品采购',
    contactTitle: '提交采购询盘',
  },
  en: {
    catalogEyebrow: 'Product Catalog',
    catalogTitle: 'Product Catalog',
    catalogIntro: 'Browse selected product images and models. Open details or send an inquiry.',
    showing: 'Showing',
    items: 'items',
    allProducts: 'All Products',
    details: 'Details',
    inquiry: 'Inquiry',
    loadMore: 'Load More',
    back: 'Back to products',
    inquiryNow: 'Inquiry Now',
    source: 'Source',
    specifications: 'Specifications',
    detailTitle: 'Details',
    productDescription: 'This product is suitable for team purchasing, retail sourcing and sports training. Contact us for quantity, customization and delivery details.',
    scenario: 'Team purchasing, school training, sports goods retail',
    highlight1: 'Bulk inquiry available',
    highlight2: 'Customization support',
    specCategory: 'Category',
    specUseCase: 'Use Case',
    sectionProductDetails: 'Product Details',
    aboutTitle: 'Sports goods sourcing for global customers',
    contactTitle: 'Send a purchase inquiry',
  },
  es: {
    catalogEyebrow: 'Catálogo de productos',
    catalogTitle: 'Catálogo de productos',
    catalogIntro: 'Explore imágenes y modelos seleccionados. Abra los detalles o envíe una consulta.',
    showing: 'Mostrando',
    items: 'productos',
    allProducts: 'Todos los productos',
    details: 'Ver detalles',
    inquiry: 'Consulta',
    loadMore: 'Cargar más',
    back: 'Volver a productos',
    inquiryNow: 'Solicitar cotización',
    source: 'Fuente',
    specifications: 'Especificaciones',
    detailTitle: 'Detalles',
    productDescription: 'Este producto es adecuado para compras de equipo, selección minorista y entrenamiento deportivo. Contáctenos para cantidades, personalización y entrega.',
    scenario: 'Compras de equipo, entrenamiento escolar, venta de artículos deportivos',
    highlight1: 'Consulta por volumen disponible',
    highlight2: 'Soporte de personalización',
    specCategory: 'Categoría',
    specUseCase: 'Uso',
    sectionProductDetails: 'Detalles del producto',
    aboutTitle: 'Suministro de artículos deportivos para clientes globales',
    contactTitle: 'Enviar consulta de compra',
  },
};

const uiText = (language: string, key: string) => uiByLanguage[language]?.[key] || uiByLanguage.en[key] || key;
const translateCmsTerm = (language: string, value = '') => cmsCategoryTranslations[language]?.[value] || value;
const localizedProductName = (language: string, productName: string) => {
  if (language === 'zh') return productName.replace('World Cup', '世界杯').replace('European Cup', '欧洲杯').replace('Machine Stitched', '机缝');
  if (language === 'es') return productName.replace('World Cup', 'Copa Mundial').replace('European Cup', 'Copa Europea').replace('Machine Stitched', 'Cosido a máquina');
  return productName;
};
const localizedProductCopy = (product: CmsProduct, language: string) => {
  const direct = product.translations?.[language];
  const isComplete = direct?.name && direct?.description;
  if (isComplete) return direct;
  return {
    name: localizedProductName(language, direct?.name || product.name),
    category: translateCmsTerm(language, direct?.category || product.category),
    album: translateCmsTerm(language, direct?.album || product.album),
    description: uiText(language, 'productDescription'),
    scenario: uiText(language, 'scenario'),
    highlights: [uiText(language, 'highlight1'), uiText(language, 'highlight2')],
  };
};

function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [activeYupooCategory, setActiveYupooCategory] = useState('all');
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>(defaultCmsProducts);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(defaultExchangeRates);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
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
      fetchCmsJson<CmsProduct[]>('/cms/products.json', defaultCmsProducts),
      fetchCmsJson<SiteSettings>('/cms/site-settings.json', defaultSiteSettings),
      fetchCmsJson<LayoutSettings>('/cms/layout-settings.json', defaultLayoutSettings),
      fetchCmsJson<ExchangeRates>('/cms/exchange-rates.json', defaultExchangeRates),
    ]).then(([nextProducts, nextSettings, nextLayout, nextRates]) => {
      setCmsProducts(nextProducts.map(normalizeProduct));
      setSiteSettings(nextSettings);
      setLayoutSettings(nextLayout);
      setExchangeRates(nextRates);
    });
  }, []);

  const text = getText(language);
  const labels = categoryLabels[language];
  const direction = languages.find((item) => item.code === language)?.dir ?? 'ltr';

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = direction;
    document.title =
      language === 'zh'
        ? '临沂瑞澜森炬 | 体育用品官网'
        : 'Linyi Ruilan Senju | Sporting Goods Supplier';
  }, [direction, language]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const filteredYupooProducts = useMemo(() => {
    const visible = cmsProducts
      .filter((product) => product.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (activeYupooCategory === 'all') return visible;
    return visible.filter((product) => product.categorySlug === activeYupooCategory);
  }, [activeYupooCategory, cmsProducts]);

  const pageSize = 24;
  const pagedYupooProducts = useMemo(
    () => filteredYupooProducts.slice(0, catalogPage * pageSize),
    [catalogPage, filteredYupooProducts],
  );

  const selectedProduct = useMemo(
    () => {
      const cmsMatch = cmsProducts.map(normalizeProduct).find((product) => product.id === selectedProductId);
      if (cmsMatch) return cmsMatch;
      const legacy = products.find((product) => product.id === selectedProductId);
      if (!legacy) return null;
      const legacyText = language === 'zh' || language === 'en'
        ? getProductText(legacy, language)
        : {
            name: `${labels[legacy.category]} ${legacy.id.split('-').slice(-1)[0] || ''}`.trim(),
            highlight: uiText(language, 'productDescription'),
            scenario: uiText(language, 'scenario'),
          };
      return normalizeProduct({
        id: legacy.id,
        name: legacyText.name,
        category: labels[legacy.category],
        categorySlug: legacy.category,
        album: labels[legacy.category],
        image: legacy.image,
        visible: true,
        sortOrder: 0,
        prices: { baseCurrency: 'USD', basePrice: Number(legacy.priceRange.match(/\d+/)?.[0] || 12), priceUnit: 'piece' },
        galleryImages: [legacy.image],
        translations: {
          en: {
            name: getProductText(legacy, 'en').name,
            category: categoryLabels.en[legacy.category],
            album: categoryLabels.en[legacy.category],
            description: getProductText(legacy, 'en').highlight,
            scenario: getProductText(legacy, 'en').scenario,
          },
          zh: {
            name: getProductText(legacy, 'zh').name,
            category: categoryLabels.zh[legacy.category],
            album: categoryLabels.zh[legacy.category],
            description: getProductText(legacy, 'zh').highlight,
            scenario: getProductText(legacy, 'zh').scenario,
          },
        },
        specs: [
          { label: 'Category', value: labels[legacy.category] },
          { label: 'Use Case', value: legacyText.scenario },
        ],
        detailSections: [{ title: 'Product Details', body: legacyText.highlight }],
      });
    },
    [cmsProducts, labels, language, selectedProductId],
  );

  const catalogCategories = useMemo(() => {
    const pairs = cmsProducts
      .filter((product) => product.visible)
      .map((product) => [product.categorySlug, product.category] as const);
    return Array.from(new Map(pairs).entries()).map(([slug, name]) => ({ slug, name }));
  }, [cmsProducts]);

  const sectionVisible = (id: LayoutSettings['sections'][number]['id']) =>
    layoutSettings.sections.find((section) => section.id === id)?.visible ?? true;

  const sectionOrder = (id: LayoutSettings['sections'][number]['id']) =>
    layoutSettings.sections.find((section) => section.id === id)?.order ?? 10;

  const catalogGridClass =
    layoutSettings.catalogColumns <= 2
      ? 'sm:grid-cols-2'
      : layoutSettings.catalogColumns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const useCmsCopy = language === 'zh' || language === 'en';
  const displayBrand = language === 'zh' ? siteSettings.brandZh : siteSettings.brandEn;
  const cmsCopy = {
    tagline: useCmsCopy ? siteSettings.tagline : text.tagline,
    heroBadge: useCmsCopy ? siteSettings.heroBadge : text.hero.badge,
    heroTitle: language === 'zh' ? siteSettings.brandZh : useCmsCopy ? siteSettings.heroTitle : text.hero.title,
    heroSubtitle: useCmsCopy ? siteSettings.heroSubtitle : text.hero.subtitle,
    categoriesTitle: useCmsCopy ? siteSettings.categoriesTitle : text.sections.categoriesTitle,
    categoriesIntro: useCmsCopy ? siteSettings.categoriesIntro : text.sections.categoriesIntro,
    catalogEyebrow: useCmsCopy ? siteSettings.catalogEyebrow : uiText(language, 'catalogEyebrow'),
    catalogTitle: useCmsCopy ? siteSettings.catalogTitle : uiText(language, 'catalogTitle'),
    catalogIntro: useCmsCopy ? siteSettings.catalogIntro : uiText(language, 'catalogIntro'),
    aboutTitle: useCmsCopy ? siteSettings.aboutTitle : text.sections.aboutTitle,
    aboutText: useCmsCopy ? siteSettings.aboutText : text.sections.aboutText,
    contactTitle: useCmsCopy ? siteSettings.contactTitle : text.sections.contactTitle,
    contactIntro: useCmsCopy ? siteSettings.contactIntro : text.sections.contactIntro,
    footerText: useCmsCopy ? siteSettings.footerText : text.footer,
  };
  const contactEmails = siteSettings.emails.length ? siteSettings.emails : defaultSiteSettings.emails;
  const whatsappContacts = (siteSettings.whatsapp.length ? siteSettings.whatsapp : defaultSiteSettings.whatsapp).map((value) => ({
    label: value,
    href: toWhatsAppHref(value),
  }));

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('rsj-language', nextLanguage);
    setSubmitted(false);
  };

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    window.history.pushState(null, '', `/products/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProduct = () => {
    setSelectedProductId(null);
    window.history.pushState(null, '', '/');
  };

  useEffect(() => {
    const match = window.location.pathname.match(/^\/products\/([^/]+)/);
    if (match?.[1]) setSelectedProductId(decodeURIComponent(match[1]));
  }, []);

  useEffect(() => {
    setCatalogPage(1);
  }, [activeYupooCategory]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<FormState> = {};

    if (!form.name.trim()) nextErrors.name = text.form.errors.name;
    if (!form.contact.trim()) nextErrors.contact = text.form.errors.contact;
    if (!form.product.trim()) nextErrors.product = text.form.errors.product;
    if (!form.quantity.trim()) {
      nextErrors.quantity = text.form.errors.quantity;
    } else if (!/^\d+$/.test(form.quantity) || Number(form.quantity) < 1) {
      nextErrors.quantity = text.form.errors.quantityInvalid;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitError('');
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
        setSubmitError('Submit failed. Please contact us by email or WhatsApp.');
      }
    }
  };

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
    setSubmitError('');
  };

  return (
    <div
      className="min-h-screen bg-field text-ink"
      dir={direction}
      style={
        {
          '--cms-primary': layoutSettings.primaryColor,
          '--cms-accent': layoutSettings.accentColor,
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex min-w-0 items-center gap-3" aria-label={displayBrand}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-court text-white">
              <Dumbbell size={24} strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-normal sm:text-lg">{displayBrand}</span>
              <span className="block text-xs font-semibold text-slate-500">{cmsCopy.tagline || text.tagline}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navKeys.map((key) => (
              <a
                key={key}
                href={`#${key === 'home' ? 'home' : key}`}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-field hover:text-court"
              >
                {text.nav[key]}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSelect language={language} onChange={changeLanguage} label={text.language} />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-flame px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-court"
            >
              {text.hero.secondary} <ArrowRight size={16} />
            </a>
          </div>

          <button
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-ink lg:hidden"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-3">
              <LanguageSelect language={language} onChange={changeLanguage} label={text.language} />
              <nav className="grid gap-2" aria-label="Mobile navigation">
                {navKeys.map((key) => (
                  <a
                    key={key}
                    href={`#${key === 'home' ? 'home' : key}`}
                    className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-field"
                    onClick={() => setMenuOpen(false)}
                  >
                    {text.nav[key]}
                  </a>
                ))}
              </nav>
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
          />
        ) : (
          <>
        <section id="home" className="relative overflow-hidden bg-ink text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,239,78,0.25),transparent_32%),linear-gradient(135deg,#17202a_0%,#0d6b5f_62%,#2676d6_100%)]" />
          <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold text-lime ring-1 ring-white/15">
                <Sparkles className="shrink-0" size={17} />
                <span>{cmsCopy.heroBadge || text.hero.badge}</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                {cmsCopy.heroTitle || text.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">{cmsCopy.heroSubtitle || text.hero.subtitle}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#products"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-lime px-5 py-3 text-sm font-black text-ink transition hover:bg-white"
                >
                  {text.hero.primary} <Search size={18} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {text.hero.secondary} <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                {categoryIds.slice(0, 4).map((category) => (
                  <div key={category} className="overflow-hidden rounded-md bg-white/12 ring-1 ring-white/15">
                    <img className="aspect-[4/3] w-full object-cover" src={categoryImages[category]} alt={labels[category]} />
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {text.hero.stats.map((stat) => (
                  <div key={stat} className="rounded-md border border-white/15 bg-white/10 p-4 text-sm font-black text-lime backdrop-blur">
                    {stat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {sectionVisible('categories') && <section id="categories" style={{ order: sectionOrder('categories') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.categoriesEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.categoriesTitle || text.sections.categoriesTitle}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">{cmsCopy.categoriesIntro || text.sections.categoriesIntro}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryIds.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className="group overflow-hidden rounded-md bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={categoryImages[category]} alt={labels[category]} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 rounded-md bg-white px-3 py-1 text-sm font-black text-ink">
                    {labels[category]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <span className="text-sm font-semibold text-slate-600">
                    {products.filter((product) => product.category === category).length} {text.productCount}
                  </span>
                  <ArrowRight className="shrink-0 text-court transition group-hover:translate-x-1" size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>}

        {sectionVisible('products') && <section id="products" style={{ order: sectionOrder('products') }} className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-flame">{text.sections.productsEyebrow}</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{text.sections.productsTitle}</h2>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {text.sections.showing} <span className="font-black text-court">{filteredProducts.length}</span>
              </div>
            </div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
              {(['all', ...categoryIds] as Filter[]).map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-black transition ${
                      active ? 'bg-court text-white shadow-sm' : 'bg-field text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {filter === 'all' ? text.sections.all : labels[filter]}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const productText = language === 'zh' || language === 'en'
                  ? getProductText(product, language)
                  : {
                      name: `${labels[product.category]} ${product.id.split('-').slice(-1)[0] || ''}`.trim(),
                      highlight: uiText(language, 'productDescription'),
                      scenario: uiText(language, 'scenario'),
                    };
                return (
                  <article
                    key={product.id}
                    className="cursor-pointer overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"
                    onClick={() => openProduct(product.id)}
                  >
                    <div className="relative aspect-[16/10] bg-field">
                      <img className="h-full w-full object-cover" src={product.image} alt={productText.name} />
                      <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-black text-court shadow-sm">
                        {labels[product.category]}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-black tracking-normal">{productText.name}</h3>
                        <span className="shrink-0 rounded-md bg-lime px-2.5 py-1 text-xs font-black text-ink">{product.priceRange}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{productText.highlight}</p>
                      <p className="mt-4 rounded-md bg-field px-3 py-2 text-xs font-semibold leading-6 text-slate-600">
                        {text.applicable}: {productText.scenario}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>}

        {sectionVisible('benefits') && <section style={{ order: sectionOrder('benefits') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[PackageCheck, ShieldCheck, Truck].map((Icon, index) => (
              <div key={text.benefits[index].title} className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-court text-white">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-normal">{text.benefits[index].title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text.benefits[index].text}</p>
              </div>
            ))}
          </div>
        </section>}

        {sectionVisible('catalog') && <section id="yupoo-catalog" style={{ order: sectionOrder('catalog') }} className="bg-field py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{cmsCopy.catalogEyebrow}</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.catalogTitle}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  {cmsCopy.catalogIntro}
                </p>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {uiText(language, 'showing')} <span className="font-black text-court">{filteredYupooProducts.length}</span> {uiText(language, 'items')}
              </div>
            </div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveYupooCategory('all')}
                className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-black transition ${
                  activeYupooCategory === 'all'
                    ? 'bg-court text-white shadow-sm'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                }`}
              >
                {uiText(language, 'allProducts')}
              </button>
              {catalogCategories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveYupooCategory(category.slug)}
                  className={`min-h-11 shrink-0 rounded-md px-4 text-sm font-black transition ${
                    activeYupooCategory === category.slug
                      ? 'bg-court text-white shadow-sm'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                  }`}
                >
                      {translateCmsTerm(language, category.name)}
                </button>
              ))}
            </div>

            <div className={`mt-8 grid gap-5 ${catalogGridClass}`}>
              {pagedYupooProducts.map((product) => {
                const productText = localizedProductCopy(product, language);
                return (
                <article
                  key={product.id}
                  className="cursor-pointer overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"
                  onClick={() => openProduct(product.id)}
                >
                  <div className="relative aspect-square bg-white">
                    <img loading="lazy" className="h-full w-full object-cover" src={product.image} alt={product.name} />
                    <div className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-black text-court shadow-sm">
                      {translateCmsTerm(language, productText.category || product.category)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-black tracking-normal">{productText.name || product.name}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{translateCmsTerm(language, productText.album || product.album)}</p>
                    <p className="mt-3 text-lg font-black text-court">{formatProductPrice(product, language, exchangeRates)}</p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openProduct(product.id);
                        }}
                        className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-court px-3 text-sm font-black text-white transition hover:bg-flame"
                      >
                        {uiText(language, 'details')}
                      </button>
                      <a
                        href="#contact"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-field px-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
                      >
                        {uiText(language, 'inquiry')}
                      </a>
                    </div>
                  </div>
                </article>
              )})}
            </div>
            {pagedYupooProducts.length < filteredYupooProducts.length && (
              <div className="mt-8 text-center">
                <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-court px-5 text-sm font-black text-white" type="button" onClick={() => setCatalogPage((page) => page + 1)}>
                  {uiText(language, 'loadMore')}
                </button>
              </div>
            )}
          </div>
        </section>}

        {sectionVisible('about') && <section id="about" style={{ order: sectionOrder('about') }} className="bg-ink py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-lime">{text.sections.aboutEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{cmsCopy.aboutTitle || text.sections.aboutTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">{cmsCopy.aboutText || text.sections.aboutText}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {featuredProducts.slice(0, 4).map((product) => {
                const productText = getProductText(product, language);
                return (
                  <div key={product.id} className="rounded-md border border-white/12 bg-white/8 p-5">
                    <BadgeCheck className="text-lime" size={22} />
                    <h3 className="mt-4 text-lg font-black">{labels[product.category]}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{productText.highlight}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>}

        {sectionVisible('contact') && <section id="contact" style={{ order: sectionOrder('contact') }} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {contactEmails.map((email) => (
                        <a key={email} className="text-sm font-black text-court hover:text-flame" href={`mailto:${email}`}>
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <Phone className="shrink-0 text-court" size={20} />
                  <div>
                    <div className="text-sm font-bold">{text.form.whatsappLabel}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {whatsappContacts.map((contact) => (
                        <a key={contact.href} className="text-sm font-black text-court hover:text-flame" href={contact.href} target="_blank" rel="noreferrer">
                          {contact.label}
                        </a>
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">{text.form.audienceLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="rounded-md bg-white p-5 shadow-lift ring-1 ring-slate-200 sm:p-7" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={text.form.name} error={errors.name}>
                  <input className="input" value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder={text.form.namePlaceholder} />
                </Field>
                <Field label={text.form.contact} error={errors.contact}>
                  <input className="input" value={form.contact} onChange={(event) => updateForm('contact', event.target.value)} placeholder={text.form.contactPlaceholder} />
                </Field>
                <Field label={text.form.product} error={errors.product}>
                  <select className="input" value={form.product} onChange={(event) => updateForm('product', event.target.value)}>
                    <option value="">{text.form.productPlaceholder}</option>
                    {categoryIds.map((category) => (
                      <option key={category} value={category}>
                        {labels[category]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={text.form.quantity} error={errors.quantity}>
                  <input className="input" inputMode="numeric" value={form.quantity} onChange={(event) => updateForm('quantity', event.target.value)} placeholder={text.form.quantityPlaceholder} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={text.form.message} error={errors.message}>
                    <textarea className="input min-h-32 resize-y" value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder={text.form.messagePlaceholder} />
                  </Field>
                </div>
              </div>

              {submitted && (
                <div className="mt-5 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
                  {text.form.success}
                </div>
              )}
              {submitError && (
                <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200">
                  {submitError}
                </div>
              )}

              <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-flame px-5 text-sm font-black text-white transition hover:bg-court sm:w-auto" type="submit">
                {text.form.submit} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </section>}
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
                    {section.buttonText && section.buttonHref && (
                      <a className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-court px-4 text-sm font-black text-white" href={section.buttonHref}>
                        {section.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
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

function LanguageSelect({
  language,
  onChange,
  label,
}: {
  language: LanguageCode;
  onChange: (language: LanguageCode) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
      <Globe2 className="shrink-0 text-court" size={17} />
      <span className="sr-only">{label}</span>
      <select
        className="min-w-0 bg-transparent py-2 text-sm font-bold outline-none"
        value={language}
        onChange={(event) => onChange(event.target.value as LanguageCode)}
        aria-label={label}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.native}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs font-bold text-flame">{error}</span>}
    </label>
  );
}

export default App;

function ProductDetail({
  product,
  language,
  rates,
  onBack,
}: {
  product: CmsProduct;
  language: LanguageCode;
  rates: ExchangeRates;
  onBack: () => void;
}) {
  const text = localizedProductCopy(product, language);
  const images = product.galleryImages?.length ? product.galleryImages : [product.image];
  const specs = product.specs?.length
    ? product.specs.map((spec) => ({
        label:
          spec.label === 'Category'
            ? uiText(language, 'specCategory')
            : spec.label === 'Use Case'
              ? uiText(language, 'specUseCase')
              : spec.label,
        value: translateCmsTerm(language, spec.value),
      }))
    : [
        { label: uiText(language, 'specCategory'), value: translateCmsTerm(language, product.category) },
        { label: uiText(language, 'specUseCase'), value: text.scenario || uiText(language, 'scenario') },
      ];

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button className="mb-6 inline-flex min-h-11 items-center justify-center rounded-md bg-field px-4 text-sm font-black text-slate-700 ring-1 ring-slate-200" type="button" onClick={onBack}>
          {uiText(language, 'back')}
        </button>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            <img className="aspect-square w-full rounded-md bg-field object-cover ring-1 ring-slate-200" src={images[0]} alt={text.name || product.name} />
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 9).map((image) => (
                  <img key={image} className="aspect-square rounded-md bg-field object-cover ring-1 ring-slate-200" src={image} alt={text.name || product.name} />
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{translateCmsTerm(language, text.category || product.category)}</p>
            <h1 className="mt-2 text-4xl font-black tracking-normal">{text.name || product.name}</h1>
            <p className="mt-3 text-lg font-bold text-slate-500">{translateCmsTerm(language, text.album || product.album)}</p>
            <p className="mt-6 text-3xl font-black text-court">{formatProductPrice(product, language, rates)}</p>
            <p className="mt-5 text-base leading-8 text-slate-600">{text.description}</p>
            {text.highlights?.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {text.highlights.map((item) => (
                  <div key={item} className="rounded-md bg-field px-4 py-3 text-sm font-bold text-slate-700">{item}</div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-flame px-5 text-sm font-black text-white" href="/#contact">
                {uiText(language, 'inquiryNow')}
              </a>
              {product.sourceUrl && (
                <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-field px-5 text-sm font-black text-slate-700 ring-1 ring-slate-200" href={product.sourceUrl} target="_blank" rel="noreferrer">
                  {uiText(language, 'source')}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md bg-field p-5">
            <h2 className="text-xl font-black">{uiText(language, 'specifications')}</h2>
            <div className="mt-4 grid gap-3">
              {specs.map((spec) => (
                <div key={`${spec.label}-${spec.value}`} className="flex justify-between gap-4 border-b border-slate-200 pb-2 text-sm">
                  <span className="font-bold text-slate-500">{spec.label}</span>
                  <span className="font-black text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-field p-5">
            <h2 className="text-xl font-black">{uiText(language, 'detailTitle')}</h2>
            <div className="mt-4 grid gap-4">
              {(product.translations?.[language]?.description
                ? product.detailSections || []
                : [{ title: uiText(language, 'sectionProductDetails'), body: text.description || uiText(language, 'productDescription') }]
              ).map((section) => (
                <article key={section.title}>
                  <h3 className="font-black">{product.translations?.[language]?.description ? section.title : uiText(language, 'sectionProductDetails')}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{product.translations?.[language]?.description ? section.body : text.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
