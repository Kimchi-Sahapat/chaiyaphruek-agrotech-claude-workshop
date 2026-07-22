"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Cart = Record<string, number>; // productCode -> quantity

type CartCtx = {
  cart: Cart;
  ready: boolean;
  add: (code: string) => void;
  inc: (code: string) => void;
  dec: (code: string) => void;
  remove: (code: string) => void;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cyp_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setReady(true);
  }, []);

  // Persist on change (after initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {
      /* storage may be unavailable */
    }
  }, [cart, ready]);

  const add = (code: string) => setCart((c) => ({ ...c, [code]: 1 }));
  const inc = (code: string) =>
    setCart((c) => ({ ...c, [code]: (c[code] ?? 0) + 1 }));
  const dec = (code: string) =>
    setCart((c) => {
      const q = (c[code] ?? 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[code];
      else next[code] = q;
      return next;
    });
  const remove = (code: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[code];
      return next;
    });

  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <Ctx.Provider value={{ cart, ready, add, inc, dec, remove, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
