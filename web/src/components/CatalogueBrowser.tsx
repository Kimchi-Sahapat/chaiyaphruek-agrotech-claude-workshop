"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { filterProducts } from "@/lib/products";
import { useCart } from "./CartContext";

const GROUP_COLOR: Record<string, string> = {
  ปุ๋ย: "#8a5a2b",
  ยาฆ่าแมลง: "#c0392b",
  ยาฆ่าหญ้า: "#2f9a34",
  ยากันรา: "#2b57c4",
  "อาหารเสริม-ฮอร์โมน": "#1e7b34",
  อุปกรณ์: "#555",
  อื่นๆ: "#777",
};

export default function CatalogueBrowser({
  products,
  groups,
  campaign,
}: {
  products: Product[];
  groups: string[];
  campaign?: string;
}) {
  // In campaign mode, default to showing all matching items (not just best-sellers).
  const [filter, setFilter] = useState(campaign ? "ทั้งหมด" : "ขายดี");
  const [query, setQuery] = useState("");
  const { cart, add, inc, dec } = useCart();

  const list = useMemo(
    () => filterProducts(filter, query, products),
    [filter, query, products]
  );

  const chips = ["ขายดี", "ทั้งหมด", ...groups];

  return (
    <div className="scr">
      {campaign && (
        <div className="camp-banner">
          <span>
            🎉 สินค้าในกิจกรรม <b>{campaign}</b>
          </span>
          <a href="/catalogue" className="camp-clear">
            ดูทั้งหมด
          </a>
        </div>
      )}
      {campaign && products.length === 0 && (
        <div className="empty">
          ยังไม่มีสินค้าตัวอย่างในกิจกรรมนี้ — เร็วๆ นี้ 🌿
        </div>
      )}
      <input
        className="search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔎 ค้นหาสินค้า เช่น ปุ๋ย, ออทิวา, เขาเพชร"
        aria-label="ค้นหาสินค้า"
      />

      <div className="pricenote">
        💬
        <span>
          หน้านี้<b>ไม่แสดงราคา</b> — เลือกของที่ต้องการ แล้วส่งรายการให้ร้านเช็กราคาและของพร้อมส่งทางไลน์ได้เลยครับ
        </span>
      </div>

      <div className="chips" role="tablist" aria-label="หมวดสินค้า">
        {chips.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            className={
              "chip" +
              (c === "ขายดี" ? " hot" : "") +
              (filter === c ? " on" : "")
            }
            onClick={() => setFilter(c)}
          >
            {c === "ขายดี" ? "⭐ ขายดี" : c}
          </button>
        ))}
      </div>

      <p className="count">พบ {list.length} รายการ</p>

      <div className="plist">
        {list.map((p) => {
          const q = cart[p.code] ?? 0;
          const color = GROUP_COLOR[p.group] ?? "#777";
          return (
            <div className="p" key={p.code}>
              <div className="thumb" style={{ background: color }} aria-hidden>
                {p.group.charAt(0)}
              </div>
              <div className="info">
                <div className="nm">{p.name}</div>
                <div className="meta">
                  <span>ต่อ 1 {p.unitFull}</span>
                  {p.best && <span className="hot">⭐ ขายดี</span>}
                </div>
              </div>
              {q > 0 ? (
                <div className="stepper">
                  <button aria-label={`ลดจำนวน ${p.name}`} onClick={() => dec(p.code)}>
                    −
                  </button>
                  <div className="q" aria-live="polite">
                    {q}
                  </div>
                  <button aria-label={`เพิ่มจำนวน ${p.name}`} onClick={() => inc(p.code)}>
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="add"
                  aria-label={`เพิ่ม ${p.name} ลงรายการ`}
                  onClick={() => add(p.code)}
                >
                  เพิ่ม
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
