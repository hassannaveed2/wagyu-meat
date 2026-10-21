// Launch catalogue. Prices are placeholders in PKR until real pricing is supplied.

export type SeedVariant = { sku: string; en: string; ja: string; grams: number; price: number; compareAt?: number };

export type SeedProduct = {
  slug: string;
  name: [string, string];
  short: [string, string];
  description: [string, string];
  origin: "japan" | "australia";
  grade: "A5" | "A4" | "MB8-9" | "MB6-7" | "NA";
  bms: number | null;
  region: [string, string];
  brand: string;
  productType: "steak" | "sliced" | "burger" | "bundle" | "gift-card";
  authenticityCertificate: boolean;
  contents?: [string, string];
  cooking: [string, string];
  serving: [string, string];
  images: string[];
  categories: string[];
  variants: SeedVariant[];
  featured?: boolean;
  bestSeller?: boolean;
};

const A5_COOKING: [string, string] = [
  "Thaw overnight in the fridge, then rest 20 minutes at room temperature. Pat dry and salt just before cooking. Sear in a very hot, dry cast-iron pan for 60–90 seconds a side; the steak renders its own fat. Rest 3 minutes and slice thinly against the grain.",
  "前日に冷蔵庫で解凍し、焼く20分前に常温に戻します。水気を拭き、焼く直前に塩をふります。よく熱した鉄のフライパンで片面60〜90秒ずつ焼いてください。油は不要です。3分休ませ、繊維を断つように薄く切り分けます。",
];

const AU_COOKING: [string, string] = [
  "Thaw overnight in the fridge and bring to room temperature for 30 minutes. Season generously with salt and pepper. Sear over high heat for 3–4 minutes a side for medium-rare, then rest for 5 minutes before slicing.",
  "前日に冷蔵庫で解凍し、30分ほど常温に置きます。塩・胡椒をしっかりふり、強火で片面3〜4分ずつ焼くとミディアムレアに。5分休ませてから切り分けてください。",
];

const A5_SERVING: [string, string] = [
  "A5 is very rich: plan 80–120 g per person.",
  "A5は脂が豊かなため、1人あたり80〜120gが目安です。",
];

const AU_SERVING: [string, string] = ["Plan 200–250 g per person.", "1人あたり200〜250gが目安です。"];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "a5-kagoshima-ribeye",
    name: ["A5 Kagoshima Wagyu Ribeye", "鹿児島黒牛 A5 リブロース"],
    short: [
      "BMS 11 Kuroge wagyu from Kagoshima, the reigning Wagyu Olympics champion prefecture.",
      "和牛オリンピック王者・鹿児島県産のBMS 11 黒毛和牛。",
    ],
    description: [
      "Our signature steak. Kagoshima Kuroge cattle are raised for over 30 months on a slow, grain-rich diet, producing the fine **sashi** (snowflake marbling) that melts at body temperature.\n\nEach steak is hand-cut in Japan, vacuum-sealed and frozen at peak, then shipped to Pakistan under halal certification with its official certificate of authenticity, including the animal's 10-digit identification number.",
      "当店を代表するステーキです。鹿児島黒牛は30か月以上かけて穀物中心の飼料でじっくり育てられ、人肌で溶ける細やかな「サシ」が入ります。\n\n日本で一枚ずつ手切りし、真空包装のうえ最良の状態で冷凍。ハラール認証のもとパキスタンへ輸送し、10桁の個体識別番号が記された公式の和牛証明書を同梱します。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 11,
    region: ["Kagoshima, Japan", "日本・鹿児島県"],
    brand: "Kagoshima Kuroushi",
    productType: "steak",
    authenticityCertificate: true,
    cooking: A5_COOKING,
    serving: A5_SERVING,
    images: ["/images/p-a5-ribeye.webp", "/images/origin-japan.webp", "/images/guide-sear.webp"],
    categories: ["japanese-a5", "ribeye", "steak-night", "gifting"],
    variants: [
      { sku: "A5-KAG-RIB-200", en: "200 g steak", ja: "200g", grams: 200, price: 22000 },
      { sku: "A5-KAG-RIB-300", en: "300 g steak", ja: "300g", grams: 300, price: 32500 },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    slug: "a5-miyazaki-striploin",
    name: ["A5 Miyazaki Wagyu Striploin", "宮崎牛 A5 サーロイン"],
    short: [
      "Miyazakigyu striploin, BMS 10, with a clean fat cap and a buttery, sweet finish.",
      "BMS 10の宮崎牛サーロイン。上品な脂と甘い余韻。",
    ],
    description: [
      "Miyazakigyu must be raised and processed in Miyazaki Prefecture and graded A4 or above to carry the name. The striploin is the classic steakhouse cut: a fine, even marble with a ribbon of fat along the edge that crisps beautifully in the pan.",
      "宮崎牛は宮崎県内で肥育・処理され、A4以上に格付けされたものだけが名乗れます。サーロインはステーキの王道。均一で細やかなサシと、焼くと香ばしくなる縁の脂が魅力です。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 10,
    region: ["Miyazaki, Japan", "日本・宮崎県"],
    brand: "Miyazakigyu",
    productType: "steak",
    authenticityCertificate: true,
    cooking: A5_COOKING,
    serving: A5_SERVING,
    images: ["/images/p-a5-striploin.webp", "/images/hero-a5.webp"],
    categories: ["japanese-a5", "striploin", "steak-night"],
    variants: [
      { sku: "A5-MIY-STR-200", en: "200 g steak", ja: "200g", grams: 200, price: 19500 },
      { sku: "A5-MIY-STR-300", en: "300 g steak", ja: "300g", grams: 300, price: 28500 },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    slug: "a5-tenderloin-filet",
    name: ["A5 Wagyu Tenderloin Filet", "A5 和牛 ヒレ（フィレ）"],
    short: [
      "The most tender cut of A5 wagyu, leaner than ribeye but impossibly soft.",
      "A5和牛でもっとも柔らかい部位。リブロースより脂は控えめで、驚くほどなめらか。",
    ],
    description: [
      "Only around 3% of each animal is tenderloin. Our A5 filets are cut into thick medallions that stay juicy with a short sear. A good choice if you find ribeye too rich.",
      "ヒレは一頭からわずか約3%しか取れない希少部位です。厚切りのメダリオンに仕上げ、短時間で焼いてもジューシー。リブロースでは重いと感じる方にもおすすめです。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 10,
    region: ["Kagoshima, Japan", "日本・鹿児島県"],
    brand: "Kagoshima Kuroushi",
    productType: "steak",
    authenticityCertificate: true,
    cooking: A5_COOKING,
    serving: A5_SERVING,
    images: ["/images/p-a5-tenderloin.webp"],
    categories: ["japanese-a5", "tenderloin", "steak-night", "gifting"],
    variants: [
      { sku: "A5-TEN-150", en: "1 × 150 g filet", ja: "150g × 1枚", grams: 150, price: 21000 },
      { sku: "A5-TEN-300", en: "2 × 150 g filets", ja: "150g × 2枚", grams: 300, price: 40000 },
    ],
    featured: true,
  },
  {
    slug: "a5-yakiniku-slices",
    name: ["A5 Wagyu Yakiniku Slices", "A5 和牛 焼肉用カルビ"],
    short: [
      "Bite-sized A5 slices for tabletop grilling. The easiest way to taste A5.",
      "卓上で焼ける一口サイズのA5。はじめてのA5に最適です。",
    ],
    description: [
      "Cut 5 mm thick from the chuck and short plate, these slices cook in seconds on a hot grill or pan. Dip in tare, or just a pinch of salt. A 100 g pack is the most affordable way to try A5.",
      "肩ロースとバラから5mm厚にカットしました。熱した網やフライパンで数秒焼くだけ。タレでも塩でもどうぞ。100gパックはA5をもっとも気軽に味わえるサイズです。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 9,
    region: ["Hokkaido, Japan", "日本・北海道"],
    brand: "Hokkaido Wagyu",
    productType: "sliced",
    authenticityCertificate: true,
    cooking: [
      "Thaw in the fridge. Heat a grill or pan until very hot and cook each slice 5–10 seconds a side. Dip in tare or a little salt.",
      "冷蔵庫で解凍し、網やフライパンを十分に熱して片面5〜10秒ずつ焼きます。タレや塩でお召し上がりください。",
    ],
    serving: A5_SERVING,
    images: ["/images/p-a5-yakiniku.webp", "/images/occ-yakiniku.webp"],
    categories: ["japanese-a5", "sliced", "yakiniku-bbq"],
    variants: [
      { sku: "A5-YAK-100", en: "100 g pack", ja: "100g", grams: 100, price: 7500 },
      { sku: "A5-YAK-250", en: "250 g pack", ja: "250g", grams: 250, price: 17500 },
    ],
    bestSeller: true,
  },
  {
    slug: "a5-shabu-shabu",
    name: ["A5 Wagyu Shabu-Shabu", "A5 和牛 しゃぶしゃぶ用"],
    short: [
      "Paper-thin A5 for hot pot: swish in broth for a few seconds and it melts.",
      "鍋用の極薄切りA5。だしにくぐらせて数秒、とろけます。",
    ],
    description: [
      "Sliced 1.5 mm thin from the shoulder loin, so the fine marbling melts as soon as it touches simmering broth. Perfect for family dinners and winter gatherings.",
      "肩ロースを1.5mmに薄切りにしました。煮立っただしに触れた瞬間、細かなサシがとろけます。家族の食卓や冬の集まりにぴったりです。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 9,
    region: ["Hokkaido, Japan", "日本・北海道"],
    brand: "Hokkaido Wagyu",
    productType: "sliced",
    authenticityCertificate: true,
    cooking: [
      "Thaw in the fridge, keeping the slices separated. Bring kombu dashi to a gentle simmer and swish each slice for 3–5 seconds until just pink. Serve with ponzu or sesame sauce.",
      "重なったまま冷蔵庫で解凍します。昆布だしを軽く煮立て、1枚ずつ3〜5秒くぐらせて、ほんのりピンク色で引き上げます。ポン酢やごまだれでどうぞ。",
    ],
    serving: A5_SERVING,
    images: ["/images/p-a5-shabu.webp", "/images/occ-shabu.webp"],
    categories: ["japanese-a5", "sliced", "shabu-shabu"],
    variants: [
      { sku: "A5-SHA-100", en: "100 g pack", ja: "100g", grams: 100, price: 7200 },
      { sku: "A5-SHA-250", en: "250 g pack", ja: "250g", grams: 250, price: 16800 },
    ],
  },
  {
    slug: "wagyu-burger-patties",
    name: ["A5 Wagyu Blend Burger Patties", "A5 和牛ブレンド パティ"],
    short: [
      "Coarse-ground patties with A5 trim for the juiciest burger you'll make at home.",
      "A5の端材を粗挽きにしたパティ。ご家庭で作れる最高にジューシーなバーガーに。",
    ],
    description: [
      "We blend A5 wagyu trim with Australian wagyu chuck and press it into 150 g patties. No fillers or seasoning, just beef. Cook from frozen or thawed.",
      "A5和牛の端材とオーストラリア産和牛の肩肉をブレンドし、150gのパティに成形しました。つなぎや調味料は一切使っていません。冷凍のままでも、解凍してからでも焼けます。",
    ],
    origin: "japan",
    grade: "A5",
    bms: null,
    region: ["Japan & Australia", "日本・オーストラリア"],
    brand: "Wagyu Meat",
    productType: "burger",
    authenticityCertificate: false,
    cooking: [
      "Cook on a hot griddle 3–4 minutes a side. Season with salt only after flipping. Rest 2 minutes before building the burger.",
      "熱した鉄板で片面3〜4分ずつ焼きます。塩は裏返してからふってください。2分休ませてからバンズに挟みます。",
    ],
    serving: ["One 150 g patty per burger.", "バーガー1個につきパティ1枚（150g）。"],
    images: ["/images/p-a5-burger.webp"],
    categories: ["japanese-a5", "burgers", "yakiniku-bbq"],
    variants: [
      { sku: "WG-BUR-2", en: "2 × 150 g patties", ja: "150g × 2枚", grams: 300, price: 6500 },
      { sku: "WG-BUR-4", en: "4 × 150 g patties", ja: "150g × 4枚", grams: 600, price: 12500 },
    ],
    bestSeller: true,
  },
  {
    slug: "australian-wagyu-ribeye-mb8-9",
    name: ["Australian Wagyu Ribeye MB8–9", "オーストラリア産和牛 リブアイ MB8–9"],
    short: [
      "Rich, beefy and generously marbled: everyday luxury at a friendlier price.",
      "濃厚な旨みとたっぷりのサシ。手の届く日常の贅沢。",
    ],
    description: [
      "Grain-finished for 400+ days in Queensland's Darling Downs, this ribeye balances wagyu's buttery marbling with a deeper, beefier flavour than Japanese A5. Thick-cut for a proper steakhouse crust.",
      "クイーンズランド州ダーリングダウンズで400日以上穀物肥育。和牛らしいバターのようなサシと、日本のA5より力強い赤身の旨みを併せ持ちます。厚切りで、香ばしい焼き目がつけやすいリブアイです。",
    ],
    origin: "australia",
    grade: "MB8-9",
    bms: 9,
    region: ["Darling Downs, Australia", "オーストラリア・ダーリングダウンズ"],
    brand: "",
    productType: "steak",
    authenticityCertificate: false,
    cooking: AU_COOKING,
    serving: AU_SERVING,
    images: ["/images/p-au-ribeye.webp", "/images/origin-australia.webp"],
    categories: ["australian-wagyu", "ribeye", "steak-night"],
    variants: [
      { sku: "AU-RIB-300", en: "300 g steak", ja: "300g", grams: 300, price: 9800 },
      { sku: "AU-RIB-400", en: "400 g steak", ja: "400g", grams: 400, price: 12900 },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    slug: "australian-wagyu-striploin-mb6-7",
    name: ["Australian Wagyu Striploin MB6–7", "オーストラリア産和牛 ストリップロイン MB6–7"],
    short: ["A versatile, well-marbled strip steak for weeknight grilling.", "平日のグリルにも使いやすい、程よいサシのストリップロイン。"],
    description: [
      "Marble score 6–7 gives you plenty of wagyu juiciness with a firmer bite. A great introduction to wagyu, and a crowd-pleaser on the BBQ.",
      "マーブルスコア6〜7で、和牛らしいジューシーさとしっかりした歯ごたえを両立。和牛入門にも、BBQにもおすすめです。",
    ],
    origin: "australia",
    grade: "MB6-7",
    bms: 7,
    region: ["New South Wales, Australia", "オーストラリア・ニューサウスウェールズ"],
    brand: "",
    productType: "steak",
    authenticityCertificate: false,
    cooking: AU_COOKING,
    serving: AU_SERVING,
    images: ["/images/p-au-striploin.webp"],
    categories: ["australian-wagyu", "striploin", "steak-night", "yakiniku-bbq"],
    variants: [
      { sku: "AU-STR-250", en: "250 g steak", ja: "250g", grams: 250, price: 6200 },
      { sku: "AU-STR-500", en: "2 × 250 g steaks", ja: "250g × 2枚", grams: 500, price: 11900 },
    ],
  },
  {
    slug: "australian-wagyu-tenderloin-roast",
    name: ["Australian Wagyu Tenderloin Roast", "オーストラリア産和牛 ヒレ ロースト"],
    short: ["A centre-cut tenderloin, trimmed and tied, for dinner parties.", "おもてなしに。中心部のヒレを整形し、糸で縛ったロースト用。"],
    description: [
      "Trimmed of silverskin and tied for even cooking, this roast slices into perfect medallions. Ideal for Eid dinners and family celebrations.",
      "筋を丁寧に取り除き、均一に火が入るよう糸で縛りました。美しいメダリオンに切り分けられます。イードの食卓やお祝いの席に。",
    ],
    origin: "australia",
    grade: "MB6-7",
    bms: 6,
    region: ["New South Wales, Australia", "オーストラリア・ニューサウスウェールズ"],
    brand: "",
    productType: "steak",
    authenticityCertificate: false,
    cooking: [
      "Thaw for 36 hours in the fridge. Sear all over in a hot pan, then roast at 200 °C for 18–22 minutes per kilo until 52 °C inside for medium-rare. Rest 10 minutes before slicing.",
      "冷蔵庫で36時間かけて解凍します。熱したフライパンで全面に焼き色をつけ、200℃のオーブンで1kgあたり18〜22分、中心温度52℃（ミディアムレア）まで焼きます。10分休ませてから切り分けてください。",
    ],
    serving: AU_SERVING,
    images: ["/images/p-au-tenderloin.webp"],
    categories: ["australian-wagyu", "tenderloin", "gifting"],
    variants: [
      { sku: "AU-TEN-500", en: "500 g roast", ja: "500g", grams: 500, price: 12500 },
      { sku: "AU-TEN-1000", en: "1 kg roast", ja: "1kg", grams: 1000, price: 24000 },
    ],
  },
  {
    slug: "australian-wagyu-picanha",
    name: ["Australian Wagyu Picanha", "オーストラリア産和牛 ピッカーニャ（イチボ）"],
    short: ["The Brazilian BBQ favourite, with a thick, flavourful fat cap.", "ブラジルBBQの定番。厚い脂が旨みを引き出します。"],
    description: [
      "Picanha (rump cap) is prized for its fat cap, which bastes the meat as it cooks. Slice into thick steaks for the grill, or skewer churrasco-style.",
      "ピッカーニャ（イチボ）は、焼くと肉を包み込む上質な脂が魅力です。厚切りステーキにしても、シュラスコ風に串焼きにしても楽しめます。",
    ],
    origin: "australia",
    grade: "MB6-7",
    bms: 6,
    region: ["Queensland, Australia", "オーストラリア・クイーンズランド"],
    brand: "",
    productType: "steak",
    authenticityCertificate: false,
    cooking: AU_COOKING,
    serving: AU_SERVING,
    images: ["/images/p-au-picanha.webp"],
    categories: ["australian-wagyu", "picanha", "yakiniku-bbq"],
    variants: [
      { sku: "AU-PIC-1000", en: "Whole, approx. 1 kg", ja: "1本 約1kg", grams: 1000, price: 13500 },
      { sku: "AU-PIC-1400", en: "Whole, approx. 1.4 kg", ja: "1本 約1.4kg", grams: 1400, price: 18500 },
    ],
  },
  {
    slug: "a5-prefecture-tasting-flight",
    name: ["A5 Prefecture Tasting Flight", "A5 産地食べ比べセット"],
    short: [
      "Three A5 striploins from three prefectures, side by side. Taste the terroir.",
      "3つの産地のA5サーロインを食べ比べ。土地ごとの個性を味わう。",
    ],
    description: [
      "Kagoshima, Miyazaki and Hokkaido each raise wagyu differently, and you can taste it. This flight pairs three 150 g A5 striploins in a black-and-gold presentation box with a tasting card and certificates for each.",
      "鹿児島・宮崎・北海道では和牛の育て方が異なり、その違いは味に表れます。150gのA5サーロイン3枚を黒と金の化粧箱に詰め、テイスティングカードと各証明書を添えました。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 10,
    region: ["Kagoshima · Miyazaki · Hokkaido", "鹿児島・宮崎・北海道"],
    brand: "Wagyu Meat",
    productType: "bundle",
    authenticityCertificate: true,
    contents: [
      "- 150 g A5 Kagoshima striploin\n- 150 g A5 Miyazaki striploin\n- 150 g A5 Hokkaido striploin\n- Tasting card and three certificates of authenticity",
      "- 鹿児島黒牛 A5 サーロイン 150g\n- 宮崎牛 A5 サーロイン 150g\n- 北海道和牛 A5 サーロイン 150g\n- テイスティングカード・和牛証明書3枚",
    ],
    cooking: A5_COOKING,
    serving: ["Serves 4–6 as a tasting.", "食べ比べで4〜6人分。"],
    images: ["/images/p-flight-box.webp"],
    categories: ["japanese-a5", "striploin", "gifting", "steak-night"],
    variants: [{ sku: "A5-FLIGHT-3", en: "3 × 150 g", ja: "150g × 3枚", grams: 450, price: 52000, compareAt: 58000 }],
    featured: true,
  },
  {
    slug: "wagyu-gift-box",
    name: ["The Wagyu Gift Box", "和牛ギフトボックス"],
    short: [
      "One A5 and one Australian ribeye in a red-and-gold gift box. Made for Eid and weddings.",
      "A5とオーストラリア産のリブロースを赤と金の箱に。イードや結婚のお祝いに。",
    ],
    description: [
      "A gift that says everything. We pack an A5 Kagoshima ribeye and an Australian MB8-9 ribeye on washi paper in our signature red box with gold ribbon, add your handwritten message, and deliver it frozen in an insulated outer box. Prices can be hidden on the invoice.",
      "想いを伝える贈り物に。鹿児島黒牛A5リブロースとオーストラリア産MB8–9リブアイを和紙に包み、金のリボンをかけた赤い化粧箱へ。手書きのメッセージを添え、保冷箱で冷凍のままお届けします。納品書の金額表示は省略できます。",
    ],
    origin: "japan",
    grade: "A5",
    bms: 11,
    region: ["Japan & Australia", "日本・オーストラリア"],
    brand: "Wagyu Meat",
    productType: "bundle",
    authenticityCertificate: true,
    contents: [
      "- 200 g A5 Kagoshima ribeye\n- 300 g Australian wagyu ribeye MB8–9\n- Handwritten gift card\n- Certificate of authenticity",
      "- 鹿児島黒牛 A5 リブロース 200g\n- オーストラリア産和牛 リブアイ MB8–9 300g\n- 手書きのギフトカード\n- 和牛証明書",
    ],
    cooking: A5_COOKING,
    serving: ["Serves 3–4.", "3〜4人分。"],
    images: ["/images/p-gift-box.webp", "/images/occ-gift.webp"],
    categories: ["gifting", "japanese-a5", "australian-wagyu", "ribeye"],
    variants: [{ sku: "GIFT-BOX-STD", en: "Gift box", ja: "ギフトボックス", grams: 500, price: 33500 }],
    featured: true,
  },
  {
    slug: "wagyu-gift-card",
    name: ["Wagyu Meat Gift Card", "Wagyu Meat ギフトカード"],
    short: ["Let them choose. Delivered by WhatsApp or email.", "お好きな商品を選べるギフトカード。WhatsAppまたはメールでお届けします。"],
    description: [
      "A digital gift card redeemable on any product. We send it to the recipient on the date you choose, with your message.",
      "全商品にご利用いただけるデジタルギフトカードです。ご指定の日に、メッセージを添えて受取人へお送りします。",
    ],
    origin: "japan",
    grade: "NA",
    bms: null,
    region: ["", ""],
    brand: "Wagyu Meat",
    productType: "gift-card",
    authenticityCertificate: false,
    cooking: ["", ""],
    serving: ["", ""],
    images: ["/images/occ-gift.webp"],
    categories: ["gifting"],
    variants: [
      { sku: "GC-10000", en: "Rs 10,000", ja: "10,000ルピー", grams: 0, price: 10000 },
      { sku: "GC-25000", en: "Rs 25,000", ja: "25,000ルピー", grams: 0, price: 25000 },
      { sku: "GC-50000", en: "Rs 50,000", ja: "50,000ルピー", grams: 0, price: 50000 },
    ],
  },
];

export type SeedCategory = {
  slug: string;
  type: "origin" | "cut" | "occasion";
  name: [string, string];
  description: [string, string];
  image?: string;
};

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "japanese-a5",
    type: "origin",
    name: ["Japanese A5 Wagyu", "日本産 A5 和牛"],
    description: [
      "The highest grade in Japan's beef system, from Kuroge cattle raised in Kagoshima, Miyazaki and Hokkaido.",
      "鹿児島・宮崎・北海道で育った黒毛和牛。日本の格付けで最高等級のA5のみ。",
    ],
    image: "/images/origin-japan.webp",
  },
  {
    slug: "australian-wagyu",
    type: "origin",
    name: ["Australian Wagyu", "オーストラリア産和牛"],
    description: [
      "Long grain-fed wagyu from Australia's best ranches: rich, beefy and more affordable.",
      "オーストラリア屈指の牧場で長期穀物肥育した和牛。濃厚な旨みを手頃な価格で。",
    ],
    image: "/images/origin-australia.webp",
  },
  { slug: "ribeye", type: "cut", name: ["Ribeye", "リブロース"], description: ["", ""] },
  { slug: "striploin", type: "cut", name: ["Striploin", "サーロイン"], description: ["", ""] },
  { slug: "tenderloin", type: "cut", name: ["Tenderloin", "ヒレ"], description: ["", ""] },
  { slug: "sliced", type: "cut", name: ["Sliced (yakiniku & shabu)", "スライス（焼肉・しゃぶしゃぶ）"], description: ["", ""] },
  { slug: "picanha", type: "cut", name: ["Picanha", "イチボ"], description: ["", ""] },
  { slug: "burgers", type: "cut", name: ["Burgers", "バーガー"], description: ["", ""] },
  {
    slug: "steak-night",
    type: "occasion",
    name: ["Steak night", "ステーキナイト"],
    description: ["Thick-cut steaks for a special dinner at home.", "おうちで特別なディナーを。厚切りステーキ。"],
    image: "/images/occ-steak.webp",
  },
  {
    slug: "yakiniku-bbq",
    type: "occasion",
    name: ["Yakiniku & BBQ", "焼肉・BBQ"],
    description: ["Slices and cuts made for the grill.", "網焼きにぴったりのスライスと部位。"],
    image: "/images/occ-yakiniku.webp",
  },
  {
    slug: "shabu-shabu",
    type: "occasion",
    name: ["Shabu-shabu & hot pot", "しゃぶしゃぶ・鍋"],
    description: ["Paper-thin wagyu for family hot pot.", "家族で囲む鍋に、極薄切りの和牛を。"],
    image: "/images/occ-shabu.webp",
  },
  {
    slug: "gifting",
    type: "occasion",
    name: ["Gifting", "ギフト"],
    description: ["Gift boxes and cards for Eid, weddings and corporate gifts.", "イード、結婚祝い、法人ギフトに。"],
    image: "/images/occ-gift.webp",
  },
];
