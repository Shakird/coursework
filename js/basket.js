import { findProduct, formatPrice } from "./catalog.js";


export const MAX_QUANTITY = 24;

export function emptyBasket() {
  return [];
}

export function addToBasket(basket, id) {
  if (!findProduct(id)) {
    return basket.map((line) => ({ ...line }));
  }

  const existing = basket.find((line) => line.id === id);
  if (!existing) {
    return [...basket.map((line) => ({ ...line })), { id, quantity: 1 }];
  }

  return changeQuantity(basket, id, 1);
}

export function changeQuantity(basket, id, delta) {
  const next = [];

  for (const line of basket) {
    if (line.id !== id) {
      next.push({ ...line });
      continue;
    }

    const wanted = line.quantity + delta;
    if (wanted < 1) {
      continue;
    }
    next.push({ ...line, quantity: Math.min(wanted, MAX_QUANTITY) });
  }

  return next;
}

export function removeFromBasket(basket, id) {
  return basket.filter((line) => line.id !== id).map((line) => ({ ...line }));
}

export function basketCount(basket) {
  return basket.reduce((total, line) => total + line.quantity, 0);
}

export function basketLines(basket) {
  const lines = [];

  for (const line of basket) {
    const product = findProduct(line.id);
    if (!product) {
      continue;
    }

    lines.push({
      id: product.id,
      name: product.name,
      quantity: line.quantity,
      priceCents: product.priceCents,
      lineTotalCents: product.priceCents * line.quantity,
    });
  }

  return lines;
}

export function basketTotalCents(basket) {
  return basketLines(basket).reduce((total, line) => total + line.lineTotalCents, 0);
}

export function summarizeForForm(basket) {
  const lines = basketLines(basket);
  if (lines.length === 0) {
    return "";
  }

  const itemText = lines.map(
    (line) => `${line.quantity} x ${line.name} (${formatPrice(line.lineTotalCents)})`,
  );

  return [...itemText, `Estimated total: ${formatPrice(basketTotalCents(basket))}`].join("\n");
}