// Loyalty campaign data for the profile page.
// NOTE: totals here are SAMPLE values for the V1 preview. Real per-customer
// totals come from the CRM in V2.

export const CAMPAIGN_NAME = "สะสมปั๊บ รับเลย";
export const CAMPAIGN_PERIOD = "1 มิ.ย. 2569 – 31 พ.ค. 2570";

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

// Top card — combined pool (แฟมิลี + โซตัส) toward the next big reward.
export const SUMMARY = {
  total: 295000,
  nextReward: "คูปองส่วนลด 10,000 บาท",
  remaining: 35000,
  buyTag: "family",
};

// Activities inside the campaign. Mechanic: ทุกยอดซื้อครบ step บาท รับส่วนลด per บาท.
export type Activity = {
  key: string;
  name: string;
  note: string;
  total: number;
  step: number;
  per: number;
  tag: string; // catalogue filter for participating products
};

export const ACTIVITIES: Activity[] = [
  {
    key: "family",
    name: "อโกรเทค แฟมิลี ปาร์ตี้",
    note: "นับรวมสินค้าโซตัสด้วย",
    total: 200000,
    step: 100000,
    per: 6000,
    tag: "family",
  },
  {
    key: "sotus",
    name: "โซตัสคลับ",
    note: "เฉพาะสินค้าโซตัสเท่านั้น",
    total: 95000,
    step: 100000,
    per: 6000,
    tag: "sotus",
  },
];

export type FlashSale = { off: string; product: string; condition: string };

export const FLASH_SALES: FlashSale[] = [
  { off: "90%", product: "อโทนิค", condition: "ซื้อ 1 ขวด" },
  {
    off: "30%",
    product: "โรดัลโก้",
    condition: "ซื้อคู่กับสินค้าลัคกี้ อะโกรเทค ตัวไหนก็ได้",
  },
];

export const PRIVILEGES = [
  {
    icon: "🎟️",
    title: "สิทธิ์แลกซื้อพิเศษ",
    detail: "เช่น โตกุไธออน ซื้อ 10 แถม 2",
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

export function summaryPct(): number {
  const { total, remaining } = SUMMARY;
  return Math.round((total / (total + remaining)) * 100);
}

// Discount already earned + progress toward the next discount step.
export function activityProgress(a: Activity) {
  const earned = Math.floor(a.total / a.step) * a.per;
  const intoStep = a.total % a.step;
  const remaining = intoStep === 0 ? a.step : a.step - intoStep;
  const pct = Math.round((intoStep / a.step) * 100);
  return { earned, remaining, pct };
}
