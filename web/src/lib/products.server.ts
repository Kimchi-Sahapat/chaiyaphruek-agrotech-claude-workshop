import "server-only";
import { cache } from "react";
import { decorate, STARTER, type Product } from "./products";
import { fetchProductsFromSheet } from "./sheet";

/**
 * Load products for the current request.
 * If PRODUCTS_SHEET_CSV_URL is set, pull LIVE from the published Google Sheet
 * (Code/Name/Unit only). Otherwise, and on any error, use the bundled starter.
 * cache() dedupes so layout + catalogue share a single fetch per request.
 */
export const loadProducts = cache(async (): Promise<Product[]> => {
  const url = process.env.PRODUCTS_SHEET_CSV_URL;
  if (url) {
    try {
      const raw = await fetchProductsFromSheet(url);
      if (raw.length) return decorate(raw);
    } catch (e) {
      console.error("[products] live sheet failed, using starter:", e);
    }
  }
  return STARTER;
});
