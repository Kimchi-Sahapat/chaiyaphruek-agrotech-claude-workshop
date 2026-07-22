"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useProducts } from "@/components/ProductsContext";

export default function ListPage() {
  const { cart, ready, inc, dec, remove, count } = useCart();
  const { byCode } = useProducts();
  const lines = Object.keys(cart)
    .map((code) => ({ p: byCode[code], q: cart[code] }))
    .filter((x) => x.p && x.q > 0);

  return (
    <section className="scr">
      <h1 className="t">🧺 รายการของฉัน</h1>

      {!ready ? null : lines.length === 0 ? (
        <>
          <div className="empty">
            ยังไม่มีสินค้าในรายการ
            <br />
            กด “ดูสินค้า” เพื่อเลือกได้เลย 🌿
          </div>
          <Link className="bigbtn b-green" href="/catalogue">
            เลือกสินค้า
          </Link>
        </>
      ) : (
        <>
          {lines.map(({ p, q }) => (
            <div className="li" key={p!.code}>
              <div className="nm">{p!.name}</div>
              <div className="stepper">
                <button aria-label={`ลดจำนวน ${p!.name}`} onClick={() => dec(p!.code)}>
                  −
                </button>
                <div className="q" aria-live="polite">
                  {q}
                </div>
                <button aria-label={`เพิ่มจำนวน ${p!.name}`} onClick={() => inc(p!.code)}>
                  +
                </button>
              </div>
              <button
                className="rm"
                aria-label={`ลบ ${p!.name} ออกจากรายการ`}
                onClick={() => remove(p!.code)}
              >
                🗑
              </button>
            </div>
          ))}
          <Link className="bigbtn b-green" href="/confirm">
            ยืนยันรายการ ({count}) →
          </Link>
        </>
      )}
    </section>
  );
}
