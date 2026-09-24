export type TourTheme = "tea" | "heritage" | "nature";

type LocalizedText = { en: string; zh: string };

export type Tour = {
  slug: string;
  theme: TourTheme;
  category: LocalizedText;
  title: LocalizedText;
  location: LocalizedText;
  highlight: LocalizedText;
  hostName: string;
  hostTitle: LocalizedText;
  duration: LocalizedText;
  groupSize: LocalizedText;
  price: string;
};

export const FEATURED_TOURS: Tour[] = [
  {
    slug: "alishan-oriental-beauty-tea-trail",
    theme: "tea",
    category: { en: "Tea Culture", zh: "茶文化" },
    title: {
      en: "Alishan Oriental Beauty Tea Trail",
      zh: "阿里山東方美人茶秘境之旅",
    },
    location: { en: "Alishan, Chiayi County", zh: "嘉義縣阿里山" },
    highlight: {
      en: "Hike through misty high-mountain tea gardens, hand-pick and roast your own Oriental Beauty tea with a third-generation tea master, then sip it beside a century-old kiln.",
      zh: "漫步雲霧繚繞的高山茶園，跟著三代製茶世家的茶師親手採茶、烘焙專屬東方美人茶，再於百年古窯旁細細品茗。",
    },
    hostName: "Host Wei-Ting",
    hostTitle: { en: "Third-gen tea farmer", zh: "第三代製茶世家" },
    duration: { en: "8 hrs · Private group", zh: "8 小時．私人包團" },
    groupSize: { en: "Up to 6 guests", zh: "最多 6 位貴賓" },
    price: "From $189",
  },
  {
    slug: "dadaocheng-hidden-courtyards",
    theme: "heritage",
    category: { en: "Heritage & Old Streets", zh: "人文老街" },
    title: {
      en: "Dadaocheng Hidden Courtyards",
      zh: "大稻埕隱藏版古厝巡禮",
    },
    location: { en: "Taipei Old Town", zh: "台北大稻埕" },
    highlight: {
      en: "Step inside private Baroque-era merchant houses closed to the public, wander incense-lined alleys, and end with a tea ceremony in a restored 1920s parlour.",
      zh: "走進平時不對外開放的巴洛克式洋樓古厝，穿梭飄著香氣的老街巷弄，最後在修復完成的1920年代老宅中體驗一場茶道儀式。",
    },
    hostName: "Host Amber",
    hostTitle: { en: "Architectural historian", zh: "建築史學者" },
    duration: { en: "5 hrs · Walking tour", zh: "5 小時．徒步行程" },
    groupSize: { en: "Up to 8 guests", zh: "最多 8 位貴賓" },
    price: "From $129",
  },
  {
    slug: "yangmingshan-secret-ridge-hike",
    theme: "nature",
    category: { en: "Nature & Hiking", zh: "自然健行" },
    title: {
      en: "Yangmingshan Secret Ridge Hike",
      zh: "陽明山秘境稜線健行",
    },
    location: { en: "Yangmingshan National Park", zh: "陽明山國家公園" },
    highlight: {
      en: "Follow a locals-only ridge trail past volcanic fumaroles and silver grass fields, far from the tour buses, with a farm-to-table lunch at a hidden mountain kitchen.",
      zh: "沿著只有在地人知道的稜線步道，穿越火山噴氣孔與芒草花海，遠離遊覽車人潮，並在隱世山中廚房享用一頓產地到餐桌的午餐。",
    },
    hostName: "Host Jason",
    hostTitle: { en: "Certified mountain guide", zh: "合格登山嚮導" },
    duration: { en: "7 hrs · Small group", zh: "7 小時．小團行程" },
    groupSize: { en: "Up to 6 guests", zh: "最多 6 位貴賓" },
    price: "From $159",
  },
];
