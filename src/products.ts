import type { LanguageCode } from './i18n';

export type CategoryId =
  | 'football'
  | 'volleyball'
  | 'basketball'
  | 'tennis'
  | 'cricket'
  | 'badminton'
  | 'sportsBag'
  | 'sportsTshirt';

export type Product = {
  id: string;
  category: CategoryId;
  priceRange: string;
  image: string;
  translations: Record<'zh' | 'en', {
    name: string;
    highlight: string;
    scenario: string;
  }>;
};

export const categoryIds: CategoryId[] = [
  'football',
  'volleyball',
  'basketball',
  'tennis',
  'cricket',
  'badminton',
  'sportsBag',
  'sportsTshirt',
];

export const categoryImages: Record<CategoryId, string> = {
  football: '/assets/football.svg',
  volleyball: '/assets/volleyball.svg',
  basketball: '/assets/basketball.svg',
  tennis: '/assets/tennis.svg',
  cricket: '/assets/cricket.svg',
  badminton: '/assets/badminton.svg',
  sportsBag: '/assets/backpack.svg',
  sportsTshirt: '/assets/tshirt.svg',
};

export const categoryLabels: Record<LanguageCode, Record<CategoryId, string>> = {
  zh: {
    football: '足球',
    volleyball: '排球',
    basketball: '篮球',
    tennis: '网球',
    cricket: '板球',
    badminton: '羽毛球',
    sportsBag: '运动书包',
    sportsTshirt: '运动T恤',
  },
  en: {
    football: 'Football',
    volleyball: 'Volleyball',
    basketball: 'Basketball',
    tennis: 'Tennis',
    cricket: 'Cricket',
    badminton: 'Badminton',
    sportsBag: 'Sports Bag',
    sportsTshirt: 'Sports T-shirt',
  },
  es: {
    football: 'Fútbol',
    volleyball: 'Voleibol',
    basketball: 'Baloncesto',
    tennis: 'Tenis',
    cricket: 'Críquet',
    badminton: 'Bádminton',
    sportsBag: 'Bolsa deportiva',
    sportsTshirt: 'Camiseta deportiva',
  },
  fr: {
    football: 'Football',
    volleyball: 'Volley-ball',
    basketball: 'Basket-ball',
    tennis: 'Tennis',
    cricket: 'Cricket',
    badminton: 'Badminton',
    sportsBag: 'Sac de sport',
    sportsTshirt: 'T-shirt de sport',
  },
  de: {
    football: 'Fußball',
    volleyball: 'Volleyball',
    basketball: 'Basketball',
    tennis: 'Tennis',
    cricket: 'Cricket',
    badminton: 'Badminton',
    sportsBag: 'Sporttasche',
    sportsTshirt: 'Sport-T-Shirt',
  },
  pt: {
    football: 'Futebol',
    volleyball: 'Voleibol',
    basketball: 'Basquete',
    tennis: 'Tênis',
    cricket: 'Críquete',
    badminton: 'Badminton',
    sportsBag: 'Bolsa esportiva',
    sportsTshirt: 'Camiseta esportiva',
  },
  ru: {
    football: 'Футбол',
    volleyball: 'Волейбол',
    basketball: 'Баскетбол',
    tennis: 'Теннис',
    cricket: 'Крикет',
    badminton: 'Бадминтон',
    sportsBag: 'Спортивная сумка',
    sportsTshirt: 'Спортивная футболка',
  },
  ar: {
    football: 'كرة القدم',
    volleyball: 'الكرة الطائرة',
    basketball: 'كرة السلة',
    tennis: 'التنس',
    cricket: 'الكريكيت',
    badminton: 'الريشة الطائرة',
    sportsBag: 'حقيبة رياضية',
    sportsTshirt: 'قميص رياضي',
  },
  ja: {
    football: 'サッカー',
    volleyball: 'バレーボール',
    basketball: 'バスケットボール',
    tennis: 'テニス',
    cricket: 'クリケット',
    badminton: 'バドミントン',
    sportsBag: 'スポーツバッグ',
    sportsTshirt: 'スポーツTシャツ',
  },
  ko: {
    football: '축구',
    volleyball: '배구',
    basketball: '농구',
    tennis: '테니스',
    cricket: '크리켓',
    badminton: '배드민턴',
    sportsBag: '스포츠 가방',
    sportsTshirt: '스포츠 티셔츠',
  },
  it: {
    football: 'Calcio',
    volleyball: 'Pallavolo',
    basketball: 'Basket',
    tennis: 'Tennis',
    cricket: 'Cricket',
    badminton: 'Badminton',
    sportsBag: 'Borsa sportiva',
    sportsTshirt: 'T-shirt sportiva',
  },
  nl: {
    football: 'Voetbal',
    volleyball: 'Volleybal',
    basketball: 'Basketbal',
    tennis: 'Tennis',
    cricket: 'Cricket',
    badminton: 'Badminton',
    sportsBag: 'Sporttas',
    sportsTshirt: 'Sport T-shirt',
  },
  tr: {
    football: 'Futbol',
    volleyball: 'Voleybol',
    basketball: 'Basketbol',
    tennis: 'Tenis',
    cricket: 'Kriket',
    badminton: 'Badminton',
    sportsBag: 'Spor Çantası',
    sportsTshirt: 'Spor Tişörtü',
  },
  vi: {
    football: 'Bóng đá',
    volleyball: 'Bóng chuyền',
    basketball: 'Bóng rổ',
    tennis: 'Quần vợt',
    cricket: 'Cricket',
    badminton: 'Cầu lông',
    sportsBag: 'Túi thể thao',
    sportsTshirt: 'Áo thun thể thao',
  },
  id: {
    football: 'Sepak bola',
    volleyball: 'Voli',
    basketball: 'Bola basket',
    tennis: 'Tenis',
    cricket: 'Kriket',
    badminton: 'Bulu tangkis',
    sportsBag: 'Tas olahraga',
    sportsTshirt: 'Kaos olahraga',
  },
};

const product = (
  id: string,
  category: CategoryId,
  priceRange: string,
  image: string,
  zh: Product['translations']['zh'],
  en: Product['translations']['en'],
): Product => ({
  id,
  category,
  priceRange,
  image,
  translations: { zh, en },
});

export const products: Product[] = [
  product(
    'football-match-pro',
    'football',
    '$18-28',
    '/assets/football.svg',
    { name: '比赛级训练足球', highlight: '热粘合球面，脚感稳定，适合高频训练。', scenario: '校园联赛、俱乐部训练、五人制比赛' },
    { name: 'Match Training Football', highlight: 'Thermo-bonded surface with stable touch for frequent training.', scenario: 'School leagues, club training, futsal matches' },
  ),
  product(
    'football-youth',
    'football',
    '$10-16',
    '/assets/football.svg',
    { name: '青训耐磨足球', highlight: '加厚PU外皮，耐磨抗踢，适合入门训练。', scenario: '青少年训练、体育课、社区球场' },
    { name: 'Youth Durable Football', highlight: 'Thick PU cover for durable beginner training.', scenario: 'Youth training, PE classes, community fields' },
  ),
  product(
    'football-futsal',
    'football',
    '$14-22',
    '/assets/football.svg',
    { name: '低弹五人制足球', highlight: '低弹内胆控制滚动速度，室内控球更精准。', scenario: '室内五人制、硬地球场、技术训练' },
    { name: 'Low-bounce Futsal Ball', highlight: 'Low-bounce bladder improves indoor ball control.', scenario: 'Indoor futsal, hard courts, technical drills' },
  ),
  product(
    'volleyball-indoor',
    'volleyball',
    '$12-20',
    '/assets/volleyball.svg',
    { name: '室内训练排球', highlight: '柔软触感表层，接发球不震手。', scenario: '室内馆训练、校队备赛、日常教学' },
    { name: 'Indoor Training Volleyball', highlight: 'Soft-touch surface for comfortable passing and serving.', scenario: 'Indoor gyms, school teams, daily coaching' },
  ),
  product(
    'volleyball-beach',
    'volleyball',
    '$16-26',
    '/assets/volleyball.svg',
    { name: '沙滩耐水排球', highlight: '防滑纹理和耐水外皮，户外使用更稳定。', scenario: '沙滩排球、户外团建、度假运动' },
    { name: 'Water-resistant Beach Volleyball', highlight: 'Grip texture and water-resistant cover for outdoor play.', scenario: 'Beach games, outdoor events, resorts' },
  ),
  product(
    'volleyball-pro',
    'volleyball',
    '$24-36',
    '/assets/volleyball.svg',
    { name: '比赛级复合排球', highlight: '多片贴合结构，飞行路线更可控。', scenario: '专业训练、比赛、俱乐部采购' },
    { name: 'Composite Match Volleyball', highlight: 'Panel construction supports stable flight control.', scenario: 'Advanced training, matches, club sourcing' },
  ),
  product(
    'basketball-street',
    'basketball',
    '$14-22',
    '/assets/basketball.svg',
    { name: '街头耐磨篮球', highlight: '深沟纹理抓手强，水泥地也耐打。', scenario: '户外球场、街头比赛、日常训练' },
    { name: 'Outdoor Street Basketball', highlight: 'Deep channels and durable cover for outdoor courts.', scenario: 'Outdoor courts, street games, daily training' },
  ),
  product(
    'basketball-indoor',
    'basketball',
    '$22-34',
    '/assets/basketball.svg',
    { name: '室内贴皮篮球', highlight: '细腻贴皮手感，运球和投篮反馈清晰。', scenario: '木地板球馆、校队训练、篮球营' },
    { name: 'Indoor Composite Basketball', highlight: 'Soft composite feel for clear dribble and shooting feedback.', scenario: 'Indoor courts, school teams, camps' },
  ),
  product(
    'basketball-youth',
    'basketball',
    '$11-18',
    '/assets/basketball.svg',
    { name: '青少年5号篮球', highlight: '轻量规格，适合儿童和青少年控球学习。', scenario: '少儿训练、亲子运动、体育课' },
    { name: 'Youth Size 5 Basketball', highlight: 'Lightweight size for young players learning ball control.', scenario: 'Kids training, family sports, PE classes' },
  ),
  product(
    'tennis-racket-control',
    'tennis',
    '$42-70',
    '/assets/tennis.svg',
    { name: '控球型网球拍', highlight: '中等拍面和轻量拍框，兼顾控球与挥速。', scenario: '初中级训练、俱乐部课程、双打练习' },
    { name: 'Control Tennis Racket', highlight: 'Balanced head size and light frame for control and swing speed.', scenario: 'Beginner-intermediate training, club lessons, doubles' },
  ),
  product(
    'tennis-balls',
    'tennis',
    '$6-10 / tube',
    '/assets/tennis.svg',
    { name: '高弹训练网球', highlight: '耐磨毛毡，弹跳稳定，开罐后寿命更长。', scenario: '发球机训练、课程消耗、比赛热身' },
    { name: 'Training Tennis Balls', highlight: 'Durable felt and stable bounce for training consumption.', scenario: 'Ball machines, lessons, warm-ups' },
  ),
  product(
    'tennis-bag',
    'tennis',
    '$22-38',
    '/assets/tennis.svg',
    { name: '双拍位网球包', highlight: '独立球拍仓和鞋袋，训练装备分区收纳。', scenario: '网球训练、通勤运动、赛事出行' },
    { name: 'Two-racket Tennis Bag', highlight: 'Separate racket space and shoe pocket for organized training gear.', scenario: 'Tennis practice, commuting, tournaments' },
  ),
  product(
    'cricket-bat',
    'cricket',
    '$56-112',
    '/assets/cricket.svg',
    { name: '柳木板球拍', highlight: '精选柳木击球面，重心稳，出球力量扎实。', scenario: '板球俱乐部、成人训练、赛事备品' },
    { name: 'Willow Cricket Bat', highlight: 'Selected willow face with stable balance and strong hitting feel.', scenario: 'Cricket clubs, adult training, event supply' },
  ),
  product(
    'cricket-ball',
    'cricket',
    '$8-14',
    '/assets/cricket.svg',
    { name: '皮面训练板球', highlight: '手工缝线明显，适合投球和击球专项练习。', scenario: '基础训练、学校社团、俱乐部消耗' },
    { name: 'Leather Training Cricket Ball', highlight: 'Visible stitched seam for bowling and batting drills.', scenario: 'Basic training, school clubs, club consumption' },
  ),
  product(
    'cricket-protect',
    'cricket',
    '$42-84',
    '/assets/cricket.svg',
    { name: '板球护具套装', highlight: '腿垫、手套和护臂组合，覆盖核心防护。', scenario: '青训入门、成人训练、团队采购' },
    { name: 'Cricket Protection Set', highlight: 'Pads, gloves and guards cover key protection needs.', scenario: 'Youth entry, adult training, team purchasing' },
  ),
  product(
    'badminton-racket-speed',
    'badminton',
    '$28-56',
    '/assets/badminton.svg',
    { name: '速度型羽毛球拍', highlight: '轻量碳素拍杆，连贯快，适合双打平抽挡。', scenario: '羽毛球馆、双打训练、公司比赛' },
    { name: 'Speed Badminton Racket', highlight: 'Light carbon shaft for fast rallies and doubles play.', scenario: 'Badminton halls, doubles training, company matches' },
  ),
  product(
    'badminton-shuttle',
    'badminton',
    '$7-13 / tube',
    '/assets/badminton.svg',
    { name: '耐打训练羽毛球', highlight: '稳定飞行轨迹，耐打度适合高频训练。', scenario: '日常训练、课程消耗、俱乐部备货' },
    { name: 'Durable Training Shuttlecocks', highlight: 'Stable flight and durability for frequent practice.', scenario: 'Daily training, lessons, club stock' },
  ),
  product(
    'badminton-shoes',
    'badminton',
    '$34-56',
    '/assets/badminton.svg',
    { name: '防滑羽毛球鞋', highlight: '生胶大底和侧向支撑，启动制动更安心。', scenario: '室内场馆、专项训练、赛事穿着' },
    { name: 'Anti-slip Badminton Shoes', highlight: 'Gum outsole and side support for quick indoor movement.', scenario: 'Indoor courts, focused drills, matches' },
  ),
  product(
    'backpack-team',
    'sportsBag',
    '$18-31',
    '/assets/backpack.svg',
    { name: '团队训练运动书包', highlight: '大容量主仓，球鞋、毛巾、水杯分区收纳。', scenario: '校队训练、健身通勤、俱乐部定制' },
    { name: 'Team Training Sports Backpack', highlight: 'Large main compartment with separate space for shoes, towels and bottles.', scenario: 'School teams, gym commuting, club customization' },
  ),
  product(
    'backpack-waterproof',
    'sportsBag',
    '$22-38',
    '/assets/backpack.svg',
    { name: '防泼水运动背包', highlight: '防泼水面料和透气背负，户外训练更实用。', scenario: '户外球场、骑行通勤、旅行运动' },
    { name: 'Water-repellent Sports Backpack', highlight: 'Water-repellent fabric and breathable carry system for outdoor use.', scenario: 'Outdoor courts, cycling commute, travel sports' },
  ),
  product(
    'backpack-light',
    'sportsBag',
    '$6-12',
    '/assets/backpack.svg',
    { name: '轻量抽绳训练包', highlight: '轻便易折叠，适合装球衣和基础装备。', scenario: '短途训练、校园活动、赛事赠品' },
    { name: 'Light Drawstring Training Bag', highlight: 'Light and foldable for jerseys and basic gear.', scenario: 'Short training, campus events, giveaways' },
  ),
  product(
    'tshirt-dry',
    'sportsTshirt',
    '$10-17',
    '/assets/tshirt.svg',
    { name: '速干训练T恤', highlight: '吸湿速干面料，运动中保持轻爽。', scenario: '跑步、健身、球类训练、团队服' },
    { name: 'Quick-dry Training T-shirt', highlight: 'Moisture-wicking fabric keeps athletes comfortable during workouts.', scenario: 'Running, fitness, ball training, teamwear' },
  ),
  product(
    'tshirt-team',
    'sportsTshirt',
    '$13-23',
    '/assets/tshirt.svg',
    { name: '队服定制T恤', highlight: '支持号码、队名和品牌标识定制。', scenario: '校队比赛、企业赛事、俱乐部团购' },
    { name: 'Custom Team T-shirt', highlight: 'Supports numbers, team names and logo customization.', scenario: 'School matches, corporate events, club group orders' },
  ),
  product(
    'tshirt-compression',
    'sportsTshirt',
    '$14-24',
    '/assets/tshirt.svg',
    { name: '弹力贴合运动T恤', highlight: '弹力剪裁贴合身体，适合高强度训练。', scenario: '力量训练、篮球内搭、跑步训练' },
    { name: 'Stretch Fit Sports T-shirt', highlight: 'Elastic fit supports high-intensity training.', scenario: 'Strength workouts, basketball base layer, running' },
  ),
];

export const featuredProducts = products.filter((product) =>
  [
    'football-match-pro',
    'basketball-indoor',
    'badminton-racket-speed',
    'backpack-team',
    'tshirt-team',
    'tennis-racket-control',
  ].includes(product.id),
);

export const getProductText = (product: Product, language: LanguageCode) =>
  product.translations[language === 'zh' ? 'zh' : 'en'];
