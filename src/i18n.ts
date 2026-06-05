export const languages = [
  { code: 'zh', label: '中文', native: '中文', dir: 'ltr' },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', native: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', native: 'Français', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', native: 'Deutsch', dir: 'ltr' },
  { code: 'pt', label: 'Português', native: 'Português', dir: 'ltr' },
  { code: 'ru', label: 'Русский', native: 'Русский', dir: 'ltr' },
  { code: 'ar', label: 'العربية', native: 'العربية', dir: 'rtl' },
  { code: 'ja', label: '日本語', native: '日本語', dir: 'ltr' },
  { code: 'ko', label: '한국어', native: '한국어', dir: 'ltr' },
  { code: 'it', label: 'Italiano', native: 'Italiano', dir: 'ltr' },
  { code: 'nl', label: 'Nederlands', native: 'Nederlands', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe', native: 'Türkçe', dir: 'ltr' },
  { code: 'vi', label: 'Tiếng Việt', native: 'Tiếng Việt', dir: 'ltr' },
  { code: 'id', label: 'Bahasa Indonesia', native: 'Indonesia', dir: 'ltr' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

type Text = {
  brand: string;
  brandShort: string;
  tagline: string;
  nav: {
    home: string;
    categories: string;
    products: string;
    about: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    stats: string[];
  };
  sections: {
    categoriesEyebrow: string;
    categoriesTitle: string;
    categoriesIntro: string;
    productsEyebrow: string;
    productsTitle: string;
    showing: string;
    all: string;
    aboutEyebrow: string;
    aboutTitle: string;
    aboutText: string;
    contactEyebrow: string;
    contactTitle: string;
    contactIntro: string;
  };
  benefits: { title: string; text: string }[];
  form: {
    name: string;
    contact: string;
    product: string;
    quantity: string;
    message: string;
    namePlaceholder: string;
    contactPlaceholder: string;
    productPlaceholder: string;
    quantityPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    success: string;
    emailLabel: string;
    audienceLabel: string;
    errors: {
      name: string;
      contact: string;
      product: string;
      quantity: string;
      quantityInvalid: string;
    };
  };
  footer: string;
  language: string;
  productCount: string;
  applicable: string;
};

const en: Text = {
  brand: 'Linyi Ruilan Senju',
  brandShort: 'Ruilan Senju',
  tagline: 'SPORTING GOODS',
  nav: {
    home: 'Home',
    categories: 'Categories',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
  },
  hero: {
    badge: 'Football, volleyball, basketball, tennis, cricket, badminton and teamwear supply',
    title: 'Linyi Ruilan Senju',
    subtitle:
      'A sports goods supplier for schools, clubs, retailers and event organizers, covering balls, rackets, sports bags, T-shirts and team purchasing needs.',
    primary: 'View products',
    secondary: 'Request a quote',
    stats: ['24+ SKUs', '8 categories', '48h inquiry response', 'Team sourcing'],
  },
  sections: {
    categoriesEyebrow: 'Product Categories',
    categoriesTitle: 'Core Sports Goods',
    categoriesIntro: 'Products are organized for training, competitions, school sourcing and team customization.',
    productsEyebrow: 'Hot Products',
    productsTitle: 'Products and Category Filter',
    showing: 'Showing',
    all: 'All',
    aboutEyebrow: 'About Us',
    aboutTitle: 'Sports goods sourcing for global customers',
    aboutText:
      'We help buyers select practical sports products for training, retail and team events with clear categories and fast inquiry flow.',
    contactEyebrow: 'Contact',
    contactTitle: 'Send a purchase inquiry',
    contactIntro:
      'Tell us your target product, quantity and use case. This first version validates the form on the page and can be connected to email later.',
  },
  benefits: [
    { title: 'Multi-category supply', text: 'Balls, rackets, bags and apparel are presented in one catalog for quick sourcing.' },
    { title: 'Training-grade selection', text: 'Products focus on durability, grip, support and stable performance for frequent use.' },
    { title: 'Bulk inquiry ready', text: 'The site supports teamwear, school purchasing, retailer replenishment and event sourcing requests.' },
  ],
  form: {
    name: 'Name',
    contact: 'Phone / WhatsApp / Email',
    product: 'Interested product',
    quantity: 'Quantity',
    message: 'Message',
    namePlaceholder: 'Your name',
    contactPlaceholder: 'How can we contact you?',
    productPlaceholder: 'Select a category',
    quantityPlaceholder: 'Example: 100',
    messagePlaceholder: 'Tell us your use case, delivery time or customization needs',
    submit: 'Submit inquiry',
    success: 'Your inquiry has been received. We will contact you soon.',
    emailLabel: 'Email: sales@example.com',
    audienceLabel: 'For schools, clubs, retailers and event buyers',
    errors: {
      name: 'Please enter your name',
      contact: 'Please enter your contact information',
      product: 'Please select a product',
      quantity: 'Please enter quantity',
      quantityInvalid: 'Quantity must be a number greater than 0',
    },
  },
  footer: 'Sports goods showcase website for international buyers',
  language: 'Language',
  productCount: 'products',
  applicable: 'Use case',
};

const zh: Text = {
  ...en,
  brand: '临沂瑞澜森炬',
  brandShort: '瑞澜森炬',
  nav: { home: '首页', categories: '产品分类', products: '热销产品', about: '关于我们', contact: '联系我们' },
  hero: {
    badge: '足球、排球、篮球、网球、板球、羽毛球及团队服装供应',
    title: '临沂瑞澜森炬',
    subtitle: '面向学校、俱乐部、零售商和赛事采购方，提供球类、拍类、运动书包、运动T恤和团队采购方案。',
    primary: '查看产品',
    secondary: '获取报价',
    stats: ['24+ 产品SKU', '8类体育用品', '48小时询盘响应', '团队采购方案'],
  },
  sections: {
    categoriesEyebrow: '产品分类',
    categoriesTitle: '核心体育用品',
    categoriesIntro: '按训练、比赛、校园采购和团队定制场景组织产品，方便国外客户快速选型。',
    productsEyebrow: '热销产品',
    productsTitle: '产品展示与分类筛选',
    showing: '当前显示',
    all: '全部',
    aboutEyebrow: '关于我们',
    aboutTitle: '面向全球客户的体育用品选型网站',
    aboutText: '我们帮助采购方快速了解实用型体育用品，适合训练、零售、赛事和团队采购场景。',
    contactEyebrow: '联系我们',
    contactTitle: '提交采购询盘',
    contactIntro: '告诉我们意向产品、数量和使用场景。首版网站在页面内完成表单校验，后续可接入邮件。',
  },
  benefits: [
    { title: '多品类供应', text: '球类、拍类、运动包和运动服装集中展示，方便一站式采购。' },
    { title: '训练级选品', text: '围绕耐用、防滑、支撑和稳定表现组织产品，适合高频训练。' },
    { title: '批量询盘', text: '支持队服、学校采购、门店补货和赛事物料等采购需求。' },
  ],
  form: {
    name: '姓名',
    contact: '电话 / WhatsApp / 邮箱',
    product: '意向产品',
    quantity: '采购数量',
    message: '留言',
    namePlaceholder: '请输入姓名',
    contactPlaceholder: '请输入联系方式',
    productPlaceholder: '请选择产品分类',
    quantityPlaceholder: '例如：100',
    messagePlaceholder: '请说明使用场景、交付时间或定制需求',
    submit: '提交询盘',
    success: '已收到您的询盘，我们会尽快联系您。',
    emailLabel: '邮箱：sales@example.com',
    audienceLabel: '适合学校、俱乐部、零售商和赛事采购方',
    errors: {
      name: '请输入姓名',
      contact: '请输入联系方式',
      product: '请选择意向产品',
      quantity: '请输入采购数量',
      quantityInvalid: '采购数量必须为大于0的数字',
    },
  },
  footer: '面向国外客户的体育用品展示官网',
  language: '语言',
  productCount: '款产品',
  applicable: '适用场景',
};

const translations: Record<LanguageCode, Text> = {
  zh,
  en,
  es: {
    ...en,
    nav: { home: 'Inicio', categories: 'Categorías', products: 'Productos', about: 'Empresa', contact: 'Contacto' },
    hero: { ...en.hero, subtitle: 'Proveedor de artículos deportivos para escuelas, clubes, minoristas y eventos internacionales.', primary: 'Ver productos', secondary: 'Solicitar cotización' },
    sections: { ...en.sections, categoriesTitle: 'Artículos deportivos principales', productsTitle: 'Productos y filtro por categoría', showing: 'Mostrando', all: 'Todos', contactTitle: 'Enviar consulta de compra' },
    form: { ...en.form, name: 'Nombre', contact: 'Teléfono / WhatsApp / Email', product: 'Producto de interés', quantity: 'Cantidad', message: 'Mensaje', submit: 'Enviar consulta', success: 'Hemos recibido su consulta. Nos pondremos en contacto pronto.' },
    language: 'Idioma',
    productCount: 'productos',
    applicable: 'Uso',
  },
  fr: {
    ...en,
    nav: { home: 'Accueil', categories: 'Catégories', products: 'Produits', about: 'À propos', contact: 'Contact' },
    hero: { ...en.hero, subtitle: 'Fournisseur d’articles de sport pour écoles, clubs, distributeurs et événements.', primary: 'Voir les produits', secondary: 'Demander un devis' },
    sections: { ...en.sections, showing: 'Affichage', all: 'Tous', contactTitle: 'Envoyer une demande d’achat' },
    form: { ...en.form, name: 'Nom', product: 'Produit souhaité', quantity: 'Quantité', message: 'Message', submit: 'Envoyer la demande', success: 'Votre demande a été reçue. Nous vous contacterons bientôt.' },
    language: 'Langue',
    productCount: 'produits',
    applicable: 'Usage',
  },
  de: {
    ...en,
    nav: { home: 'Start', categories: 'Kategorien', products: 'Produkte', about: 'Über uns', contact: 'Kontakt' },
    hero: { ...en.hero, subtitle: 'Sportartikel-Lieferant für Schulen, Vereine, Händler und Event-Einkäufer.', primary: 'Produkte ansehen', secondary: 'Angebot anfragen' },
    sections: { ...en.sections, showing: 'Angezeigt', all: 'Alle', contactTitle: 'Einkaufsanfrage senden' },
    form: { ...en.form, name: 'Name', product: 'Gewünschtes Produkt', quantity: 'Menge', message: 'Nachricht', submit: 'Anfrage senden', success: 'Ihre Anfrage wurde erhalten. Wir melden uns bald.' },
    language: 'Sprache',
    productCount: 'Produkte',
    applicable: 'Einsatz',
  },
  pt: {
    ...en,
    nav: { home: 'Início', categories: 'Categorias', products: 'Produtos', about: 'Sobre', contact: 'Contato' },
    hero: { ...en.hero, subtitle: 'Fornecedor de artigos esportivos para escolas, clubes, varejistas e eventos.', primary: 'Ver produtos', secondary: 'Solicitar cotação' },
    sections: { ...en.sections, showing: 'Exibindo', all: 'Todos', contactTitle: 'Enviar consulta de compra' },
    form: { ...en.form, name: 'Nome', product: 'Produto de interesse', quantity: 'Quantidade', message: 'Mensagem', submit: 'Enviar consulta', success: 'Recebemos sua consulta. Entraremos em contato em breve.' },
    language: 'Idioma',
    productCount: 'produtos',
    applicable: 'Uso',
  },
  ru: {
    ...en,
    nav: { home: 'Главная', categories: 'Категории', products: 'Товары', about: 'О нас', contact: 'Контакты' },
    hero: { ...en.hero, subtitle: 'Поставщик спортивных товаров для школ, клубов, розницы и мероприятий.', primary: 'Смотреть товары', secondary: 'Запросить цену' },
    sections: { ...en.sections, showing: 'Показано', all: 'Все', contactTitle: 'Отправить запрос на покупку' },
    form: { ...en.form, name: 'Имя', product: 'Интересующий товар', quantity: 'Количество', message: 'Сообщение', submit: 'Отправить запрос', success: 'Ваш запрос получен. Мы скоро свяжемся с вами.' },
    language: 'Язык',
    productCount: 'товаров',
    applicable: 'Применение',
  },
  ar: {
    ...en,
    nav: { home: 'الرئيسية', categories: 'الفئات', products: 'المنتجات', about: 'من نحن', contact: 'اتصل بنا' },
    hero: { ...en.hero, subtitle: 'مورد معدات رياضية للمدارس والأندية وتجار التجزئة ومنظمي الفعاليات.', primary: 'عرض المنتجات', secondary: 'طلب عرض سعر' },
    sections: { ...en.sections, showing: 'عرض', all: 'الكل', contactTitle: 'إرسال طلب شراء' },
    form: { ...en.form, name: 'الاسم', product: 'المنتج المطلوب', quantity: 'الكمية', message: 'رسالة', submit: 'إرسال الطلب', success: 'تم استلام طلبك. سنتواصل معك قريبًا.' },
    language: 'اللغة',
    productCount: 'منتجات',
    applicable: 'الاستخدام',
  },
  ja: {
    ...en,
    nav: { home: 'ホーム', categories: 'カテゴリ', products: '製品', about: '会社情報', contact: 'お問い合わせ' },
    hero: { ...en.hero, subtitle: '学校、クラブ、小売、イベント向けのスポーツ用品サプライヤーです。', primary: '製品を見る', secondary: '見積依頼' },
    sections: { ...en.sections, showing: '表示中', all: 'すべて', contactTitle: '購入問い合わせを送信' },
    form: { ...en.form, name: 'お名前', product: '希望製品', quantity: '数量', message: 'メッセージ', submit: '問い合わせ送信', success: 'お問い合わせを受け付けました。まもなくご連絡します。' },
    language: '言語',
    productCount: '製品',
    applicable: '用途',
  },
  ko: {
    ...en,
    nav: { home: '홈', categories: '카테고리', products: '제품', about: '회사 소개', contact: '문의' },
    hero: { ...en.hero, subtitle: '학교, 클럽, 소매업체 및 행사 구매자를 위한 스포츠용품 공급업체입니다.', primary: '제품 보기', secondary: '견적 요청' },
    sections: { ...en.sections, showing: '표시', all: '전체', contactTitle: '구매 문의 보내기' },
    form: { ...en.form, name: '이름', product: '관심 제품', quantity: '수량', message: '메시지', submit: '문의 보내기', success: '문의가 접수되었습니다. 곧 연락드리겠습니다.' },
    language: '언어',
    productCount: '제품',
    applicable: '사용처',
  },
  it: {
    ...en,
    nav: { home: 'Home', categories: 'Categorie', products: 'Prodotti', about: 'Chi siamo', contact: 'Contatto' },
    hero: { ...en.hero, subtitle: 'Fornitore di articoli sportivi per scuole, club, rivenditori ed eventi.', primary: 'Vedi prodotti', secondary: 'Richiedi preventivo' },
    sections: { ...en.sections, showing: 'Mostrando', all: 'Tutti', contactTitle: 'Invia richiesta di acquisto' },
    form: { ...en.form, name: 'Nome', product: 'Prodotto di interesse', quantity: 'Quantità', message: 'Messaggio', submit: 'Invia richiesta', success: 'La tua richiesta è stata ricevuta. Ti contatteremo presto.' },
    language: 'Lingua',
    productCount: 'prodotti',
    applicable: 'Utilizzo',
  },
  nl: {
    ...en,
    nav: { home: 'Home', categories: 'Categorieën', products: 'Producten', about: 'Over ons', contact: 'Contact' },
    hero: { ...en.hero, subtitle: 'Leverancier van sportartikelen voor scholen, clubs, retailers en evenementen.', primary: 'Bekijk producten', secondary: 'Offerte aanvragen' },
    sections: { ...en.sections, showing: 'Getoond', all: 'Alles', contactTitle: 'Inkoopaanvraag verzenden' },
    form: { ...en.form, name: 'Naam', product: 'Gewenst product', quantity: 'Aantal', message: 'Bericht', submit: 'Aanvraag verzenden', success: 'Uw aanvraag is ontvangen. Wij nemen snel contact op.' },
    language: 'Taal',
    productCount: 'producten',
    applicable: 'Gebruik',
  },
  tr: {
    ...en,
    nav: { home: 'Ana Sayfa', categories: 'Kategoriler', products: 'Ürünler', about: 'Hakkımızda', contact: 'İletişim' },
    hero: { ...en.hero, subtitle: 'Okullar, kulüpler, perakendeciler ve etkinlik alıcıları için spor ürünleri tedarikçisi.', primary: 'Ürünleri gör', secondary: 'Teklif iste' },
    sections: { ...en.sections, showing: 'Gösterilen', all: 'Tümü', contactTitle: 'Satın alma talebi gönder' },
    form: { ...en.form, name: 'Ad', product: 'İlgilenilen ürün', quantity: 'Miktar', message: 'Mesaj', submit: 'Talep gönder', success: 'Talebiniz alındı. Yakında sizinle iletişime geçeceğiz.' },
    language: 'Dil',
    productCount: 'ürün',
    applicable: 'Kullanım',
  },
  vi: {
    ...en,
    nav: { home: 'Trang chủ', categories: 'Danh mục', products: 'Sản phẩm', about: 'Giới thiệu', contact: 'Liên hệ' },
    hero: { ...en.hero, subtitle: 'Nhà cung cấp dụng cụ thể thao cho trường học, câu lạc bộ, bán lẻ và sự kiện.', primary: 'Xem sản phẩm', secondary: 'Yêu cầu báo giá' },
    sections: { ...en.sections, showing: 'Đang hiển thị', all: 'Tất cả', contactTitle: 'Gửi yêu cầu mua hàng' },
    form: { ...en.form, name: 'Tên', product: 'Sản phẩm quan tâm', quantity: 'Số lượng', message: 'Tin nhắn', submit: 'Gửi yêu cầu', success: 'Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ sớm.' },
    language: 'Ngôn ngữ',
    productCount: 'sản phẩm',
    applicable: 'Ứng dụng',
  },
  id: {
    ...en,
    nav: { home: 'Beranda', categories: 'Kategori', products: 'Produk', about: 'Tentang', contact: 'Kontak' },
    hero: { ...en.hero, subtitle: 'Pemasok perlengkapan olahraga untuk sekolah, klub, retailer, dan acara.', primary: 'Lihat produk', secondary: 'Minta penawaran' },
    sections: { ...en.sections, showing: 'Menampilkan', all: 'Semua', contactTitle: 'Kirim permintaan pembelian' },
    form: { ...en.form, name: 'Nama', product: 'Produk yang diminati', quantity: 'Jumlah', message: 'Pesan', submit: 'Kirim permintaan', success: 'Permintaan Anda telah diterima. Kami akan segera menghubungi Anda.' },
    language: 'Bahasa',
    productCount: 'produk',
    applicable: 'Penggunaan',
  },
};

export const getText = (language: LanguageCode) => translations[language] ?? translations.en;

export const detectLanguage = (): LanguageCode => {
  const saved = window.localStorage.getItem('rsj-language') as LanguageCode | null;
  if (saved && languages.some((language) => language.code === saved)) return saved;

  const browser = window.navigator.language.toLowerCase();
  const exact = languages.find((language) => browser === language.code);
  if (exact) return exact.code;

  const prefix = browser.split('-')[0];
  const matched = languages.find((language) => language.code === prefix);
  return matched?.code ?? 'en';
};
