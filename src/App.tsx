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

const cleanCategoryLabels: Record<string, Record<CategoryId, string>> = {
  zh: {
    football: '\u8db3\u7403',
    volleyball: '\u6392\u7403',
    basketball: '\u7bee\u7403',
    tennis: '\u7f51\u7403',
    cricket: '\u677f\u7403',
    badminton: '\u7fbd\u6bdb\u7403',
    sportsBag: '\u8fd0\u52a8\u4e66\u5305',
    sportsTshirt: '\u8fd0\u52a8T\u6064',
  },
  en: categoryLabels.en,
  es: { football: 'Futbol', volleyball: 'Voleibol', basketball: 'Baloncesto', tennis: 'Tenis', cricket: 'Criquet', badminton: 'Badminton', sportsBag: 'Bolsa deportiva', sportsTshirt: 'Camiseta deportiva' },
  fr: { football: 'Football', volleyball: 'Volley-ball', basketball: 'Basket-ball', tennis: 'Tennis', cricket: 'Cricket', badminton: 'Badminton', sportsBag: 'Sac de sport', sportsTshirt: 'T-shirt de sport' },
  de: { football: 'Fussball', volleyball: 'Volleyball', basketball: 'Basketball', tennis: 'Tennis', cricket: 'Cricket', badminton: 'Badminton', sportsBag: 'Sporttasche', sportsTshirt: 'Sport-T-Shirt' },
  pt: { football: 'Futebol', volleyball: 'Voleibol', basketball: 'Basquete', tennis: 'Tenis', cricket: 'Cricket', badminton: 'Badminton', sportsBag: 'Bolsa esportiva', sportsTshirt: 'Camiseta esportiva' },
  ru: { football: '\u0424\u0443\u0442\u0431\u043e\u043b', volleyball: '\u0412\u043e\u043b\u0435\u0439\u0431\u043e\u043b', basketball: '\u0411\u0430\u0441\u043a\u0435\u0442\u0431\u043e\u043b', tennis: '\u0422\u0435\u043d\u043d\u0438\u0441', cricket: '\u041a\u0440\u0438\u043a\u0435\u0442', badminton: '\u0411\u0430\u0434\u043c\u0438\u043d\u0442\u043e\u043d', sportsBag: '\u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u0430\u044f \u0441\u0443\u043c\u043a\u0430', sportsTshirt: '\u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u0430\u044f \u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430' },
  ar: { football: '\u0643\u0631\u0629 \u0627\u0644\u0642\u062f\u0645', volleyball: '\u0627\u0644\u0643\u0631\u0629 \u0627\u0644\u0637\u0627\u0626\u0631\u0629', basketball: '\u0643\u0631\u0629 \u0627\u0644\u0633\u0644\u0629', tennis: '\u0627\u0644\u062a\u0646\u0633', cricket: '\u0627\u0644\u0643\u0631\u064a\u0643\u062a', badminton: '\u0627\u0644\u0628\u0627\u062f\u0645\u0646\u062a\u0648\u0646', sportsBag: '\u062d\u0642\u064a\u0628\u0629 \u0631\u064a\u0627\u0636\u064a\u0629', sportsTshirt: '\u0642\u0645\u064a\u0635 \u0631\u064a\u0627\u0636\u064a' },
  ja: { football: '\u30b5\u30c3\u30ab\u30fc', volleyball: '\u30d0\u30ec\u30fc\u30dc\u30fc\u30eb', basketball: '\u30d0\u30b9\u30b1\u30c3\u30c8\u30dc\u30fc\u30eb', tennis: '\u30c6\u30cb\u30b9', cricket: '\u30af\u30ea\u30b1\u30c3\u30c8', badminton: '\u30d0\u30c9\u30df\u30f3\u30c8\u30f3', sportsBag: '\u30b9\u30dd\u30fc\u30c4\u30d0\u30c3\u30b0', sportsTshirt: '\u30b9\u30dd\u30fc\u30c4T\u30b7\u30e3\u30c4' },
  ko: { football: '\ucd95\uad6c', volleyball: '\ubc30\uad6c', basketball: '\ub18d\uad6c', tennis: '\ud14c\ub2c8\uc2a4', cricket: '\ud06c\ub9ac\ucf13', badminton: '\ubc30\ub4dc\ubbfc\ud134', sportsBag: '\uc2a4\ud3ec\uce20 \uac00\ubc29', sportsTshirt: '\uc2a4\ud3ec\uce20 T\uc154\uce20' },
  it: { football: 'Calcio', volleyball: 'Pallavolo', basketball: 'Basket', tennis: 'Tennis', cricket: 'Cricket', badminton: 'Badminton', sportsBag: 'Borsa sportiva', sportsTshirt: 'T-shirt sportiva' },
  nl: { football: 'Voetbal', volleyball: 'Volleybal', basketball: 'Basketbal', tennis: 'Tennis', cricket: 'Cricket', badminton: 'Badminton', sportsBag: 'Sporttas', sportsTshirt: 'Sport T-shirt' },
  tr: { football: 'Futbol', volleyball: 'Voleybol', basketball: 'Basketbol', tennis: 'Tenis', cricket: 'Kriket', badminton: 'Badminton', sportsBag: 'Spor cantasi', sportsTshirt: 'Spor tisortu' },
  vi: { football: 'Bong da', volleyball: 'Bong chuyen', basketball: 'Bong ro', tennis: 'Quan vot tennis', cricket: 'Cricket', badminton: 'Cau long', sportsBag: 'Tui the thao', sportsTshirt: 'Ao the thao' },
  id: { football: 'Sepak bola', volleyball: 'Voli', basketball: 'Bola basket', tennis: 'Tenis', cricket: 'Kriket', badminton: 'Bulu tangkis', sportsBag: 'Tas olahraga', sportsTshirt: 'Kaos olahraga' },
};

const cmsCategoryTranslations: Record<string, Record<string, string>> = {};

const uiByLanguage: Record<string, Record<string, string>> = {
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
  },
  es: {
    catalogEyebrow: 'Catalogo de productos',
    catalogTitle: 'Catalogo de productos',
    catalogIntro: 'Explore imagenes y modelos seleccionados. Abra los detalles o envie una consulta.',
    showing: 'Mostrando',
    items: 'productos',
    allProducts: 'Todos los productos',
    details: 'Ver detalles',
    inquiry: 'Consulta',
    loadMore: 'Cargar mas',
    back: 'Volver a productos',
    inquiryNow: 'Solicitar cotizacion',
    source: 'Fuente',
    specifications: 'Especificaciones',
    detailTitle: 'Detalles',
    productDescription: 'Este producto es adecuado para compras de equipo, seleccion minorista y entrenamiento deportivo.',
    scenario: 'Compras de equipo, entrenamiento escolar, venta deportiva',
    highlight1: 'Consulta por volumen disponible',
    highlight2: 'Soporte de personalizacion',
    specCategory: 'Categoria',
    specUseCase: 'Uso',
    sectionProductDetails: 'Detalles del producto',
  },
};
const strictUiByLanguage: Record<string, Record<string, string>> = {
  zh: {
    catalogEyebrow: '\u5546\u54c1\u76ee\u5f55',
    catalogTitle: '\u5546\u54c1\u76ee\u5f55',
    catalogIntro: '\u6d4f\u89c8\u5546\u54c1\u56fe\u7247\u548c\u578b\u53f7\uff0c\u53ef\u67e5\u770b\u8be6\u60c5\u6216\u63d0\u4ea4\u8be2\u76d8\u3002',
    showing: '\u5f53\u524d\u663e\u793a',
    items: '\u4e2a\u5546\u54c1',
    allProducts: '\u5168\u90e8\u5546\u54c1',
    details: '\u67e5\u770b\u8be6\u60c5',
    inquiry: '\u8be2\u76d8',
    loadMore: '\u52a0\u8f7d\u66f4\u591a',
    back: '\u8fd4\u56de\u5546\u54c1\u5217\u8868',
    inquiryNow: '\u7acb\u5373\u8be2\u76d8',
    source: '\u6765\u6e90',
    specifications: '\u4ea7\u54c1\u89c4\u683c',
    detailTitle: '\u4ea7\u54c1\u8be6\u60c5',
    productDescription: '\u8be5\u5546\u54c1\u9002\u5408\u56e2\u961f\u91c7\u8d2d\u3001\u95e8\u5e97\u9009\u54c1\u548c\u4f53\u80b2\u8bad\u7ec3\u573a\u666f\u3002\u8bf7\u8054\u7cfb\u6211\u4eec\u83b7\u53d6\u6570\u91cf\u3001\u5b9a\u5236\u548c\u4ea4\u4ed8\u4fe1\u606f\u3002',
    scenario: '\u56e2\u961f\u91c7\u8d2d\u3001\u5b66\u6821\u8bad\u7ec3\u3001\u4f53\u80b2\u7528\u54c1\u96f6\u552e',
    highlight1: '\u652f\u6301\u6279\u91cf\u8be2\u76d8',
    highlight2: '\u652f\u6301\u5b9a\u5236\u91c7\u8d2d\u6c9f\u901a',
    specCategory: '\u5206\u7c7b',
    specUseCase: '\u9002\u7528\u573a\u666f',
    sectionProductDetails: '\u4ea7\u54c1\u8be6\u60c5',
  },
  en: uiByLanguage.en,
  es: uiByLanguage.es,
  fr: {
    catalogEyebrow: 'Catalogue de produits',
    catalogTitle: 'Catalogue de produits',
    catalogIntro: 'Parcourez les images et modeles de produits, ouvrez les details ou envoyez une demande.',
    showing: 'Affichage',
    items: 'produits',
    allProducts: 'Tous les produits',
    details: 'Voir details',
    inquiry: 'Demande',
    loadMore: 'Charger plus',
    back: 'Retour aux produits',
    inquiryNow: 'Demander maintenant',
    source: 'Source',
    specifications: 'Specifications',
    detailTitle: 'Details',
    productDescription: 'Ce produit convient aux achats d equipe, a la vente et a l entrainement sportif.',
    scenario: 'Achat equipe, entrainement scolaire, vente sportive',
    highlight1: 'Demande en volume disponible',
    highlight2: 'Personnalisation disponible',
    specCategory: 'Categorie',
    specUseCase: 'Usage',
    sectionProductDetails: 'Details du produit',
  },
  de: {
    catalogEyebrow: 'Produktkatalog',
    catalogTitle: 'Produktkatalog',
    catalogIntro: 'Produktbilder und Modelle ansehen, Details offnen oder Anfrage senden.',
    showing: 'Angezeigt',
    items: 'Produkte',
    allProducts: 'Alle Produkte',
    details: 'Details ansehen',
    inquiry: 'Anfrage',
    loadMore: 'Mehr laden',
    back: 'Zuruck zu Produkten',
    inquiryNow: 'Jetzt anfragen',
    source: 'Quelle',
    specifications: 'Spezifikationen',
    detailTitle: 'Details',
    productDescription: 'Dieses Produkt eignet sich fur Teameinkauf, Handel und Sporttraining.',
    scenario: 'Teameinkauf, Schultraining, Sportartikelhandel',
    highlight1: 'Mengenanfrage moglich',
    highlight2: 'Anpassung moglich',
    specCategory: 'Kategorie',
    specUseCase: 'Nutzung',
    sectionProductDetails: 'Produktdetails',
  },
  pt: {
    catalogEyebrow: 'Catalogo de produtos',
    catalogTitle: 'Catalogo de produtos',
    catalogIntro: 'Veja imagens e modelos, abra detalhes ou envie uma consulta.',
    showing: 'Exibindo',
    items: 'produtos',
    allProducts: 'Todos os produtos',
    details: 'Ver detalhes',
    inquiry: 'Consulta',
    loadMore: 'Carregar mais',
    back: 'Voltar aos produtos',
    inquiryNow: 'Consultar agora',
    source: 'Fonte',
    specifications: 'Especificacoes',
    detailTitle: 'Detalhes',
    productDescription: 'Este produto e adequado para compras de equipe, varejo e treinamento esportivo.',
    scenario: 'Compra de equipe, treino escolar, varejo esportivo',
    highlight1: 'Consulta em volume disponivel',
    highlight2: 'Personalizacao disponivel',
    specCategory: 'Categoria',
    specUseCase: 'Uso',
    sectionProductDetails: 'Detalhes do produto',
  },
  ru: {
    catalogEyebrow: '\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0442\u043e\u0432\u0430\u0440\u043e\u0432',
    catalogTitle: '\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0442\u043e\u0432\u0430\u0440\u043e\u0432',
    catalogIntro: '\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0444\u043e\u0442\u043e \u0438 \u043c\u043e\u0434\u0435\u043b\u0438, \u043e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0434\u0435\u0442\u0430\u043b\u0438 \u0438\u043b\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0437\u0430\u043f\u0440\u043e\u0441.',
    showing: '\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u043e',
    items: '\u0442\u043e\u0432\u0430\u0440\u043e\u0432',
    allProducts: '\u0412\u0441\u0435 \u0442\u043e\u0432\u0430\u0440\u044b',
    details: '\u0414\u0435\u0442\u0430\u043b\u0438',
    inquiry: '\u0417\u0430\u043f\u0440\u043e\u0441',
    loadMore: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0435\u0449\u0435',
    back: '\u041d\u0430\u0437\u0430\u0434 \u043a \u0442\u043e\u0432\u0430\u0440\u0430\u043c',
    inquiryNow: '\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c',
    source: '\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a',
    specifications: '\u0425\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438',
    detailTitle: '\u0414\u0435\u0442\u0430\u043b\u0438',
    productDescription: '\u0422\u043e\u0432\u0430\u0440 \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0434\u043b\u044f \u043a\u043e\u043c\u0430\u043d\u0434, \u0448\u043a\u043e\u043b \u0438 \u0441\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u043e\u0439 \u0440\u043e\u0437\u043d\u0438\u0446\u044b.',
    scenario: '\u041a\u043e\u043c\u0430\u043d\u0434\u044b, \u0448\u043a\u043e\u043b\u044b, \u0441\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u0430\u044f \u0440\u043e\u0437\u043d\u0438\u0446\u0430',
    highlight1: '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043e\u043f\u0442\u043e\u0432\u044b\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u044b',
    highlight2: '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u043a\u0430\u0441\u0442\u043e\u043c\u0438\u0437\u0430\u0446\u0438\u044f',
    specCategory: '\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f',
    specUseCase: '\u041f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u0435',
    sectionProductDetails: '\u0414\u0435\u0442\u0430\u043b\u0438 \u0442\u043e\u0432\u0430\u0440\u0430',
  },
};
const uiText = (language: string, key: string) => strictUiByLanguage[language]?.[key] || uiByLanguage[language]?.[key] || uiByLanguage.en[key] || key;

Object.assign(strictUiByLanguage, {
  ar: {
    catalogEyebrow: '\u0643\u062a\u0627\u0644\u0648\u062c \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
    catalogTitle: '\u0643\u062a\u0627\u0644\u0648\u062c \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
    catalogIntro: '\u062a\u0635\u0641\u062d \u0635\u0648\u0631 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0648\u0627\u0644\u0645\u0648\u062f\u064a\u0644\u0627\u062a \u0648\u0623\u0631\u0633\u0644 \u0637\u0644\u0628\u0627.',
    showing: '\u064a\u0639\u0631\u0636',
    items: '\u0645\u0646\u062a\u062c',
    allProducts: '\u0643\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
    details: '\u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644',
    inquiry: '\u0637\u0644\u0628',
    loadMore: '\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0632\u064a\u062f',
    back: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0645\u0646\u062a\u062c\u0627\u062a',
    inquiryNow: '\u0627\u0633\u062a\u0641\u0633\u0631 \u0627\u0644\u0622\u0646',
    source: '\u0627\u0644\u0645\u0635\u062f\u0631',
    specifications: '\u0627\u0644\u0645\u0648\u0627\u0635\u0641\u0627\u062a',
    detailTitle: '\u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644',
    productDescription: '\u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c \u0645\u0646\u0627\u0633\u0628 \u0644\u0634\u0631\u0627\u0621 \u0627\u0644\u0641\u0631\u0642 \u0648\u0627\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0627\u0644\u0645\u062a\u0627\u062c\u0631.',
    scenario: '\u0627\u0644\u0641\u0631\u0642\u060c \u0627\u0644\u0645\u062f\u0627\u0631\u0633\u060c \u062a\u062c\u0627\u0631\u0629 \u0627\u0644\u0631\u064a\u0627\u0636\u0629',
    highlight1: '\u0637\u0644\u0628\u0627\u062a \u062c\u0645\u0644\u0629',
    highlight2: '\u062f\u0639\u0645 \u0627\u0644\u062a\u062e\u0635\u064a\u0635',
    specCategory: '\u0641\u0626\u0629',
    specUseCase: '\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645',
    sectionProductDetails: '\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c',
  },
  ja: {
    catalogEyebrow: '\u5546\u54c1\u30ab\u30bf\u30ed\u30b0',
    catalogTitle: '\u5546\u54c1\u30ab\u30bf\u30ed\u30b0',
    catalogIntro: '\u5546\u54c1\u753b\u50cf\u3068\u30e2\u30c7\u30eb\u3092\u78ba\u8a8d\u3057\u3001\u8a73\u7d30\u8868\u793a\u307e\u305f\u306f\u554f\u3044\u5408\u308f\u305b\u304c\u3067\u304d\u307e\u3059\u3002',
    showing: '\u8868\u793a\u4e2d',
    items: '\u5546\u54c1',
    allProducts: '\u3059\u3079\u3066\u306e\u5546\u54c1',
    details: '\u8a73\u7d30\u3092\u898b\u308b',
    inquiry: '\u554f\u3044\u5408\u308f\u305b',
    loadMore: '\u3082\u3063\u3068\u8868\u793a',
    back: '\u5546\u54c1\u4e00\u89a7\u3078\u623b\u308b',
    inquiryNow: '\u4eca\u3059\u3050\u554f\u3044\u5408\u308f\u305b',
    source: '\u30bd\u30fc\u30b9',
    specifications: '\u4ed5\u69d8',
    detailTitle: '\u8a73\u7d30',
    productDescription: '\u30c1\u30fc\u30e0\u8cfc\u5165\u3001\u5b66\u6821\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u3001\u30b9\u30dd\u30fc\u30c4\u5c0f\u58f2\u306b\u9069\u3057\u305f\u5546\u54c1\u3067\u3059\u3002',
    scenario: '\u30c1\u30fc\u30e0\u8cfc\u5165\u3001\u5b66\u6821\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u3001\u30b9\u30dd\u30fc\u30c4\u5c0f\u58f2',
    highlight1: '\u5927\u53e3\u554f\u3044\u5408\u308f\u305b\u5bfe\u5fdc',
    highlight2: '\u30ab\u30b9\u30bf\u30e0\u5bfe\u5fdc',
    specCategory: '\u30ab\u30c6\u30b4\u30ea',
    specUseCase: '\u7528\u9014',
    sectionProductDetails: '\u5546\u54c1\u8a73\u7d30',
  },
  ko: {
    catalogEyebrow: '\uc0c1\ud488 \uce74\ud0c8\ub85c\uadf8',
    catalogTitle: '\uc0c1\ud488 \uce74\ud0c8\ub85c\uadf8',
    catalogIntro: '\uc0c1\ud488 \uc774\ubbf8\uc9c0\uc640 \ubaa8\ub378\uc744 \ud655\uc778\ud558\uace0 \uc0c1\uc138 \ub610\ub294 \ubb38\uc758\ub97c \uc774\uc6a9\ud558\uc138\uc694.',
    showing: '\ud45c\uc2dc',
    items: '\uc0c1\ud488',
    allProducts: '\uc804\uccb4 \uc0c1\ud488',
    details: '\uc0c1\uc138 \ubcf4\uae30',
    inquiry: '\ubb38\uc758',
    loadMore: '\ub354 \ubcf4\uae30',
    back: '\uc0c1\ud488 \ubaa9\ub85d\uc73c\ub85c',
    inquiryNow: '\uc9c0\uae08 \ubb38\uc758',
    source: '\ucd9c\ucc98',
    specifications: '\uc0ac\uc591',
    detailTitle: '\uc0c1\uc138',
    productDescription: '\ud300 \uad6c\ub9e4, \ud559\uad50 \ud6c8\ub828, \uc2a4\ud3ec\uce20 \uc18c\ub9e4\uc5d0 \uc801\ud569\ud55c \uc0c1\ud488\uc785\ub2c8\ub2e4.',
    scenario: '\ud300 \uad6c\ub9e4, \ud559\uad50 \ud6c8\ub828, \uc2a4\ud3ec\uce20 \uc18c\ub9e4',
    highlight1: '\ub300\ub7c9 \ubb38\uc758 \uac00\ub2a5',
    highlight2: '\ub9de\ucda4 \uc0c1\ub2f4 \uac00\ub2a5',
    specCategory: '\uce74\ud14c\uace0\ub9ac',
    specUseCase: '\uc6a9\ub3c4',
    sectionProductDetails: '\uc0c1\ud488 \uc0c1\uc138',
  },
});

['it', 'nl', 'tr', 'vi', 'id'].forEach((code) => {
  if (!strictUiByLanguage[code]) strictUiByLanguage[code] = strictUiByLanguage.en;
});

const termTranslations: Record<string, Record<string, string>> = {
  zh: { 'Thermal Bonded': '\u70ed\u7c98\u5408', 'Machine Stitched': '\u673a\u7f1d', 'World Cup': '\u4e16\u754c\u676f', 'European Cup': '\u6b27\u6d32\u676f', Album: '\u76f8\u518c', Category: '\u5206\u7c7b', Product: '\u5546\u54c1', Item: '\u5546\u54c1' },
  es: { 'Thermal Bonded': 'Termosellado', 'Machine Stitched': 'Cosido a maquina', 'World Cup': 'Copa Mundial', 'European Cup': 'Copa Europea', Album: 'Album', Category: 'Categoria', Product: 'Producto', Item: 'Producto' },
  fr: { 'Thermal Bonded': 'Thermocolle', 'Machine Stitched': 'Cousu machine', 'World Cup': 'Coupe du monde', 'European Cup': 'Coupe europeenne', Album: 'Album', Category: 'Categorie', Product: 'Produit', Item: 'Produit' },
  de: { 'Thermal Bonded': 'Thermisch geklebt', 'Machine Stitched': 'Maschinengen盲ht', 'World Cup': 'Weltmeisterschaft', 'European Cup': 'Europapokal', Album: 'Album', Category: 'Kategorie', Product: 'Produkt', Item: 'Produkt' },
  pt: { 'Thermal Bonded': 'Termocolado', 'Machine Stitched': 'Costurado a maquina', 'World Cup': 'Copa do Mundo', 'European Cup': 'Copa Europeia', Album: 'Album', Category: 'Categoria', Product: 'Produto', Item: 'Produto' },
  ru: { 'Thermal Bonded': '\u0422\u0435\u0440\u043c\u043e\u0441\u043a\u043b\u0435\u0439\u043a\u0430', 'Machine Stitched': '\u041c\u0430\u0448\u0438\u043d\u043d\u0430\u044f \u0441\u0442\u0440\u043e\u0447\u043a\u0430', 'World Cup': '\u041a\u0443\u0431\u043e\u043a \u043c\u0438\u0440\u0430', 'European Cup': '\u041a\u0443\u0431\u043e\u043a \u0415\u0432\u0440\u043e\u043f\u044b', Album: '\u0410\u043b\u044c\u0431\u043e\u043c', Category: '\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044f', Product: '\u0422\u043e\u0432\u0430\u0440', Item: '\u0422\u043e\u0432\u0430\u0440' },
  ar: { 'Thermal Bonded': '\u0644\u062d\u0627\u0645 \u062d\u0631\u0627\u0631\u064a', 'Machine Stitched': '\u062e\u064a\u0627\u0637\u0629 \u0622\u0644\u064a\u0629', 'World Cup': '\u0643\u0623\u0633 \u0627\u0644\u0639\u0627\u0644\u0645', 'European Cup': '\u0643\u0623\u0633 \u0623\u0648\u0631\u0648\u0628\u0627', Album: '\u0623\u0644\u0628\u0648\u0645', Category: '\u0641\u0626\u0629', Product: '\u0645\u0646\u062a\u062c', Item: '\u0645\u0646\u062a\u062c' },
  ja: { 'Thermal Bonded': '\u71b1\u63a5\u7740', 'Machine Stitched': '\u30df\u30b7\u30f3\u7e2b\u3044', 'World Cup': '\u30ef\u30fc\u30eb\u30c9\u30ab\u30c3\u30d7', 'European Cup': '\u30e8\u30fc\u30ed\u30c3\u30d1\u30ab\u30c3\u30d7', Album: '\u30a2\u30eb\u30d0\u30e0', Category: '\u30ab\u30c6\u30b4\u30ea', Product: '\u5546\u54c1', Item: '\u5546\u54c1' },
  ko: { 'Thermal Bonded': '\uc5f4\uc811\ucc29', 'Machine Stitched': '\uae30\uacc4 \ubd09\uc81c', 'World Cup': '\uc6d4\ub4dc\ucef5', 'European Cup': '\uc720\ub7fd\ucef5', Album: '\uc568\ubc94', Category: '\uce74\ud14c\uace0\ub9ac', Product: '\uc0c1\ud488', Item: '\uc0c1\ud488' },
  it: { 'Thermal Bonded': 'Termosaldato', 'Machine Stitched': 'Cucito a macchina', 'World Cup': 'Coppa del mondo', 'European Cup': 'Coppa europea', Album: 'Album', Category: 'Categoria', Product: 'Prodotto', Item: 'Prodotto' },
  nl: { 'Thermal Bonded': 'Thermisch gebonden', 'Machine Stitched': 'Machinaal gestikt', 'World Cup': 'Wereldbeker', 'European Cup': 'Europese beker', Album: 'Album', Category: 'Categorie', Product: 'Product', Item: 'Product' },
  tr: { 'Thermal Bonded': 'Isil yapistirma', 'Machine Stitched': 'Makine dikisli', 'World Cup': 'Dunya Kupasi', 'European Cup': 'Avrupa Kupasi', Album: 'Album', Category: 'Kategori', Product: 'Urun', Item: 'Urun' },
  vi: { 'Thermal Bonded': 'Dan nhiet', 'Machine Stitched': 'May bang may', 'World Cup': 'World Cup', 'European Cup': 'Cup Chau Au', Album: 'Album', Category: 'Danh muc', Product: 'San pham', Item: 'San pham' },
  id: { 'Thermal Bonded': 'Ikatan panas', 'Machine Stitched': 'Jahitan mesin', 'World Cup': 'Piala Dunia', 'European Cup': 'Piala Eropa', Album: 'Album', Category: 'Kategori', Product: 'Produk', Item: 'Produk' },
};

const translateCmsTerm = (language: string, value = '') => {
  const text = value.trim();
  if (!text) return text;
  if (language === 'en') return text;
  const dictionary = { ...(cmsCategoryTranslations[language] || {}), ...(termTranslations[language] || {}) };
  if (dictionary[text]) return dictionary[text];
  const knownKey = Object.keys(termTranslations.en || {}).find((key) => text.toLowerCase().includes(key.toLowerCase()));
  if (knownKey && dictionary[knownKey]) return dictionary[knownKey];
  return dictionary.Product || dictionary.Item || text;
};
const localizedProductName = (language: string, productName: string) => {
  if (language === 'en') return productName;
  return localizedProductNameStrict(language, productName);
};const localizedProductCopy = (product: CmsProduct, language: string) => {
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

const localizedProductNameStrict = (language: string, productName: string) => {
  if (language === 'en') return productName;
  const dictionary = termTranslations[language] || {};
  const number = productName.match(/(\d+)$/)?.[1] || productName.match(/-(\d+)/)?.[1] || '';
  const key = ['World Cup', 'European Cup', 'Machine Stitched', 'Thermal Bonded'].find((item) =>
    productName.toLowerCase().includes(item.toLowerCase()),
  );
  if (key && dictionary[key]) return `${dictionary[key]}${number ? `-${number}` : ''}`;
  return `${dictionary.Product || dictionary.Item || uiText(language, 'allProducts')}${number ? `-${number}` : ''}`;
};

const localizedProductCopyStrict = (product: CmsProduct, language: string) => {
  if (language === 'en') return localizedProductCopy(product, language);
  const direct = product.translations?.[language];
  return {
    name: localizedProductNameStrict(language, direct?.name || product.name),
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
  const labels = cleanCategoryLabels[language] || categoryLabels.en;
  const direction = languages.find((item) => item.code === language)?.dir ?? 'ltr';

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = direction;
    document.title =
      language === 'zh'
        ? '\u4e34\u6c82\u745e\u6f9c\u68ee\u70ac | \u4f53\u80b2\u7528\u54c1\u5b98\u7f51'
        : `${text.brand} | ${text.tagline}`;
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
            category: cleanCategoryLabels.zh[legacy.category],
            album: cleanCategoryLabels.zh[legacy.category],
            description: getProductText(legacy, 'zh').highlight,
            scenario: getProductText(legacy, 'zh').scenario,
          },
        },
        specs: [
          { label: 'Category', value: labels[legacy.category] },
          { label: 'Use Case', value: legacyText.scenario },
        ],
        detailSections: [{ title: uiText(language, 'sectionProductDetails'), body: legacyText.highlight }],
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

  const useCmsCopy = language === 'en';
  const displayBrand = text.brand;
  const cmsCopy = {
    tagline: useCmsCopy ? siteSettings.tagline : text.tagline,
    heroBadge: useCmsCopy ? siteSettings.heroBadge : text.hero.badge,
    heroTitle: useCmsCopy ? siteSettings.heroTitle : text.hero.title,
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
                const productText = localizedProductCopyStrict(product, language);
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
                const productText = language === 'en'
                  ? getProductText(product, language)
                  : {
                      name: labels[product.category],
                      highlight: uiText(language, 'productDescription'),
                      scenario: uiText(language, 'scenario'),
                    };
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
  const text = localizedProductCopyStrict(product, language);
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
              {(language === 'en' && product.translations?.[language]?.description
                ? product.detailSections || []
                : [{ title: uiText(language, 'sectionProductDetails'), body: text.description || uiText(language, 'productDescription') }]
              ).map((section) => (
                <article key={section.title}>
                  <h3 className="font-black">{language === 'en' && product.translations?.[language]?.description ? section.title : uiText(language, 'sectionProductDetails')}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{language === 'en' && product.translations?.[language]?.description ? section.body : text.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



