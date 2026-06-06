import { FormEvent, useEffect, useMemo, useState } from 'react';
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

const contactEmails = ['bayi35250@gmail.com', 'lyslsm8888@gmail.com'];
const whatsappContacts = [
  { label: '+86 152 6539 8250', href: 'https://wa.me/8615265398250' },
  { label: '+86 180 6316 9020', href: 'https://wa.me/8618063169020' },
];

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

function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLanguage(detectLanguage());
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

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('rsj-language', nextLanguage);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
      setSubmitted(true);
      setForm(initialForm);
    }
  };

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-field text-ink" dir={direction}>
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex min-w-0 items-center gap-3" aria-label={text.brand}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-court text-white">
              <Dumbbell size={24} strokeWidth={2.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-normal sm:text-lg">{text.brand}</span>
              <span className="block text-xs font-semibold text-slate-500">{text.tagline}</span>
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

      <main>
        <section id="home" className="relative overflow-hidden bg-ink text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(199,239,78,0.25),transparent_32%),linear-gradient(135deg,#17202a_0%,#0d6b5f_62%,#2676d6_100%)]" />
          <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold text-lime ring-1 ring-white/15">
                <Sparkles className="shrink-0" size={17} />
                <span>{text.hero.badge}</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                {text.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">{text.hero.subtitle}</p>
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

        <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.categoriesEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{text.sections.categoriesTitle}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">{text.sections.categoriesIntro}</p>
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
        </section>

        <section id="products" className="bg-white py-16">
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
                const productText = getProductText(product, language);
                return (
                  <article key={product.id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
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
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
        </section>

        <section id="about" className="bg-ink py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-lime">{text.sections.aboutEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{text.sections.aboutTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">{text.sections.aboutText}</p>
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
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court">{text.sections.contactEyebrow}</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{text.sections.contactTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{text.sections.contactIntro}</p>
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

              <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-flame px-5 text-sm font-black text-white transition hover:bg-court sm:w-auto" type="submit">
                {text.form.submit} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="font-bold text-ink">{text.brand}</span>
          <span>{text.footer}</span>
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
