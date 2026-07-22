import Link from "next/link";
import { SHOP } from "@/lib/shop";

// On every page (design.md: no single front door — each page is a landing page).
export default function Header() {
  return (
    <header className="hdr">
      <Link href="/" aria-label={`${SHOP.name} หน้าแรก`} className="badge">
        <span className="n">ชัยพฤกษ์</span> <span className="a">อโกรเทค</span>
      </Link>
      <div className="actions">
        <a className="hbtn" href={`tel:${SHOP.tel}`} aria-label="โทรหาร้าน">
          📞 โทร
        </a>
        <a className="hbtn" href={SHOP.lineAddUrl} aria-label="แชทไลน์">
          💬 ไลน์
        </a>
      </div>
    </header>
  );
}
