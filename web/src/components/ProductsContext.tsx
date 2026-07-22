"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import type { Product } from "@/lib/products";
import { byCodeMap } from "@/lib/products";

type ProductsCtx = { list: Product[]; byCode: Record<string, Product> };

const Ctx = createContext<ProductsCtx | null>(null);

// Hydrated once from the server (starter or live sheet) so every client page
// (list, confirm) resolves the same product data as the catalogue.
export function ProductsProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ list: products, byCode: byCodeMap(products) }),
    [products]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProducts(): ProductsCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
