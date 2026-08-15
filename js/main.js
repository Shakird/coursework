import { initBasketUI } from "./basket-ui.js";
import { initContactForm } from "./contact-ui.js";

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
}

const storage = getStorage();

initBasketUI(document, storage);
initContactForm(document, storage);
