"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { getByCode } from "@/lib/products";
import { SHOP, lineOrderUrl } from "@/lib/shop";

export default function ConfirmPage() {
  const { cart, ready } = useCart();
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");

  const lines = Object.keys(cart)
    .map((code) => ({ p: getByCode(code), q: cart[code] }))
    .filter((x) => x.p && x.q > 0);

  const hasItems = lines.length > 0;
  const hasPhone = phone.trim().length >= 9;
  const ok = hasItems && hasPhone;

  function buildMessage(): string {
    const body = lines
      .map((x, i) => `${i + 1}) ${x.p!.name} x ${x.q} ${x.p!.unitFull}`)
      .join("\n");
    return (
      "🛒 รายการสั่งซื้อจากเว็บ ชัยพฤกษ์ อโกรเทค\n" +
      `👤 ${nick.trim() || "-"} · 📞 ${phone.trim() || "-"}\n` +
      body +
      "\n— รบกวนยืนยันราคาและของพร้อมส่งด้วยครับ/ค่ะ"
    );
  }

  function send() {
    if (!ok) return;
    window.location.href = lineOrderUrl(buildMessage());
  }

  if (ready && !hasItems) {
    return (
      <section className="scr">
        <h1 className="t">✅ ยืนยันการสั่งซื้อ</h1>
        <div className="empty">ยังไม่มีสินค้าในรายการ</div>
        <Link className="bigbtn b-green" href="/catalogue">
          เลือกสินค้า
        </Link>
      </section>
    );
  }

  return (
    <section className="scr">
      <h1 className="t">✅ ยืนยันการสั่งซื้อ</h1>

      <div className="sumcard">
        {lines.map(({ p, q }) => (
          <div className="row" key={p!.code}>
            <span>{p!.name}</span>
            <span>
              x {q} {p!.unitFull}
            </span>
          </div>
        ))}
      </div>

      <div className="field">
        <label htmlFor="nick">ชื่อเล่น</label>
        <input
          id="nick"
          name="nick"
          type="text"
          autoComplete="name"
          placeholder="เช่น พี่สมชาย"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="phone">
          เบอร์โทร <span style={{ color: "var(--red)" }}>*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08x-xxx-xxxx"
          aria-describedby="phoneHelp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button className="bigbtn b-line" disabled={!ok} onClick={send}>
        💬 ส่งรายการทางไลน์
      </button>
      <p id="phoneHelp" className="hint" aria-live="polite">
        {ok ? "" : "กรอกเบอร์โทรก่อน ถึงจะส่งรายการได้ครับ"}
      </p>

      <a className="bigbtn b-call" href={`tel:${SHOP.tel}`}>
        📞 โทรสั่ง {SHOP.telDisplay}
      </a>

      <p className="hint">
        แตะ “ส่งรายการทางไลน์” แล้วกดส่งในแอปไลน์ ทางร้านจะแจ้งราคาและของพร้อมส่งให้ครับ
        <br />
        ถ้าต้องการยกเลิก โทรหาเราหรือทักไลน์{" "}
        <a href={SHOP.lineAddUrl}>{SHOP.lineId}</a> ได้เลย
      </p>
    </section>
  );
}
