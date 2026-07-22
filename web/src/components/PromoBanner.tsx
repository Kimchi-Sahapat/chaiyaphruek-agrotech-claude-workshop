"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Seasonal promo — swap this per durian stage (see briefs/line-rich-menu.md).
// Bump `id` to re-show the banner to users who dismissed the previous one.
const PROMO = {
  id: "2026-recovery",
  text: "🌱 ช่วงฟื้นต้นหลังเก็บเกี่ยว — ดูสินค้าบำรุงราก & แก้รากเน่าโคนเน่า",
  href: "/catalogue",
};

export default function PromoBanner() {
  // Default visible so it renders in the server HTML (no flash-in for most users);
  // hide only if this exact promo was already dismissed.
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("promo_dismiss") === PROMO.id) setShow(false);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  function dismiss() {
    try {
      localStorage.setItem("promo_dismiss", PROMO.id);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="promo-banner">
      <Link href={PROMO.href} className="pb-text">
        {PROMO.text} →
      </Link>
      <button className="pb-x" aria-label="ปิดโปรโมชัน" onClick={dismiss}>
        ✕
      </button>
    </div>
  );
}
