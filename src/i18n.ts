export const languages = [
  { code: 'zh', label: '\u4e2d\u6587', native: '\u4e2d\u6587', dir: 'ltr' },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'es', label: 'Espanol', native: 'Espanol', dir: 'ltr' },
  { code: 'fr', label: 'Francais', native: 'Francais', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', native: 'Deutsch', dir: 'ltr' },
  { code: 'pt', label: 'Portugues', native: 'Portugues', dir: 'ltr' },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', native: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', dir: 'ltr' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', native: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', dir: 'rtl' },
  { code: 'ja', label: '\u65e5\u672c\u8a9e', native: '\u65e5\u672c\u8a9e', dir: 'ltr' },
  { code: 'ko', label: '\ud55c\uad6d\uc5b4', native: '\ud55c\uad6d\uc5b4', dir: 'ltr' },
  { code: 'it', label: 'Italiano', native: 'Italiano', dir: 'ltr' },
  { code: 'nl', label: 'Nederlands', native: 'Nederlands', dir: 'ltr' },
  { code: 'tr', label: 'Turkce', native: 'Turkce', dir: 'ltr' },
  { code: 'vi', label: 'Tieng Viet', native: 'Tieng Viet', dir: 'ltr' },
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
    whatsappLabel: string;
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
  nav: { home: 'Home', categories: 'Categories', products: 'Products', about: 'About', contact: 'Contact' },
  hero: {
    badge: 'Football, volleyball, basketball, tennis, badminton and teamwear supply',
    title: 'Linyi Ruilan Senju',
    subtitle: 'A sporting goods supplier for schools, clubs, retailers and event buyers, covering balls, rackets, bags, shirts and team purchasing.',
    primary: 'View products',
    secondary: 'Request a quote',
    stats: ['24+ SKUs', '8 categories', '48h inquiry response', 'Team sourcing'],
  },
  sections: {
    categoriesEyebrow: 'Product Categories',
    categoriesTitle: 'Core Sporting Goods',
    categoriesIntro: 'Products are organized for training, competitions, school sourcing and team customization.',
    productsEyebrow: 'Hot Products',
    productsTitle: 'Products and Category Filter',
    showing: 'Showing',
    all: 'All',
    aboutEyebrow: 'About Us',
    aboutTitle: 'Sporting goods sourcing for global customers',
    aboutText: 'We help buyers select practical sporting goods for training, retail, events and team purchasing with a clear catalog and fast inquiry flow.',
    contactEyebrow: 'Contact',
    contactTitle: 'Send a purchase inquiry',
    contactIntro: 'Tell us your target product, quantity and use case. We will contact you by email or WhatsApp.',
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
    emailLabel: 'Email: bayi35250@gmail.com / lyslsm8888@gmail.com',
    whatsappLabel: 'WhatsApp: +86 152 6539 8250 / +86 180 6316 9020',
    audienceLabel: 'For schools, clubs, retailers and event buyers',
    errors: {
      name: 'Please enter your name',
      contact: 'Please enter your contact information',
      product: 'Please select a product',
      quantity: 'Please enter quantity',
      quantityInvalid: 'Quantity must be a number greater than 0',
    },
  },
  footer: 'Sporting goods showcase website for international buyers',
  language: 'Language',
  productCount: 'products',
  applicable: 'Use case',
};

const zh: Text = {
  brand: '\u4e34\u6c82\u745e\u6f9c\u68ee\u70ac',
  brandShort: '\u745e\u6f9c\u68ee\u70ac',
  tagline: '\u4f53\u80b2\u7528\u54c1',
  nav: { home: '\u9996\u9875', categories: '\u4ea7\u54c1\u5206\u7c7b', products: '\u5546\u54c1\u76ee\u5f55', about: '\u5173\u4e8e\u6211\u4eec', contact: '\u8054\u7cfb\u6211\u4eec' },
  hero: {
    badge: '\u8db3\u7403\u3001\u6392\u7403\u3001\u7bee\u7403\u3001\u7f51\u7403\u3001\u677f\u7403\u3001\u7fbd\u6bdb\u7403\u548c\u56e2\u961f\u670d\u88c5\u4f9b\u5e94',
    title: '\u4e34\u6c82\u745e\u6f9c\u68ee\u70ac',
    subtitle: '\u9762\u5411\u5b66\u6821\u3001\u4ff1\u4e50\u90e8\u3001\u96f6\u552e\u5546\u548c\u8d5b\u4e8b\u91c7\u8d2d\u65b9\u7684\u4f53\u80b2\u7528\u54c1\u4f9b\u5e94\u5546\uff0c\u8986\u76d6\u7403\u7c7b\u3001\u7403\u62cd\u3001\u8fd0\u52a8\u5305\u3001\u8fd0\u52a8T\u6064\u548c\u56e2\u961f\u91c7\u8d2d\u9700\u6c42\u3002',
    primary: '\u67e5\u770b\u5546\u54c1',
    secondary: '\u83b7\u53d6\u62a5\u4ef7',
    stats: ['24+\u6b3e\u5546\u54c1', '8\u5927\u5206\u7c7b', '48\u5c0f\u65f6\u8be2\u76d8\u54cd\u5e94', '\u56e2\u961f\u91c7\u8d2d'],
  },
  sections: {
    categoriesEyebrow: '\u4ea7\u54c1\u5206\u7c7b',
    categoriesTitle: '\u6838\u5fc3\u4f53\u80b2\u7528\u54c1',
    categoriesIntro: '\u6309\u8bad\u7ec3\u3001\u6bd4\u8d5b\u3001\u5b66\u6821\u91c7\u8d2d\u548c\u56e2\u961f\u5b9a\u5236\u573a\u666f\u7ec4\u7ec7\u4ea7\u54c1\uff0c\u65b9\u4fbf\u5feb\u901f\u9009\u578b\u3002',
    productsEyebrow: '\u70ed\u9500\u5546\u54c1',
    productsTitle: '\u5546\u54c1\u5c55\u793a\u4e0e\u5206\u7c7b\u7b5b\u9009',
    showing: '\u5f53\u524d\u663e\u793a',
    all: '\u5168\u90e8',
    aboutEyebrow: '\u5173\u4e8e\u6211\u4eec',
    aboutTitle: '\u9762\u5411\u5168\u7403\u5ba2\u6237\u7684\u4f53\u80b2\u7528\u54c1\u91c7\u8d2d',
    aboutText: '\u6211\u4eec\u5e2e\u52a9\u91c7\u8d2d\u65b9\u5feb\u901f\u4e86\u89e3\u5b9e\u7528\u578b\u4f53\u80b2\u7528\u54c1\uff0c\u9002\u5408\u8bad\u7ec3\u3001\u96f6\u552e\u3001\u8d5b\u4e8b\u548c\u56e2\u961f\u91c7\u8d2d\u573a\u666f\u3002',
    contactEyebrow: '\u8054\u7cfb\u6211\u4eec',
    contactTitle: '\u63d0\u4ea4\u91c7\u8d2d\u8be2\u76d8',
    contactIntro: '\u544a\u8bc9\u6211\u4eec\u60a8\u7684\u610f\u5411\u4ea7\u54c1\u3001\u6570\u91cf\u548c\u4f7f\u7528\u573a\u666f\uff0c\u6211\u4eec\u4f1a\u901a\u8fc7\u90ae\u7bb1\u6216 WhatsApp \u8054\u7cfb\u60a8\u3002',
  },
  benefits: [
    { title: '\u591a\u54c1\u7c7b\u4f9b\u5e94', text: '\u7403\u7c7b\u3001\u7403\u62cd\u3001\u8fd0\u52a8\u5305\u548c\u8fd0\u52a8\u670d\u88c5\u96c6\u4e2d\u5c55\u793a\uff0c\u65b9\u4fbf\u4e00\u7ad9\u5f0f\u91c7\u8d2d\u3002' },
    { title: '\u8bad\u7ec3\u7ea7\u9009\u54c1', text: '\u56f4\u7ed5\u8010\u7528\u3001\u9632\u6ed1\u3001\u652f\u6491\u548c\u7a33\u5b9a\u8868\u73b0\u7ec4\u7ec7\u4ea7\u54c1\uff0c\u9002\u5408\u9ad8\u9891\u8bad\u7ec3\u3002' },
    { title: '\u652f\u6301\u6279\u91cf\u8be2\u76d8', text: '\u652f\u6301\u56e2\u961f\u670d\u88c5\u3001\u5b66\u6821\u91c7\u8d2d\u3001\u95e8\u5e97\u8865\u8d27\u548c\u8d5b\u4e8b\u7269\u6599\u7b49\u9700\u6c42\u3002' },
  ],
  form: {
    name: '\u59d3\u540d',
    contact: '\u7535\u8bdd / WhatsApp / \u90ae\u7bb1',
    product: '\u610f\u5411\u4ea7\u54c1',
    quantity: '\u91c7\u8d2d\u6570\u91cf',
    message: '\u7559\u8a00',
    namePlaceholder: '\u8bf7\u8f93\u5165\u59d3\u540d',
    contactPlaceholder: '\u8bf7\u8f93\u5165\u8054\u7cfb\u65b9\u5f0f',
    productPlaceholder: '\u8bf7\u9009\u62e9\u4ea7\u54c1\u5206\u7c7b',
    quantityPlaceholder: '\u4f8b\u5982\uff1a100',
    messagePlaceholder: '\u8bf7\u8bf4\u660e\u4f7f\u7528\u573a\u666f\u3001\u4ea4\u4ed8\u65f6\u95f4\u6216\u5b9a\u5236\u9700\u6c42',
    submit: '\u63d0\u4ea4\u8be2\u76d8',
    success: '\u5df2\u6536\u5230\u60a8\u7684\u8be2\u76d8\uff0c\u6211\u4eec\u4f1a\u5c3d\u5feb\u8054\u7cfb\u60a8\u3002',
    emailLabel: '\u90ae\u7bb1\uff1abayi35250@gmail.com / lyslsm8888@gmail.com',
    whatsappLabel: 'WhatsApp\uff1a+86 152 6539 8250 / +86 180 6316 9020',
    audienceLabel: '\u9002\u5408\u5b66\u6821\u3001\u4ff1\u4e50\u90e8\u3001\u96f6\u552e\u5546\u548c\u8d5b\u4e8b\u91c7\u8d2d\u65b9',
    errors: {
      name: '\u8bf7\u8f93\u5165\u59d3\u540d',
      contact: '\u8bf7\u8f93\u5165\u8054\u7cfb\u65b9\u5f0f',
      product: '\u8bf7\u9009\u62e9\u610f\u5411\u4ea7\u54c1',
      quantity: '\u8bf7\u8f93\u5165\u91c7\u8d2d\u6570\u91cf',
      quantityInvalid: '\u91c7\u8d2d\u6570\u91cf\u5fc5\u987b\u662f\u5927\u4e8e0\u7684\u6570\u5b57',
    },
  },
  footer: '\u9762\u5411\u56fd\u9645\u5ba2\u6237\u7684\u4f53\u80b2\u7528\u54c1\u5c55\u793a\u7f51\u7ad9',
  language: '\u8bed\u8a00',
  productCount: '\u4e2a\u5546\u54c1',
  applicable: '\u9002\u7528\u573a\u666f',
};

type TextPatch = Omit<Partial<Text>, 'form' | 'hero' | 'sections'> & {
  nav: Text['nav'];
  hero: Partial<Text['hero']>;
  sections: Partial<Text['sections']>;
  form: Partial<Text['form']> & { errors?: Partial<Text['form']['errors']> };
};

const makeText = (patch: TextPatch): Text => {
  const form = { ...en.form, ...patch.form, errors: { ...en.form.errors, ...(patch.form.errors || {}) } };
  form.namePlaceholder = patch.form.namePlaceholder || form.name;
  form.contactPlaceholder = patch.form.contactPlaceholder || form.contact;
  form.productPlaceholder = patch.form.productPlaceholder || form.product;
  form.quantityPlaceholder = patch.form.quantityPlaceholder || form.quantity;
  form.messagePlaceholder = patch.form.messagePlaceholder || form.message;

  return {
    ...en,
    ...patch,
    nav: patch.nav,
    hero: { ...en.hero, ...patch.hero },
    sections: { ...en.sections, ...patch.sections },
    form,
    benefits: patch.benefits || en.benefits,
  };
};

const translations: Record<LanguageCode, Text> = {
  zh,
  en,
  es: makeText({
    tagline: 'ARTICULOS DEPORTIVOS',
    nav: { home: 'Inicio', categories: 'Categorias', products: 'Catalogo', about: 'Empresa', contact: 'Contacto' },
    hero: { badge: 'Suministro de futbol, voleibol, baloncesto, tenis, criquet, badminton y ropa de equipo', title: 'Linyi Ruilan Senju', subtitle: 'Proveedor de articulos deportivos para escuelas, clubes, minoristas y compradores de eventos.', primary: 'Ver productos', secondary: 'Solicitar cotizacion', stats: ['24+ modelos', '8 categorias', 'Respuesta en 48h', 'Compra por equipo'] },
    sections: { categoriesEyebrow: 'Categorias', categoriesTitle: 'Articulos deportivos principales', categoriesIntro: 'Productos organizados para entrenamiento, competicion, escuelas y personalizacion de equipos.', productsEyebrow: 'Productos destacados', productsTitle: 'Productos y filtro por categoria', showing: 'Mostrando', all: 'Todos', aboutEyebrow: 'Sobre nosotros', aboutTitle: 'Suministro deportivo para clientes globales', aboutText: 'Ayudamos a compradores a elegir productos deportivos practicos para entrenamiento, retail, eventos y compras por equipo.', contactEyebrow: 'Contacto', contactTitle: 'Enviar consulta de compra', contactIntro: 'Indique producto, cantidad y uso. Le contactaremos por correo o WhatsApp.' },
    benefits: [{ title: 'Suministro por categorias', text: 'Balones, raquetas, bolsas y ropa en un solo catalogo.' }, { title: 'Seleccion para entrenamiento', text: 'Productos centrados en durabilidad, agarre y uso frecuente.' }, { title: 'Consulta por volumen', text: 'Adecuado para escuelas, clubes, tiendas y eventos.' }],
    form: { name: 'Nombre', contact: 'Telefono / WhatsApp / Correo', product: 'Producto de interes', quantity: 'Cantidad', message: 'Mensaje', namePlaceholder: 'Su nombre', contactPlaceholder: 'Como podemos contactarle', productPlaceholder: 'Seleccione una categoria', quantityPlaceholder: 'Ejemplo: 100', messagePlaceholder: 'Uso, plazo de entrega o personalizacion', submit: 'Enviar consulta', success: 'Hemos recibido su consulta. Le contactaremos pronto.', emailLabel: 'Correo: bayi35250@gmail.com / lyslsm8888@gmail.com', whatsappLabel: 'WhatsApp: +86 152 6539 8250 / +86 180 6316 9020', audienceLabel: 'Para escuelas, clubes, minoristas y compradores de eventos', errors: { name: 'Ingrese su nombre', contact: 'Ingrese su contacto', product: 'Seleccione un producto', quantity: 'Ingrese la cantidad', quantityInvalid: 'La cantidad debe ser mayor que 0' } },
    footer: 'Sitio de articulos deportivos para compradores internacionales',
    language: 'Idioma',
    productCount: 'productos',
    applicable: 'Uso',
  }),
  fr: makeText({
    tagline: 'ARTICLES DE SPORT',
    nav: { home: 'Accueil', categories: 'Categories', products: 'Catalogue', about: 'A propos', contact: 'Contact' },
    hero: { badge: 'Fourniture de football, volley-ball, basket-ball, tennis, badminton et tenues', title: 'Linyi Ruilan Senju', subtitle: 'Fournisseur d articles de sport pour ecoles, clubs, distributeurs et acheteurs evenementiels.', primary: 'Voir les produits', secondary: 'Demander un devis', stats: ['24+ modeles', '8 categories', 'Reponse 48h', 'Achat equipe'] },
    sections: { categoriesEyebrow: 'Categories', categoriesTitle: 'Articles de sport principaux', categoriesIntro: 'Produits organises pour entrainement, competition, ecoles et personnalisation.', productsEyebrow: 'Produits populaires', productsTitle: 'Produits et filtre par categorie', showing: 'Affichage', all: 'Tous', aboutEyebrow: 'A propos', aboutTitle: 'Approvisionnement sportif pour clients mondiaux', aboutText: 'Nous aidons les acheteurs a choisir des articles pratiques pour entrainement, vente, evenements et equipes.', contactEyebrow: 'Contact', contactTitle: 'Envoyer une demande d achat', contactIntro: 'Indiquez produit, quantite et usage. Nous vous contacterons par courriel ou WhatsApp.' },
    benefits: [{ title: 'Offre multi-categories', text: 'Ballons, raquettes, sacs et vetements dans un seul catalogue.' }, { title: 'Selection entrainement', text: 'Produits concus pour durabilite, adherence et usage frequent.' }, { title: 'Demande en volume', text: 'Pour ecoles, clubs, magasins et evenements.' }],
    form: { name: 'Nom', contact: 'Telephone / WhatsApp / Courriel', product: 'Produit souhaite', quantity: 'Quantite', message: 'Message', namePlaceholder: 'Votre nom', contactPlaceholder: 'Comment vous contacter', productPlaceholder: 'Choisir une categorie', quantityPlaceholder: 'Exemple : 100', messagePlaceholder: 'Usage, delai ou personnalisation', submit: 'Envoyer la demande', success: 'Votre demande a ete recue. Nous vous contacterons bientot.', emailLabel: 'Courriel : bayi35250@gmail.com / lyslsm8888@gmail.com', whatsappLabel: 'WhatsApp : +86 152 6539 8250 / +86 180 6316 9020', audienceLabel: 'Pour ecoles, clubs, distributeurs et acheteurs evenementiels', errors: { name: 'Saisissez votre nom', contact: 'Saisissez votre contact', product: 'Choisissez un produit', quantity: 'Saisissez la quantite', quantityInvalid: 'La quantite doit etre superieure a 0' } },
    footer: 'Site d articles de sport pour acheteurs internationaux',
    language: 'Langue',
    productCount: 'produits',
    applicable: 'Usage',
  }),
  de: makeText({
    tagline: 'SPORTARTIKEL',
    nav: { home: 'Start', categories: 'Kategorien', products: 'Katalog', about: 'Uber uns', contact: 'Kontakt' },
    hero: { badge: 'Lieferung von Fussball, Volleyball, Basketball, Tennis, Badminton und Teamwear', title: 'Linyi Ruilan Senju', subtitle: 'Sportartikel-Lieferant fur Schulen, Vereine, Handler und Event-Einkaufer.', primary: 'Produkte ansehen', secondary: 'Angebot anfragen', stats: ['24+ Modelle', '8 Kategorien', 'Antwort 48h', 'Team-Einkauf'] },
    sections: { categoriesEyebrow: 'Kategorien', categoriesTitle: 'Wichtige Sportartikel', categoriesIntro: 'Produkte fur Training, Wettkampf, Schuleinkauf und Team-Anpassung.', productsEyebrow: 'Beliebte Produkte', productsTitle: 'Produkte und Kategoriefilter', showing: 'Angezeigt', all: 'Alle', aboutEyebrow: 'Uber uns', aboutTitle: 'Sportartikel-Beschaffung fur globale Kunden', aboutText: 'Wir helfen Kaufern bei praktischen Sportartikeln fur Training, Handel, Events und Teams.', contactEyebrow: 'Kontakt', contactTitle: 'Einkaufsanfrage senden', contactIntro: 'Nennen Sie Produkt, Menge und Nutzung. Wir kontaktieren Sie per E-Mail oder WhatsApp.' },
    benefits: [{ title: 'Mehrere Kategorien', text: 'Balle, Schlager, Taschen und Kleidung in einem Katalog.' }, { title: 'Training-Auswahl', text: 'Fokus auf Haltbarkeit, Griff und haufige Nutzung.' }, { title: 'Mengenanfrage', text: 'Geeignet fur Schulen, Vereine, Handler und Events.' }],
    form: { name: 'Name', contact: 'Telefon / WhatsApp / E-Mail', product: 'Gewunschtes Produkt', quantity: 'Menge', message: 'Nachricht', namePlaceholder: 'Ihr Name', contactPlaceholder: 'Wie konnen wir Sie kontaktieren', productPlaceholder: 'Kategorie wahlen', quantityPlaceholder: 'Beispiel: 100', messagePlaceholder: 'Nutzung, Lieferzeit oder Anpassung', submit: 'Anfrage senden', success: 'Ihre Anfrage wurde erhalten. Wir melden uns bald.', emailLabel: 'E-Mail: bayi35250@gmail.com / lyslsm8888@gmail.com', whatsappLabel: 'WhatsApp: +86 152 6539 8250 / +86 180 6316 9020', audienceLabel: 'Fur Schulen, Vereine, Handler und Event-Einkaufer', errors: { name: 'Bitte Namen eingeben', contact: 'Bitte Kontakt eingeben', product: 'Bitte Produkt wahlen', quantity: 'Bitte Menge eingeben', quantityInvalid: 'Menge muss grosser als 0 sein' } },
    footer: 'Sportartikel-Website fur internationale Kaufer',
    language: 'Sprache',
    productCount: 'Produkte',
    applicable: 'Nutzung',
  }),
  pt: makeText({
    tagline: 'ARTIGOS ESPORTIVOS',
    nav: { home: 'Inicio', categories: 'Categorias', products: 'Catalogo', about: 'Sobre', contact: 'Contato' },
    hero: { badge: 'Fornecimento de futebol, volei, basquete, tenis, cricquete, badminton e uniformes', title: 'Linyi Ruilan Senju', subtitle: 'Fornecedor de artigos esportivos para escolas, clubes, varejistas e eventos.', primary: 'Ver produtos', secondary: 'Solicitar cotacao', stats: ['24+ modelos', '8 categorias', 'Resposta 48h', 'Compra por equipe'] },
    sections: { categoriesEyebrow: 'Categorias', categoriesTitle: 'Principais artigos esportivos', categoriesIntro: 'Produtos organizados para treino, competicao, escolas e personalizacao.', productsEyebrow: 'Produtos populares', productsTitle: 'Produtos e filtro por categoria', showing: 'Exibindo', all: 'Todos', aboutEyebrow: 'Sobre nos', aboutTitle: 'Suprimento esportivo para clientes globais', aboutText: 'Ajudamos compradores a selecionar artigos praticos para treino, varejo, eventos e equipes.', contactEyebrow: 'Contato', contactTitle: 'Enviar consulta de compra', contactIntro: 'Informe produto, quantidade e uso. Entraremos em contato por e-mail ou WhatsApp.' },
    benefits: [{ title: 'Multiplas categorias', text: 'Bolas, raquetes, bolsas e roupas em um catalogo.' }, { title: 'Selecao para treino', text: 'Produtos focados em durabilidade, aderencia e uso frequente.' }, { title: 'Consulta em volume', text: 'Para escolas, clubes, lojas e eventos.' }],
    form: { name: 'Nome', contact: 'Telefone / WhatsApp / E-mail', product: 'Produto de interesse', quantity: 'Quantidade', message: 'Mensagem', namePlaceholder: 'Seu nome', contactPlaceholder: 'Como podemos contatar voce', productPlaceholder: 'Selecione uma categoria', quantityPlaceholder: 'Exemplo: 100', messagePlaceholder: 'Uso, prazo ou personalizacao', submit: 'Enviar consulta', success: 'Recebemos sua consulta. Entraremos em contato em breve.', emailLabel: 'E-mail: bayi35250@gmail.com / lyslsm8888@gmail.com', whatsappLabel: 'WhatsApp: +86 152 6539 8250 / +86 180 6316 9020', audienceLabel: 'Para escolas, clubes, varejistas e eventos', errors: { name: 'Digite seu nome', contact: 'Digite seu contato', product: 'Selecione um produto', quantity: 'Digite a quantidade', quantityInvalid: 'A quantidade deve ser maior que 0' } },
    footer: 'Site de artigos esportivos para compradores internacionais',
    language: 'Idioma',
    productCount: 'produtos',
    applicable: 'Uso',
  }),
  ru: makeText({
    tagline: '\u0421\u041f\u041e\u0420\u0422\u0422\u041e\u0412\u0410\u0420\u042b',
    nav: { home: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', categories: '\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438', products: '\u041a\u0430\u0442\u0430\u043b\u043e\u0433', about: '\u041e \u043d\u0430\u0441', contact: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b' },
    hero: { badge: '\u041f\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0444\u0443\u0442\u0431\u043e\u043b\u0430, \u0432\u043e\u043b\u0435\u0439\u0431\u043e\u043b\u0430, \u0431\u0430\u0441\u043a\u0435\u0442\u0431\u043e\u043b\u0430, \u0442\u0435\u043d\u043d\u0438\u0441\u0430, \u043a\u0440\u0438\u043a\u0435\u0442\u0430, \u0431\u0430\u0434\u043c\u0438\u043d\u0442\u043e\u043d\u0430 \u0438 \u0444\u043e\u0440\u043c\u044b', title: 'Linyi Ruilan Senju', subtitle: '\u041f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a \u0441\u043f\u043e\u0440\u0442\u0442\u043e\u0432\u0430\u0440\u043e\u0432 \u0434\u043b\u044f \u0448\u043a\u043e\u043b, \u043a\u043b\u0443\u0431\u043e\u0432, \u0440\u043e\u0437\u043d\u0438\u0446\u044b \u0438 \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u0439.', primary: '\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0442\u043e\u0432\u0430\u0440\u044b', secondary: '\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0446\u0435\u043d\u0443', stats: ['24+ \u043c\u043e\u0434\u0435\u043b\u0438', '8 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0439', '\u041e\u0442\u0432\u0435\u0442 48\u0447', '\u0417\u0430\u043a\u0443\u043f\u043a\u0430 \u0434\u043b\u044f \u043a\u043e\u043c\u0430\u043d\u0434'] },
    sections: { categoriesEyebrow: '\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438', categoriesTitle: '\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u0441\u043f\u043e\u0440\u0442\u0442\u043e\u0432\u0430\u0440\u044b', categoriesIntro: '\u0422\u043e\u0432\u0430\u0440\u044b \u0434\u043b\u044f \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u043a, \u0441\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d\u0438\u0439, \u0448\u043a\u043e\u043b \u0438 \u043a\u043e\u043c\u0430\u043d\u0434.', productsEyebrow: '\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u0442\u043e\u0432\u0430\u0440\u044b', productsTitle: '\u0422\u043e\u0432\u0430\u0440\u044b \u0438 \u0444\u0438\u043b\u044c\u0442\u0440', showing: '\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u043e', all: '\u0412\u0441\u0435', aboutEyebrow: '\u041e \u043d\u0430\u0441', aboutTitle: '\u0417\u0430\u043a\u0443\u043f\u043a\u0430 \u0441\u043f\u043e\u0440\u0442\u0442\u043e\u0432\u0430\u0440\u043e\u0432 \u0434\u043b\u044f \u043c\u0438\u0440\u043e\u0432\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432', aboutText: '\u041c\u044b \u043f\u043e\u043c\u043e\u0433\u0430\u0435\u043c \u0431\u044b\u0441\u0442\u0440\u043e \u0432\u044b\u0431\u0438\u0440\u0430\u0442\u044c \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u044b\u0435 \u0442\u043e\u0432\u0430\u0440\u044b \u0434\u043b\u044f \u0441\u043f\u043e\u0440\u0442\u0430.', contactEyebrow: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442', contactTitle: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441', contactIntro: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0442\u043e\u0432\u0430\u0440, \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0438 \u0446\u0435\u043b\u044c. \u041c\u044b \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438.' },
    form: { name: '\u0418\u043c\u044f', contact: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d / WhatsApp / Email', product: '\u041d\u0443\u0436\u043d\u044b\u0439 \u0442\u043e\u0432\u0430\u0440', quantity: '\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e', message: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435', submit: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c', success: '\u0417\u0430\u043f\u0440\u043e\u0441 \u043f\u043e\u043b\u0443\u0447\u0435\u043d. \u041c\u044b \u0441\u043a\u043e\u0440\u043e \u0441\u0432\u044f\u0436\u0435\u043c\u0441\u044f.', errors: { name: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f', contact: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442', product: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u043e\u0432\u0430\u0440', quantity: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e', quantityInvalid: '\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0434\u043e\u043b\u0436\u043d\u043e \u0431\u044b\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435 0' } },
    language: '\u042f\u0437\u044b\u043a',
    productCount: '\u0442\u043e\u0432\u0430\u0440\u043e\u0432',
    applicable: '\u041f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435',
  }),
  ar: makeText({
    tagline: '\u0645\u0639\u062f\u0627\u062a \u0631\u064a\u0627\u0636\u064a\u0629',
    nav: { home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', categories: '\u0627\u0644\u0641\u0626\u0627\u062a', products: '\u0627\u0644\u0643\u062a\u0627\u0644\u0648\u062c', about: '\u0645\u0646 \u0646\u062d\u0646', contact: '\u0627\u062a\u0635\u0644 \u0628\u0646\u0627' },
    hero: { badge: '\u062a\u0648\u0631\u064a\u062f \u0643\u0631\u0629 \u0627\u0644\u0642\u062f\u0645 \u0648\u0627\u0644\u0637\u0627\u0626\u0631\u0629 \u0648\u0627\u0644\u0633\u0644\u0629 \u0648\u0627\u0644\u062a\u0646\u0633 \u0648\u0627\u0644\u0643\u0631\u064a\u0643\u062a \u0648\u0627\u0644\u0628\u0627\u062f\u0645\u0646\u062a\u0648\u0646 \u0648\u0645\u0644\u0627\u0628\u0633 \u0627\u0644\u0641\u0631\u0642', title: 'Linyi Ruilan Senju', subtitle: '\u0645\u0648\u0631\u062f \u0645\u0639\u062f\u0627\u062a \u0631\u064a\u0627\u0636\u064a\u0629 \u0644\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0627\u0644\u0623\u0646\u062f\u064a\u0629 \u0648\u0627\u0644\u0645\u062a\u0627\u062c\u0631 \u0648\u0641\u0639\u0627\u0644\u064a\u0627\u062a \u0627\u0644\u0634\u0631\u0627\u0621.', primary: '\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a', secondary: '\u0637\u0644\u0628 \u0633\u0639\u0631', stats: ['24+ \u0646\u0645\u0648\u0630\u062c', '8 \u0641\u0626\u0627\u062a', '\u0631\u062f \u062e\u0644\u0627\u0644 48 \u0633\u0627\u0639\u0629', '\u0634\u0631\u0627\u0621 \u0644\u0644\u0641\u0631\u0642'] },
    sections: { categoriesEyebrow: '\u0627\u0644\u0641\u0626\u0627\u062a', categoriesTitle: '\u0645\u0639\u062f\u0627\u062a \u0631\u064a\u0627\u0636\u064a\u0629 \u0623\u0633\u0627\u0633\u064a\u0629', categoriesIntro: '\u0645\u0646\u062a\u062c\u0627\u062a \u0644\u0644\u062a\u062f\u0631\u064a\u0628 \u0648\u0627\u0644\u0645\u0646\u0627\u0641\u0633\u0629 \u0648\u0627\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0627\u0644\u0641\u0631\u0642.', productsEyebrow: '\u0645\u0646\u062a\u062c\u0627\u062a \u0634\u0627\u0626\u0639\u0629', productsTitle: '\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0648\u0627\u0644\u062a\u0635\u0641\u064a\u0629', showing: '\u064a\u0639\u0631\u0636', all: '\u0627\u0644\u0643\u0644', aboutEyebrow: '\u0645\u0646 \u0646\u062d\u0646', aboutTitle: '\u062a\u0648\u0631\u064a\u062f \u0631\u064a\u0627\u0636\u064a \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u064a\u0646', aboutText: '\u0646\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0646 \u0639\u0644\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0639\u062f\u0627\u062a \u0631\u064a\u0627\u0636\u064a\u0629 \u0639\u0645\u0644\u064a\u0629.', contactEyebrow: '\u0627\u062a\u0635\u0627\u0644', contactTitle: '\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0634\u0631\u0627\u0621', contactIntro: '\u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0646\u062a\u062c \u0648\u0627\u0644\u0643\u0645\u064a\u0629 \u0648\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645. \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643.' },
    form: { name: '\u0627\u0644\u0627\u0633\u0645', contact: '\u0647\u0627\u062a\u0641 / WhatsApp / Email', product: '\u0627\u0644\u0645\u0646\u062a\u062c \u0627\u0644\u0645\u0637\u0644\u0648\u0628', quantity: '\u0627\u0644\u0643\u0645\u064a\u0629', message: '\u0631\u0633\u0627\u0644\u0629', submit: '\u0625\u0631\u0633\u0627\u0644', success: '\u062a\u0645 \u0627\u0633\u062a\u0644\u0627\u0645 \u0637\u0644\u0628\u0643. \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064a\u0628\u0627.', errors: { name: '\u0623\u062f\u062e\u0644 \u0627\u0644\u0627\u0633\u0645', contact: '\u0623\u062f\u062e\u0644 \u0648\u0633\u064a\u0644\u0629 \u0627\u0644\u062a\u0648\u0627\u0635\u0644', product: '\u0627\u062e\u062a\u0631 \u0645\u0646\u062a\u062c\u0627', quantity: '\u0623\u062f\u062e\u0644 \u0627\u0644\u0643\u0645\u064a\u0629', quantityInvalid: '\u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0643\u0645\u064a\u0629 \u0623\u0643\u0628\u0631 \u0645\u0646 0' } },
    language: '\u0627\u0644\u0644\u063a\u0629',
    productCount: '\u0645\u0646\u062a\u062c',
    applicable: '\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645',
  }),
  ja: makeText({
    tagline: '\u30b9\u30dd\u30fc\u30c4\u7528\u54c1',
    nav: { home: '\u30db\u30fc\u30e0', categories: '\u30ab\u30c6\u30b4\u30ea', products: '\u30ab\u30bf\u30ed\u30b0', about: '\u4f1a\u793e\u60c5\u5831', contact: '\u304a\u554f\u3044\u5408\u308f\u305b' },
    hero: { badge: '\u30b5\u30c3\u30ab\u30fc\u3001\u30d0\u30ec\u30fc\u3001\u30d0\u30b9\u30b1\u3001\u30c6\u30cb\u30b9\u3001\u30af\u30ea\u30b1\u30c3\u30c8\u3001\u30d0\u30c9\u30df\u30f3\u30c8\u30f3\u3001\u30c1\u30fc\u30e0\u30a6\u30a7\u30a2\u4f9b\u7d66', title: 'Linyi Ruilan Senju', subtitle: '\u5b66\u6821\u3001\u30af\u30e9\u30d6\u3001\u5c0f\u58f2\u3001\u30a4\u30d9\u30f3\u30c8\u8cfc\u5165\u5411\u3051\u306e\u30b9\u30dd\u30fc\u30c4\u7528\u54c1\u4f9b\u7d66\u4f1a\u793e\u3067\u3059\u3002', primary: '\u5546\u54c1\u3092\u898b\u308b', secondary: '\u898b\u7a4d\u3082\u308a\u4f9d\u983c', stats: ['24+\u30e2\u30c7\u30eb', '8\u30ab\u30c6\u30b4\u30ea', '48\u6642\u9593\u56de\u7b54', '\u30c1\u30fc\u30e0\u8cfc\u5165'] },
    sections: { categoriesEyebrow: '\u30ab\u30c6\u30b4\u30ea', categoriesTitle: '\u4e3b\u8981\u30b9\u30dd\u30fc\u30c4\u7528\u54c1', categoriesIntro: '\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u3001\u8a66\u5408\u3001\u5b66\u6821\u8cfc\u5165\u3001\u30c1\u30fc\u30e0\u5bfe\u5fdc\u5411\u3051\u306e\u5546\u54c1\u3067\u3059\u3002', productsEyebrow: '\u4eba\u6c17\u5546\u54c1', productsTitle: '\u5546\u54c1\u3068\u30ab\u30c6\u30b4\u30ea\u7d5e\u308a\u8fbc\u307f', showing: '\u8868\u793a\u4e2d', all: '\u3059\u3079\u3066', aboutEyebrow: '\u4f1a\u793e\u60c5\u5831', aboutTitle: '\u4e16\u754c\u306e\u304a\u5ba2\u69d8\u5411\u3051\u30b9\u30dd\u30fc\u30c4\u7528\u54c1\u8abf\u9054', aboutText: '\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u3001\u5c0f\u58f2\u3001\u30a4\u30d9\u30f3\u30c8\u3001\u30c1\u30fc\u30e0\u8cfc\u5165\u306b\u9069\u3057\u305f\u7528\u54c1\u3092\u63d0\u6848\u3057\u307e\u3059\u3002', contactEyebrow: '\u9023\u7d61', contactTitle: '\u8cfc\u5165\u554f\u3044\u5408\u308f\u305b', contactIntro: '\u5546\u54c1\u3001\u6570\u91cf\u3001\u7528\u9014\u3092\u304a\u77e5\u3089\u305b\u304f\u3060\u3055\u3044\u3002\u9023\u7d61\u3044\u305f\u3057\u307e\u3059\u3002' },
    form: { name: '\u304a\u540d\u524d', contact: '\u96fb\u8a71 / WhatsApp / Email', product: '\u5e0c\u671b\u5546\u54c1', quantity: '\u6570\u91cf', message: '\u30e1\u30c3\u30bb\u30fc\u30b8', submit: '\u9001\u4fe1', success: '\u304a\u554f\u3044\u5408\u308f\u305b\u3092\u53d7\u4ed8\u3057\u307e\u3057\u305f\u3002\u307e\u3082\u306a\u304f\u9023\u7d61\u3057\u307e\u3059\u3002', errors: { name: '\u304a\u540d\u524d\u3092\u5165\u529b', contact: '\u9023\u7d61\u5148\u3092\u5165\u529b', product: '\u5546\u54c1\u3092\u9078\u629e', quantity: '\u6570\u91cf\u3092\u5165\u529b', quantityInvalid: '\u6570\u91cf\u306f0\u3088\u308a\u5927\u304d\u3044\u6570\u5b57\u3067\u3059' } },
    language: '\u8a00\u8a9e',
    productCount: '\u5546\u54c1',
    applicable: '\u7528\u9014',
  }),
  ko: makeText({
    tagline: '\uc2a4\ud3ec\uce20\uc6a9\ud488',
    nav: { home: '\ud648', categories: '\uce74\ud14c\uace0\ub9ac', products: '\uce74\ud0c8\ub85c\uadf8', about: '\ud68c\uc0ac\uc18c\uac1c', contact: '\ubb38\uc758' },
    hero: { badge: '\ucd95\uad6c, \ubc30\uad6c, \ub18d\uad6c, \ud14c\ub2c8\uc2a4, \ud06c\ub9ac\ucf13, \ubc30\ub4dc\ubbfc\ud134, \ud300\uc6e8\uc5b4 \uacf5\uae09', title: 'Linyi Ruilan Senju', subtitle: '\ud559\uad50, \ud074\ub7fd, \uc18c\ub9e4\uc5c5\uccb4, \ud589\uc0ac \uad6c\ub9e4\uc790\ub97c \uc704\ud55c \uc2a4\ud3ec\uce20\uc6a9\ud488 \uacf5\uae09\uc0ac\uc785\ub2c8\ub2e4.', primary: '\uc0c1\ud488 \ubcf4\uae30', secondary: '\uacac\uc801 \uc694\uccad', stats: ['24+ \ubaa8\ub378', '8\uac1c \uce74\ud14c\uace0\ub9ac', '48\uc2dc\uac04 \uc751\ub2f5', '\ud300 \uad6c\ub9e4'] },
    sections: { categoriesEyebrow: '\uce74\ud14c\uace0\ub9ac', categoriesTitle: '\uc8fc\uc694 \uc2a4\ud3ec\uce20\uc6a9\ud488', categoriesIntro: '\ud6c8\ub828, \uacbd\uae30, \ud559\uad50 \uad6c\ub9e4, \ud300 \ub9de\ucda4\uc5d0 \ub9de\ucd98 \uc0c1\ud488\uc785\ub2c8\ub2e4.', productsEyebrow: '\uc778\uae30 \uc0c1\ud488', productsTitle: '\uc0c1\ud488 \ubc0f \uce74\ud14c\uace0\ub9ac \ud544\ud130', showing: '\ud45c\uc2dc', all: '\uc804\uccb4', aboutEyebrow: '\ud68c\uc0ac\uc18c\uac1c', aboutTitle: '\uae00\ub85c\ubc8c \uace0\uac1d\uc744 \uc704\ud55c \uc2a4\ud3ec\uce20\uc6a9\ud488 \uc870\ub2ec', aboutText: '\ud6c8\ub828, \uc18c\ub9e4, \ud589\uc0ac, \ud300 \uad6c\ub9e4\uc5d0 \uc801\ud569\ud55c \uc6a9\ud488\uc744 \uc81c\uc548\ud569\ub2c8\ub2e4.', contactEyebrow: '\ubb38\uc758', contactTitle: '\uad6c\ub9e4 \ubb38\uc758 \ubcf4\ub0b4\uae30', contactIntro: '\uc0c1\ud488, \uc218\ub7c9, \uc6a9\ub3c4\ub97c \uc54c\ub824\uc8fc\uc138\uc694. \uc5f0\ub77d\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4.' },
    form: { name: '\uc774\ub984', contact: '\uc804\ud654 / WhatsApp / Email', product: '\uad00\uc2ec \uc0c1\ud488', quantity: '\uc218\ub7c9', message: '\uba54\uc2dc\uc9c0', submit: '\ubb38\uc758 \ubcf4\ub0b4\uae30', success: '\ubb38\uc758\uac00 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ube60\ub974\uac8c \uc5f0\ub77d\ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4.', errors: { name: '\uc774\ub984\uc744 \uc785\ub825', contact: '\uc5f0\ub77d\ucc98\ub97c \uc785\ub825', product: '\uc0c1\ud488\uc744 \uc120\ud0dd', quantity: '\uc218\ub7c9\uc744 \uc785\ub825', quantityInvalid: '\uc218\ub7c9\uc740 0\ubcf4\ub2e4 \ucee4\uc57c \ud569\ub2c8\ub2e4' } },
    language: '\uc5b8\uc5b4',
    productCount: '\uc0c1\ud488',
    applicable: '\uc6a9\ub3c4',
  }),
  it: makeText({
    tagline: 'ARTICOLI SPORTIVI',
    nav: { home: 'Home', categories: 'Categorie', products: 'Catalogo', about: 'Chi siamo', contact: 'Contatto' },
    hero: { badge: 'Fornitura di calcio, pallavolo, basket, tennis, badminton e abbigliamento team', title: 'Linyi Ruilan Senju', subtitle: 'Fornitore di articoli sportivi per scuole, club, rivenditori ed eventi.', primary: 'Vedi prodotti', secondary: 'Richiedi preventivo', stats: ['24+ modelli', '8 categorie', 'Risposta 48h', 'Acquisto team'] },
    sections: { categoriesEyebrow: 'Categorie', categoriesTitle: 'Articoli sportivi principali', categoriesIntro: 'Prodotti per allenamento, competizioni, scuole e team.', productsEyebrow: 'Prodotti popolari', productsTitle: 'Prodotti e filtro categoria', showing: 'Mostrando', all: 'Tutti', aboutEyebrow: 'Chi siamo', aboutTitle: 'Fornitura sportiva per clienti globali', aboutText: 'Aiutiamo gli acquirenti a scegliere articoli pratici per allenamento, vendita, eventi e team.', contactEyebrow: 'Contatto', contactTitle: 'Invia richiesta di acquisto', contactIntro: 'Indica prodotto, quantita e uso. Ti contatteremo via email o WhatsApp.' },
    form: { name: 'Nome', contact: 'Telefono / WhatsApp / Email', product: 'Prodotto di interesse', quantity: 'Quantita', message: 'Messaggio', submit: 'Invia richiesta', success: 'Richiesta ricevuta. Ti contatteremo presto.' },
    language: 'Lingua',
    productCount: 'prodotti',
    applicable: 'Uso',
  }),
  nl: makeText({
    tagline: 'SPORTARTIKELEN',
    nav: { home: 'Start', categories: 'Categorieen', products: 'Catalogus', about: 'Over ons', contact: 'Contact' },
    hero: { badge: 'Levering van voetbal, volleybal, basketbal, tennis, badminton en teamkleding', title: 'Linyi Ruilan Senju', subtitle: 'Leverancier van sportartikelen voor scholen, clubs, winkels en evenementen.', primary: 'Bekijk producten', secondary: 'Offerte aanvragen', stats: ['24+ modellen', '8 categorieen', 'Reactie 48u', 'Teamaankoop'] },
    sections: { categoriesEyebrow: 'Categorieen', categoriesTitle: 'Belangrijke sportartikelen', categoriesIntro: 'Producten voor training, wedstrijd, scholen en teams.', productsEyebrow: 'Populaire producten', productsTitle: 'Producten en categoriefilter', showing: 'Getoond', all: 'Alles', aboutEyebrow: 'Over ons', aboutTitle: 'Sportartikelen voor wereldwijde klanten', aboutText: 'Wij helpen kopers praktische sportartikelen kiezen voor training, retail, evenementen en teams.', contactEyebrow: 'Contact', contactTitle: 'Inkoopaanvraag verzenden', contactIntro: 'Geef product, aantal en gebruik door. Wij nemen contact op via email of WhatsApp.' },
    form: { name: 'Naam', contact: 'Telefoon / WhatsApp / Email', product: 'Gewenst product', quantity: 'Aantal', message: 'Bericht', submit: 'Aanvraag verzenden', success: 'Uw aanvraag is ontvangen. Wij nemen snel contact op.' },
    language: 'Taal',
    productCount: 'producten',
    applicable: 'Gebruik',
  }),
  tr: makeText({
    tagline: 'SPOR URUNLERI',
    nav: { home: 'Ana sayfa', categories: 'Kategoriler', products: 'Katalog', about: 'Hakkimizda', contact: 'Iletisim' },
    hero: { badge: 'Futbol, voleybol, basketbol, tenis, kriket, badminton ve takim kiyafeti tedarigi', title: 'Linyi Ruilan Senju', subtitle: 'Okullar, kulüpler, magazalar ve etkinlik alicilari icin spor urunleri tedarikcisi.', primary: 'Urunleri gor', secondary: 'Teklif iste', stats: ['24+ model', '8 kategori', '48s yanit', 'Takim alimi'] },
    sections: { categoriesEyebrow: 'Kategoriler', categoriesTitle: 'Ana spor urunleri', categoriesIntro: 'Antrenman, mac, okul alimi ve takim ozellestirme icin urunler.', productsEyebrow: 'Populer urunler', productsTitle: 'Urunler ve kategori filtresi', showing: 'Gosterilen', all: 'Tumu', aboutEyebrow: 'Hakkimizda', aboutTitle: 'Kuresel musteriler icin spor urunu tedarigi', aboutText: 'Alicilarin antrenman, perakende, etkinlik ve takim alimi icin pratik urun secmesine yardim ederiz.', contactEyebrow: 'Iletisim', contactTitle: 'Satin alma talebi gonder', contactIntro: 'Urunu, miktari ve kullanim amacini yazin. Email veya WhatsApp ile donus yapariz.' },
    form: { name: 'Ad', contact: 'Telefon / WhatsApp / Email', product: 'Ilgilenilen urun', quantity: 'Miktar', message: 'Mesaj', submit: 'Talep gonder', success: 'Talebiniz alindi. Kisa surede iletisime gececegiz.' },
    language: 'Dil',
    productCount: 'urun',
    applicable: 'Kullanim',
  }),
  vi: makeText({
    tagline: 'DO THE THAO',
    nav: { home: 'Trang chu', categories: 'Danh muc', products: 'Danh sach', about: 'Gioi thieu', contact: 'Lien he' },
    hero: { badge: 'Cung cap bong da, bong chuyen, bong ro, tennis, cau long va do doi', title: 'Linyi Ruilan Senju', subtitle: 'Nha cung cap do the thao cho truong hoc, cau lac bo, nha ban le va su kien.', primary: 'Xem san pham', secondary: 'Yeu cau bao gia', stats: ['24+ mau', '8 danh muc', 'Phan hoi 48h', 'Mua theo doi'] },
    sections: { categoriesEyebrow: 'Danh muc', categoriesTitle: 'Do the thao chinh', categoriesIntro: 'San pham cho tap luyen, thi dau, truong hoc va doi nhom.', productsEyebrow: 'San pham pho bien', productsTitle: 'San pham va bo loc danh muc', showing: 'Dang hien thi', all: 'Tat ca', aboutEyebrow: 'Gioi thieu', aboutTitle: 'Cung ung do the thao cho khach hang toan cau', aboutText: 'Chung toi giup nguoi mua chon do the thao thuc dung cho tap luyen, ban le, su kien va doi nhom.', contactEyebrow: 'Lien he', contactTitle: 'Gui yeu cau mua hang', contactIntro: 'Cho biet san pham, so luong va muc dich su dung. Chung toi se lien he qua email hoac WhatsApp.' },
    form: { name: 'Ten', contact: 'Dien thoai / WhatsApp / Email', product: 'San pham quan tam', quantity: 'So luong', message: 'Tin nhan', submit: 'Gui yeu cau', success: 'Da nhan yeu cau cua ban. Chung toi se lien he som.' },
    language: 'Ngon ngu',
    productCount: 'san pham',
    applicable: 'Muc dich',
  }),
  id: makeText({
    tagline: 'PERLENGKAPAN OLAHRAGA',
    nav: { home: 'Beranda', categories: 'Kategori', products: 'Katalog', about: 'Tentang', contact: 'Kontak' },
    hero: { badge: 'Pasokan sepak bola, voli, basket, tenis, kriket, bulu tangkis dan pakaian tim', title: 'Linyi Ruilan Senju', subtitle: 'Pemasok perlengkapan olahraga untuk sekolah, klub, retailer dan pembeli acara.', primary: 'Lihat produk', secondary: 'Minta penawaran', stats: ['24+ model', '8 kategori', 'Respon 48j', 'Pembelian tim'] },
    sections: { categoriesEyebrow: 'Kategori', categoriesTitle: 'Perlengkapan olahraga utama', categoriesIntro: 'Produk untuk latihan, kompetisi, sekolah dan kebutuhan tim.', productsEyebrow: 'Produk populer', productsTitle: 'Produk dan filter kategori', showing: 'Menampilkan', all: 'Semua', aboutEyebrow: 'Tentang kami', aboutTitle: 'Pasokan olahraga untuk pelanggan global', aboutText: 'Kami membantu pembeli memilih produk olahraga praktis untuk latihan, retail, acara dan tim.', contactEyebrow: 'Kontak', contactTitle: 'Kirim permintaan pembelian', contactIntro: 'Tulis produk, jumlah dan penggunaan. Kami akan menghubungi melalui email atau WhatsApp.' },
    form: { name: 'Nama', contact: 'Telepon / WhatsApp / Email', product: 'Produk diminati', quantity: 'Jumlah', message: 'Pesan', submit: 'Kirim permintaan', success: 'Permintaan Anda telah diterima. Kami akan segera menghubungi Anda.' },
    language: 'Bahasa',
    productCount: 'produk',
    applicable: 'Penggunaan',
  }),
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
