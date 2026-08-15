import { findProduct, formatPrice } from "./catalog.js";
import {
  addToBasket,
  basketCount,
  basketLines,
  basketTotalCents,
  changeQuantity,
  emptyBasket,
  removeFromBasket,
} from "./basket.js";
import { clearStoredBasket, loadBasket, saveBasket } from "./storage.js";

export function renderBasketCount(doc, basket) {
  const badge = doc.querySelector("[data-basket-count]");
  if (!badge) {
    return;
  }

  const count = basketCount(basket);
  badge.textContent = String(count);
  badge.hidden = count === 0;

  const link = doc.querySelector("[data-basket-link]");
  if (link) {
    link.setAttribute(
      "aria-label",
      count === 0
        ? "Pre-order basket, empty"
        : `Pre-order basket, ${count} ${count === 1 ? "item" : "items"}`,
    );
  }
}

function buildLineElement(doc, line) {
  const item = doc.createElement("li");
  item.className = "basket-line";
  item.setAttribute("data-basket-line", line.id);

  const name = doc.createElement("span");
  name.className = "basket-line-name";
  name.textContent = line.name;

  const stepper = doc.createElement("span");
  stepper.className = "basket-stepper";

  const decrease = doc.createElement("button");
  decrease.type = "button";
  decrease.className = "step-button";
  decrease.setAttribute("data-step", "-1");
  decrease.setAttribute("data-line-id", line.id);
  // Without this label a screen reader reads the whole row as "minus, 2, plus"
  // with no way to tell which product is being changed.
  decrease.setAttribute("aria-label", `One fewer ${line.name}`);
  decrease.textContent = "−"; // a real minus sign, not a hyphen

  const quantity = doc.createElement("span");
  quantity.className = "basket-quantity";
  quantity.setAttribute("data-line-quantity", "");
  quantity.textContent = String(line.quantity);

  const increase = doc.createElement("button");
  increase.type = "button";
  increase.className = "step-button";
  increase.setAttribute("data-step", "1");
  increase.setAttribute("data-line-id", line.id);
  increase.setAttribute("aria-label", `One more ${line.name}`);
  increase.textContent = "+";

  stepper.append(decrease, quantity, increase);

  const lineTotal = doc.createElement("span");
  lineTotal.className = "basket-line-total";
  lineTotal.setAttribute("data-line-total", "");
  lineTotal.textContent = formatPrice(line.lineTotalCents);

  const remove = doc.createElement("button");
  remove.type = "button";
  remove.className = "basket-remove";
  remove.setAttribute("data-remove-id", line.id);
  remove.textContent = "Remove";
  const removeContext = doc.createElement("span");
  removeContext.className = "visually-hidden";
  removeContext.textContent = ` ${line.name}`;
  remove.append(removeContext);

  item.append(name, stepper, lineTotal, remove);
  return item;
}

/* Redraw the whole basket panel from the given basket. */
function renderBasketPanel(doc, basket) {
  const panel = doc.querySelector("[data-basket]");
  if (!panel) {
    return; // a page without the panel, such as About
  }

  const lines = basketLines(basket);
  const emptyMessage = panel.querySelector("[data-basket-empty]");
  const filled = panel.querySelector("[data-basket-filled]");
  const list = panel.querySelector("[data-basket-lines]");

  emptyMessage.hidden = lines.length > 0;
  filled.hidden = lines.length === 0;

  list.replaceChildren(...lines.map((line) => buildLineElement(doc, line)));

  panel.querySelector("[data-basket-total]").textContent = formatPrice(
    basketTotalCents(basket),
  );
}

/*
  Wire up whichever basket pieces exist on this page and restore the saved
  basket. Safe to call on every page.
*/
export function initBasketUI(doc, storage) {
  let basket = loadBasket(storage);

  const panel = doc.querySelector("[data-basket]");
  const status = doc.querySelector("[data-basket-status]");

  /*
    Say what just happened, for anyone who cannot see the basket update.
    The status element is a live region, so assistive technology reads this
    without moving focus away from the button that was just pressed.
  */
  function announce(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function update(nextBasket) {
    basket = nextBasket;
    saveBasket(storage, basket);
    renderBasketPanel(doc, basket);
    renderBasketCount(doc, basket);
  }

  for (const button of doc.querySelectorAll("[data-add-to-order]")) {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-add-to-order");
      const product = findProduct(id);
      if (!product) {
        return;
      }

      update(addToBasket(basket, id));
      announce(`${product.name} added to your pre-order.`);
    });
  }

  if (panel) {
    panel.addEventListener("click", (event) => {
      const stepButton = event.target.closest("[data-step]");
      if (stepButton) {
        const id = stepButton.getAttribute("data-line-id");
        const product = findProduct(id);
        const delta = Number(stepButton.getAttribute("data-step"));
        const before = basket.find((line) => line.id === id)?.quantity ?? 0;

        update(changeQuantity(basket, id, delta));

        const after = basket.find((line) => line.id === id)?.quantity ?? 0;
        if (after === 0) {
          announce(`${product.name} removed from your pre-order.`);
        } else if (after === before) {
          announce(`That is the most ${product.name} we can take on one order.`);
        } else {
          announce(`${product.name}, quantity ${after}.`);
        }
        return;
      }

      const removeButton = event.target.closest("[data-remove-id]");
      if (removeButton) {
        const id = removeButton.getAttribute("data-remove-id");
        const product = findProduct(id);
        update(removeFromBasket(basket, id));
        announce(`${product.name} removed from your pre-order.`);
        return;
      }

      if (event.target.closest("[data-basket-clear]")) {
        update(emptyBasket());
        clearStoredBasket(storage);
        announce("Your pre-order has been cleared.");
      }
    });
  }

  renderBasketPanel(doc, basket);
  renderBasketCount(doc, basket);
}
