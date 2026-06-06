const ASSETS = "assets";
const WHATSAPP = "905527223847";

/** روابط السوشيال — عدّلها بروابط منشوراتك الحقيقية لاحقاً */
const SOCIAL = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
  /** مثال embed: https://www.instagram.com/p/POST_ID/embed */
  instagramEmbed: null,
  tiktokEmbed: null
};

const HERO_WORDS = [
  "الذكاء الاصطناعي",
  "التصميم الجريء",
  "الإنتاج المرئي",
  "تجربة الويب",
  "الهوية البصرية"
];

const BRAND = {
  logo: `${ASSETS}/brand/logo.jpg`,
  heroPoster: `${ASSETS}/images/hero-banner.jpeg`,
  heroVideo: `${ASSETS}/videos/showreel-1.mp4`,
  visionImage: `${ASSETS}/images/ceo-character.png`
};

/** Showreel: 3 عناصر كحد أقصى — فيديو خفيف واحد + بطاقات سوشيال */
const SHOWREEL_ITEMS = [
  {
    type: "video",
    title: "عرض Genix ID",
    poster: BRAND.heroPoster,
    src: `${ASSETS}/videos/showreel-1.mp4`
  },
  {
    type: "social",
    platform: "instagram",
    title: "إنتاج مرئي — إنستغرام",
    poster: `${ASSETS}/images/services-promo.png`,
    externalUrl: SOCIAL.instagram,
    embedUrl: SOCIAL.instagramEmbed
  },
  {
    type: "social",
    platform: "tiktok",
    title: "إنتاج مرئي — تيك توك",
    poster: `${ASSETS}/images/services-promo.png`,
    externalUrl: SOCIAL.tiktok,
    embedUrl: SOCIAL.tiktokEmbed
  }
];

const SOLUTIONS = [
  {
    id: "branding",
    title: "الهوية البصرية المستقبلية",
    desc: "صياغة أنظمة بصرية متكاملة وشعارات متطورة تتماشى مع العصر السيبراني الجديد.",
    image: `${ASSETS}/images/service-branding.jpg`,
    waText: "أرغب في حجز خدمة الهوية البصرية المستقبلية"
  },
  {
    id: "web",
    title: "تطوير الويب المتقدم",
    desc: "بناء مواقع وتطبيقات ويب تفاعلية سريعة ومحسنة كلياً لتجربة مستخدم مذهلة.",
    image: `${ASSETS}/images/hero-banner.jpeg`,
    waText: "أرغب في حجز خدمة تطوير الويب المتقدم",
    wide: true
  },
  {
    id: "bigdata",
    title: "تحليل البيانات الضخمة",
    desc: "تحويل البيانات الخام إلى رؤى استراتيجية ومؤشرات قابلة للتنفيذ.",
    image: `${ASSETS}/images/service-data.jpg`,
    waText: "أرغب في حجز خدمة تحليل البيانات الضخمة"
  },
  {
    id: "social",
    title: "إدارة حسابات التواصل الذكية",
    desc: "إدارة محتوى حساباتك التسويقية بخوارزميات الذكاء الاصطناعي لأقصى تفاعل.",
    image: `${ASSETS}/images/service-social.jpg`,
    waText: "أرغب في حجز خدمة إدارة المحتوى بالذكاء الاصطناعي"
  }
];

const PORTFOLIO = [
  {
    id: "premium",
    label: "باقات احترافية",
    cover: `${ASSETS}/images/portfolio-11.png`,
    images: [11, 12, 13, 14, 15, 16, 17, 18].map((n) => `${ASSETS}/images/portfolio-${n}.png`)
  },
  {
    id: "media",
    label: "إنتاج مرئي",
    cover: `${ASSETS}/images/services-promo.png`,
    images: [
      `${ASSETS}/images/services-promo.png`,
      `${ASSETS}/images/hero-banner.jpeg`,
      `${ASSETS}/images/service-branding.jpg`
    ],
    note: "شاهد الفيديوهات في القسم المخصص للعروض السينمائية."
  }
];
