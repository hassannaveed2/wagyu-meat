import type { CitySlot } from "../schema";
import type { SiteSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const SLOTS: CitySlot[] = [
  { en: "12–4 pm", ja: "12時〜16時" },
  { en: "4–8 pm", ja: "16時〜20時" },
];

export const SEED_CITIES = [
  {
    slug: "karachi",
    nameEn: "Karachi",
    nameJa: "カラチ",
    deliveryFeePKR: 1500,
    freeDeliveryThresholdPKR: 25000,
    deliveryDays: [2, 4, 6],
    slots: SLOTS,
    leadTimeHours: 24,
    sortOrder: 1,
  },
  {
    slug: "lahore",
    nameEn: "Lahore",
    nameJa: "ラホール",
    deliveryFeePKR: 1500,
    freeDeliveryThresholdPKR: 25000,
    deliveryDays: [1, 3, 5],
    slots: SLOTS,
    leadTimeHours: 24,
    sortOrder: 2,
  },
  {
    slug: "islamabad",
    nameEn: "Islamabad / Rawalpindi",
    nameJa: "イスラマバード／ラワルピンディ",
    deliveryFeePKR: 2000,
    freeDeliveryThresholdPKR: 30000,
    deliveryDays: [3, 6],
    slots: SLOTS,
    leadTimeHours: 36,
    sortOrder: 3,
  },
];

export const SEED_GUIDES = [
  {
    slug: "how-to-cook-a5-wagyu",
    type: "guide" as const,
    titleEn: "How to cook A5 wagyu (and not waste a gram)",
    titleJa: "A5和牛の焼き方：一切れも無駄にしないために",
    excerptEn: "A5 is nothing like a regular steak. Here's how to sear it in 3 minutes, the right portion size, and the mistakes to avoid.",
    excerptJa: "A5は普通のステーキとはまったく別物。3分で焼き上げる方法、適量、避けたい失敗をご紹介します。",
    heroImage: "/images/guide-sear.webp",
    readingMinutes: 5,
    sortOrder: 1,
    bodyEn: `## Before you start
A5 wagyu has so much intramuscular fat that it behaves more like a delicacy than a steak. Think foie gras, not T-bone. **Plan 80–120 g per person**, and serve it in thin slices.

## Thaw slowly
Move the sealed pack from the freezer to the fridge **24 hours** before cooking. Never thaw in water or the microwave: the fat melts unevenly and you lose juices.

## The 3-minute sear
1. Take the steak out 20 minutes before cooking and pat it completely dry.
2. Heat a cast-iron or heavy steel pan until it just starts to smoke. **No oil**: trim a small piece of fat from the edge and rub it over the pan.
3. Salt the steak generously right before it goes in.
4. Sear **60–90 seconds per side** for a 2 cm steak, then 10 seconds on each edge.
5. Rest for 3 minutes, slice thinly against the grain, and finish with flaky salt.

## What to serve with it
Steamed rice, fresh wasabi, a few drops of soy sauce, and something sharp, such as pickles or a citrusy salad, to cut the richness.

## Mistakes to avoid
- Cooking past medium: the fat renders out and the texture turns stringy.
- Heavy marinades or sauces that hide the flavour.
- Serving a whole 300 g steak to one person. Share it!`,
    bodyJa: `## はじめに
A5和牛は筋肉の中に脂が豊富に入っているため、ステーキというより「ごちそう」として扱うのがコツです。**1人あたり80〜120g**を目安に、薄く切り分けて楽しみましょう。

## ゆっくり解凍する
焼く**24時間前**に、真空パックのまま冷凍庫から冷蔵庫へ移します。流水や電子レンジでの解凍は、脂が不均一に溶けて肉汁が流れ出るため避けてください。

## 3分で焼き上げる
1. 焼く20分前に冷蔵庫から出し、表面の水気をしっかり拭き取ります。
2. 鉄やスチールの厚手のフライパンを、うっすら煙が出るまで熱します。**油は不要**。縁の脂を少し切り取ってフライパンに塗ります。
3. 焼く直前に塩をしっかりふります。
4. 厚さ2cmなら**片面60〜90秒**、側面も10秒ずつ焼きます。
5. 3分休ませ、繊維を断つように薄く切り、仕上げに塩をひとつまみ。

## 合わせるもの
ご飯、本わさび、醤油を数滴。漬物や柑橘のサラダなど、さっぱりしたものを添えると脂の甘みが引き立ちます。

## 避けたい失敗
- ミディアム以上に焼くこと（脂が抜けて食感が損なわれます）
- 風味を隠してしまう濃いマリネやソース
- 300gを1人で食べること。ぜひシェアしてください！`,
  },
  {
    slug: "thawing-and-storage",
    type: "guide" as const,
    titleEn: "Thawing and storing your wagyu",
    titleJa: "和牛の解凍と保存方法",
    excerptEn: "Your order arrives frozen in an insulated box. Here's how to store it, how long it keeps, and how to thaw it perfectly.",
    excerptJa: "ご注文は保冷箱に入った冷凍状態でお届けします。保存方法、保存期間、上手な解凍方法をご案内します。",
    heroImage: "/images/prov-coldchain.webp",
    readingMinutes: 3,
    sortOrder: 2,
    bodyEn: `## When your box arrives
Open the insulated box and move every pack to the freezer **straight away**. A little surface softening in transit is normal; the core stays frozen.

## How long it keeps
- **Freezer (−18 °C):** up to 12 months in the original vacuum pack.
- **Fridge (0–4 °C), after thawing:** cook within 3 days.
- Never refreeze beef that has fully thawed.

## Thawing times in the fridge
| Item | Time |
|---|---|
| Slices (yakiniku, shabu-shabu) | 8–12 hours |
| Steaks up to 3 cm | 24 hours |
| Roasts (1 kg) | 36 hours |

## Quick thaw (if you must)
Keep the steak in its sealed pack and submerge it in a bowl of cold tap water, changing the water every 30 minutes. A 2 cm steak takes about an hour.`,
    bodyJa: `## お届け後すぐに
保冷箱を開けたら、**すぐに**すべてのパックを冷凍庫へ移してください。輸送中に表面が少しやわらかくなるのは問題ありません。中心は凍ったままです。

## 保存期間
- **冷凍庫（−18℃）：** 真空パックのままで最長12か月
- **冷蔵庫（0〜4℃）解凍後：** 3日以内に調理してください
- 完全に解凍した肉の再冷凍はお避けください

## 冷蔵庫での解凍時間
| 商品 | 時間 |
|---|---|
| スライス（焼肉・しゃぶしゃぶ） | 8〜12時間 |
| 厚さ3cmまでのステーキ | 24時間 |
| ロースト（1kg） | 36時間 |

## お急ぎの場合
真空パックのままボウルの冷水に沈め、30分ごとに水を替えます。厚さ2cmのステーキで約1時間です。`,
  },
  {
    slug: "yakiniku-at-home",
    type: "recipe" as const,
    titleEn: "Yakiniku night at home",
    titleJa: "おうちで焼肉ナイト",
    excerptEn: "A tabletop grill, A5 slices and a simple homemade tare: the most fun way to share wagyu with family.",
    excerptJa: "卓上グリルとA5スライス、手作りのタレで。家族で和牛を楽しむいちばん楽しい方法。",
    heroImage: "/images/occ-yakiniku.webp",
    readingMinutes: 4,
    sortOrder: 3,
    bodyEn: `## You'll need (serves 4)
- 250 g A5 yakiniku slices
- 500 g Australian wagyu striploin, sliced 5 mm thick
- A tabletop grill or a heavy griddle pan
- Steamed rice, lettuce leaves, kimchi or pickles

## Homemade tare
Simmer 4 tbsp soy sauce, 2 tbsp mirin-style sweet sauce (or 1 tbsp sugar + 1 tbsp water), 1 tbsp honey, 1 grated garlic clove, 1 tsp grated ginger and 1 tsp toasted sesame seeds for 2 minutes. Cool before serving.

## Grilling
Heat the grill until very hot. Let everyone cook their own slices: **5–10 seconds a side for A5**, 20–30 seconds for Australian wagyu. Dip in tare or a little salt, and wrap in lettuce with rice.

> Tip: start with the Australian cuts and finish with A5, from leanest to richest, so the flavours build.`,
    bodyJa: `## 材料（4人分）
- A5焼肉用カルビ 250g
- オーストラリア産和牛ストリップロイン 500g（5mm厚にスライス）
- 卓上グリルまたは厚手のグリルパン
- ご飯、サンチュ、キムチや漬物

## 手作りのタレ
醤油大さじ4、みりん風調味料大さじ2（または砂糖大さじ1＋水大さじ1）、はちみつ大さじ1、すりおろしにんにく1片、すりおろし生姜小さじ1、いりごま小さじ1を2分ほど煮立て、冷ましておきます。

## 焼き方
グリルを十分に熱し、それぞれが自分で焼くのが焼肉の楽しみ。**A5は片面5〜10秒**、オーストラリア産は20〜30秒が目安です。タレや塩につけ、サンチュでご飯と一緒に包んでどうぞ。

> ポイント：赤身の多いオーストラリア産から始めて、最後にA5へ。脂の少ない順に焼くと、旨みの違いがよくわかります。`,
  },
  {
    slug: "shabu-shabu-for-family",
    type: "recipe" as const,
    titleEn: "Wagyu shabu-shabu for the whole family",
    titleJa: "家族で囲む和牛しゃぶしゃぶ",
    excerptEn: "A light, warming hot pot that lets A5's marbling shine, ready in 20 minutes.",
    excerptJa: "A5のサシが主役の、やさしく温まる鍋。20分で完成します。",
    heroImage: "/images/occ-shabu.webp",
    readingMinutes: 4,
    sortOrder: 4,
    bodyEn: `## You'll need (serves 4)
- 250 g A5 shabu-shabu slices
- 1 piece of kombu (10 cm) and 1.5 L water
- Napa cabbage, enoki mushrooms, tofu, spring onion, carrot ribbons
- Ponzu and sesame sauce for dipping

## Method
1. Soak the kombu in the water for 30 minutes, then heat to just below boiling and remove the kombu.
2. Add the vegetables and tofu and simmer gently.
3. Swish each wagyu slice through the broth for **3–5 seconds**, until just pink, then dip and eat.
4. Finish by cooking noodles or rice in the rich broth.`,
    bodyJa: `## 材料（4人分）
- A5しゃぶしゃぶ用 250g
- 昆布（10cm）1枚、水1.5L
- 白菜、えのき、豆腐、長ねぎ、にんじん（ピーラーで薄く）
- ポン酢、ごまだれ

## 作り方
1. 昆布を水に30分浸し、沸騰直前まで温めて昆布を取り出します。
2. 野菜と豆腐を入れ、弱火で煮ます。
3. 和牛を1枚ずつ**3〜5秒**だしにくぐらせ、ほんのりピンク色になったらタレにつけてどうぞ。
4. 旨みの出ただしで、最後にうどんや雑炊を楽しみましょう。`,
  },
];

export const SEED_SETTINGS: SiteSettings = {
  ...DEFAULT_SETTINGS,
  bankDetails: {
    en: "Bank transfer details are sent on WhatsApp after you place your order.",
    ja: "銀行振込の口座情報は、ご注文後にWhatsAppでお送りします。",
  },
  featuredProductSlugs: [
    "a5-kagoshima-ribeye",
    "a5-miyazaki-striploin",
    "australian-wagyu-ribeye-mb8-9",
    "a5-yakiniku-slices",
  ],
  faq: [
    {
      question: { en: "Is your wagyu halal?", ja: "ハラール認証は受けていますか？" },
      answer: {
        en: "Yes. Every beef product we sell is slaughtered and processed at halal-certified facilities, and we keep the certificate for every shipment. Ask us on WhatsApp and we'll share it.",
        ja: "はい。当店で販売する牛肉はすべて、ハラール認証を受けた施設でと畜・加工されています。出荷ごとの証明書を保管しており、WhatsAppでお問い合わせいただければご提示します。",
      },
    },
    {
      question: { en: "What does A5 mean?", ja: "「A5」とは何ですか？" },
      answer: {
        en: "Japanese beef is graded on yield (A–C) and quality (1–5). A5 is the top grade: the highest yield and the best marbling, colour, texture and fat quality. See Wagyu 101 for the full explanation.",
        ja: "日本の牛肉は歩留等級（A〜C）と肉質等級（1〜5）で格付けされます。A5は歩留が高く、サシ・色・きめ・脂の質すべてが最高評価の最上級です。詳しくは「和牛のきほん」をご覧ください。",
      },
    },
    {
      question: { en: "How do I know it's genuine Japanese wagyu?", ja: "本物の日本産和牛かどうか、どうやってわかりますか？" },
      answer: {
        en: "Every Japanese A5 order includes a certificate of authenticity with the animal's 10-digit ID number. You can look the number up on Japan's National Livestock Breeding Center database to see the farm, breed and birth date.",
        ja: "日本産A5のご注文には、10桁の個体識別番号が記載された和牛証明書を同梱しています。家畜改良センターの個体識別情報検索で、生産農場・品種・生年月日をご確認いただけます。",
      },
    },
    {
      question: { en: "Which cities do you deliver to?", ja: "配送エリアはどこですか？" },
      answer: {
        en: "Karachi, Lahore and Islamabad/Rawalpindi, on scheduled delivery days with a choice of time slot. See the Delivery page for fees and days.",
        ja: "カラチ、ラホール、イスラマバード／ラワルピンディです。決まった配送日に、時間帯をお選びいただけます。料金と配送日は「配送について」をご覧ください。",
      },
    },
    {
      question: { en: "How is it delivered?", ja: "どのように届きますか？" },
      answer: {
        en: "Frozen, in a sealed insulated box with ice packs or dry ice, by our own cold-chain team. Please put it in the freezer as soon as it arrives.",
        ja: "自社の冷凍配送チームが、保冷剤またはドライアイス入りの密閉保冷箱で冷凍のままお届けします。届いたらすぐに冷凍庫へ入れてください。",
      },
    },
    {
      question: { en: "How can I pay?", ja: "支払い方法は？" },
      answer: {
        en: "Cash on delivery, bank transfer, JazzCash, Easypaisa or card. For digital payments we send a secure payment link on WhatsApp after you order.",
        ja: "代金引換、銀行振込、JazzCash、Easypaisa、カードがご利用いただけます。デジタル決済の場合は、ご注文後にWhatsAppで安全な決済リンクをお送りします。",
      },
    },
    {
      question: { en: "How much should I order per person?", ja: "1人あたりどれくらい注文すればいいですか？" },
      answer: {
        en: "A5 is very rich, so 80–120 g per person is plenty. For Australian wagyu, plan 200–250 g per person.",
        ja: "A5は脂が豊かなので、1人あたり80〜120gで十分です。オーストラリア産和牛は1人200〜250gが目安です。",
      },
    },
    {
      question: { en: "What if something is wrong with my order?", ja: "注文に不備があった場合は？" },
      answer: {
        en: "Because wagyu is perishable we can't accept returns, but if anything arrives thawed, damaged or incorrect, send us a photo on WhatsApp within 24 hours and we'll replace it or refund you.",
        ja: "生鮮品のため返品はお受けできませんが、解凍・破損・誤配送があった場合は、24時間以内にWhatsAppで写真をお送りください。交換または返金いたします。",
      },
    },
  ],
};

/** Sample reviews for design previews only. Seeded when SEED_SAMPLE_REVIEWS=true. Delete before launch. */
export const SAMPLE_REVIEWS: { product: string | null; name: string; city: string; rating: number; body: string }[] = [
  { product: "a5-kagoshima-ribeye", name: "Sample — Ayesha K.", city: "Lahore", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: "a5-kagoshima-ribeye", name: "Sample — Omar F.", city: "Karachi", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: "a5-miyazaki-striploin", name: "Sample — Hina R.", city: "Islamabad", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: "australian-wagyu-ribeye-mb8-9", name: "Sample — Bilal A.", city: "Lahore", rating: 4, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: "a5-yakiniku-slices", name: "Sample — Sana M.", city: "Karachi", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: "wagyu-gift-box", name: "Sample — Zain H.", city: "Islamabad", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: null, name: "Sample — Mariam S.", city: "Lahore", rating: 5, body: "Sample review for design preview. Replace with real customer reviews before launch." },
  { product: null, name: "Sample — Usman T.", city: "Karachi", rating: 4, body: "Sample review for design preview. Replace with real customer reviews before launch." },
];
