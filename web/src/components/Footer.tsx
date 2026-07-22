import { SHOP } from "@/lib/shop";

// NAP block — identical wording everywhere for Local SEO.
export default function Footer() {
  return (
    <footer className="foot">
      <div className="fname">🌾 {SHOP.name} {SHOP.branch}</div>
      <div className="frow">{SHOP.address}</div>
      <div className="frow">
        📞 <b>{SHOP.telDisplay}</b> · {SHOP.mobileDisplay}
      </div>
      <div className="frow">
        LINE {SHOP.lineId} ·{" "}
        <a href={SHOP.maps} target="_blank" rel="noopener noreferrer">
          แผนที่ร้าน
        </a>
      </div>
      <div className="frow">{SHOP.hours}</div>
    </footer>
  );
}
