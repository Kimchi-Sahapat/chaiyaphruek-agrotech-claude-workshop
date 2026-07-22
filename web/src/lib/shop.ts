// Central shop constants — NAP must stay identical everywhere (Local SEO).
export const SHOP = {
  name: "ชัยพฤกษ์ อโกรเทค",
  branch: "สาขาขลุง",
  address: "15/3–15/4 ถนนเทศบาลสาย ต.ขลุง อ.ขลุง จ.จันทบุรี 22110",
  hours: "จ.–ส. 07:00–17:00 น. · อาทิตย์ปิด",
  tel: "039443372",
  telDisplay: "039-443-372",
  mobile: "0926562944",
  mobileDisplay: "092-656-2944",
  lineId: "@cyp-agro",
  lineAddUrl: "https://line.me/R/ti/p/@cyp-agro",
  maps: "https://maps.app.goo.gl/LBZgYNavwSjCTQSh9",
  facebook: "https://facebook.com/chaiyapreuk.agrotech",
} as const;

// Build the LINE deep link that opens the OA chat with the order pre-filled.
// NOTE: verify @cyp-agro is the account's real LINE ID in OA Manager before launch.
// Tested on phone only — the scheme is unsupported on LINE for PC.
export function lineOrderUrl(message: string): string {
  return (
    "https://line.me/R/oaMessage/" +
    encodeURIComponent(SHOP.lineId) +
    "/?" +
    encodeURIComponent(message)
  );
}
