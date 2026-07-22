"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

// Floating "view my list" bar; shows only when the cart has items.
export default function CartBar() {
  const { count, ready } = useCart();
  if (!ready || count === 0) return null;
  return (
    <div className="cartbar">
      <Link href="/list" className="cartbtn">
        ดูรายการของฉัน <span className="pill">{count}</span>
      </Link>
    </div>
  );
}
