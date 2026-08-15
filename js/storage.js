import { findProduct } from "./catalog.js";
import { MAX_QUANTITY } from "./basket.js";

export const STORAGE_KEY = "northstar-preorder-basket";

function isUsableLine(entry) {
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    return false;
  }
  if (!findProduct(entry.id)) {
    return false;
  }
  return Number.isInteger(entry.quantity) && entry.quantity >= 1;
}

export function loadBasket(storage) {
  let raw;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }

  if (!raw) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const basket = [];
  const seen = new Set();

  for (const entry of parsed) {
    if (!isUsableLine(entry) || seen.has(entry.id)) {
      continue;
    }
    seen.add(entry.id);
    basket.push({
      id: entry.id,
      quantity: Math.min(entry.quantity, MAX_QUANTITY),
    });
  }

  return basket;
}

export function saveBasket(storage, basket) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(basket));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredBasket(storage) {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
  }
}
