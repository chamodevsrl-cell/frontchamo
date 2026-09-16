export type FavoriteItem = {
  productId: string;
  addedAt: string;
};

export const FAVORITES_STORAGE_KEY = "chamo-favorites-v1";

function isFavoriteItem(value: unknown): value is FavoriteItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.productId === "string" && item.productId.length > 0 && typeof item.addedAt === "string";
}

/** Acepta el formato viejo (`string[]`) y el nuevo (`{productId, addedAt}[]`). */
export function parseFavoriteItems(raw: string | null | undefined): FavoriteItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const items: FavoriteItem[] = [];
    for (const entry of parsed) {
      if (typeof entry === "string" && entry.length > 0) {
        if (seen.has(entry)) continue;
        seen.add(entry);
        items.push({ productId: entry, addedAt: "2026-01-01T00:00:00.000Z" });
        continue;
      }
      if (isFavoriteItem(entry) && !seen.has(entry.productId)) {
        seen.add(entry.productId);
        items.push(entry);
      }
    }
    return items;
  } catch {
    return [];
  }
}
