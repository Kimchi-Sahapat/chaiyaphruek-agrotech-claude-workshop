// Loyalty campaigns for the profile page.
// NOTE: member totals here are SAMPLE values for the V1 preview. Real per-customer
// totals come from the CRM in V2.

export const FAMILY_MEMBERS = [
  "เอราวัณ",
  "เทคโนครอป",
  "แบล็คแพนเทอร์",
  "ยูพีแอล",
  "บางกอกอินเตอร์",
  "ไอซีพีลัดดา",
  "เอพี-ไบโอเทค",
  "ป.เคมีเทค",
  "ทีเจซี",
  "ลัคกี้ อะโกรเทค",
];

export type Tier = { amount: number; reward: string };

// กิจกรรมที่ 2 — สะสมปั๊บ รับเลย (ของรางวัลทันทีเมื่อถึงยอด)
export const FAMILY_TIERS: Tier[] = [
  { amount: 30000, reward: "พัดลม 18 นิ้ว" },
  { amount: 120000, reward: "ตู้เย็น" },
  { amount: 200000, reward: "คูปองส่วนลด 10,000 บาท" },
  { amount: 300000, reward: "ทีวี 65 นิ้ว" },
  { amount: 650000, reward: "Honda Wave" },
  { amount: 7500000, reward: "Toyota Hilux Champ" },
];

export const CAMPAIGN_PERIOD = "1 มิ.ย. 2569 – 31 พ.ค. 2570";

// SAMPLE current accumulated totals (V1 preview only)
export const SAMPLE_FAMILY_TOTAL = 165000;
export const SAMPLE_SOTUS_TOTAL = 620000;

export const SOTUS_STEP = 1000000; // ทุก 1 ล้าน = 1 สิทธิ์ลุ้น Toyota Hilux Champ

export const PRIVILEGES = [
  {
    icon: "🎟️",
    title: "สิทธิ์แลกซื้อพิเศษ",
    detail: "เช่น โตกุไธออน ซื้อ 10 แถม 2",
  },
  {
    icon: "⚡",
    title: "Flash Sale",
    detail:
      "เช่น อโทนิค 1 ขวด ลด 90% · ซื้อโรดัลโก้คู่กับสินค้าลัคกี้ อะโกรเทคตัวไหนก็ได้ ลด 30%",
  },
  {
    icon: "🎁",
    title: "แลกของแถม",
    detail: "สะสมครบตามสิทธิ์ Redeem รับของแถมที่หน้าร้านได้ทันที",
  },
];

export function baht(n: number): string {
  return n.toLocaleString("th-TH");
}

// Progress toward the next unreached tier.
export function nextTier(total: number, tiers: Tier[]) {
  const next = tiers.find((t) => t.amount > total);
  const prev = [...tiers].reverse().find((t) => t.amount <= total);
  const base = prev ? prev.amount : 0;
  const target = next ? next.amount : tiers[tiers.length - 1].amount;
  const pct = Math.min(100, Math.round(((total - base) / (target - base)) * 100));
  return { next, prev, pct };
}
