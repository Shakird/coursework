import { validateOrderForm } from "./validation.js";
import { summarizeForForm } from "./basket.js";
import { clearStoredBasket, loadBasket } from "./storage.js";
import { renderBasketCount } from "./basket-ui.js";
import { emptyBasket } from "./basket.js";

const FIELD_INPUTS = {
  name: "name",
  email: "email",
  phone: "phone",
  requestType: "type-preorder",
  pickupDate: "pickup-date",
  pickupTime: "pickup-time",
  items: "items",
  allergies: "allergies",
  allergyAck: "allergy-ack",
};

const INPUT_TO_FIELD = {
  name: "name",
  email: "email",
  phone: "phone",
  "type-preorder": "requestType",
  "type-cake": "requestType",
  "type-question": "requestType",
  "pickup-date": "pickupDate",
  "pickup-time": "pickupTime",
  items: "items",
  allergies: "allergies",
  "allergy-ack": "allergyAck",
};

function readValues(doc) {
  const chosenType = doc.querySelector('input[name="request-type"]:checked');

  return {
    name: doc.getElementById("name").value,
    email: doc.getElementById("email").value,
    phone: doc.getElementById("phone").value,
    requestType: chosenType ? chosenType.value : "",
    pickupDate: doc.getElementById("pickup-date").value,
    pickupTime: doc.getElementById("pickup-time").value,
    items: doc.getElementById("items").value,
    allergies: doc.getElementById("allergies").value,
    allergyAck: doc.getElementById("allergy-ack").checked,
  };
}

function setDescribedBy(input, errorId, shouldDescribe) {
  const current = (input.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .filter((token) => token !== "" && token !== errorId);

  if (shouldDescribe) {
    current.push(errorId);
  }

  if (current.length === 0) {
    input.removeAttribute("aria-describedby");
  } else {
    input.setAttribute("aria-describedby", current.join(" "));
  }
}

function showFieldError(doc, field, message) {
  const slot = doc.querySelector(`[data-error-for="${field}"]`);
  const input = doc.getElementById(FIELD_INPUTS[field]);
  if (!slot || !input) {
    return;
  }

  if (message) {
    slot.textContent = message;
    slot.hidden = false;
    input.setAttribute("aria-invalid", "true");
    setDescribedBy(input, slot.id, true);
  } else {
    slot.textContent = "";
    slot.hidden = true;
    input.removeAttribute("aria-invalid");
    setDescribedBy(input, slot.id, false);
  }
}

function setEarliestPickupDate(doc) {
  const input = doc.getElementById("pickup-date");
  if (!input) {
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  input.setAttribute("min", `${year}-${month}-${day}`);
}

export function initContactForm(doc, storage) {
  const form = doc.querySelector("[data-order-form]");
  if (!form) {
    return; // not the contact page
  }

  const successPanel = doc.querySelector("[data-form-success]");
  const itemsField = doc.getElementById("items");
  const prefillNotice = doc.querySelector("[data-basket-prefill-notice]");

  const touched = new Set();

  setEarliestPickupDate(doc);

  for (const field of Object.keys(FIELD_INPUTS)) {
    showFieldError(doc, field, "");
  }
  successPanel.hidden = true;

  const summary = summarizeForForm(loadBasket(storage));
  if (summary !== "" && itemsField.value.trim() === "") {
    itemsField.value = summary;
    prefillNotice.hidden = false;
  } else {
    prefillNotice.hidden = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const { isValid, errors } = validateOrderForm(readValues(doc));

    if (!isValid) {
      successPanel.hidden = true;

      for (const field of Object.keys(FIELD_INPUTS)) {
        if (errors[field]) {
          touched.add(field);
        }
        showFieldError(doc, field, errors[field] ?? "");
      }

      const firstBadField = Object.keys(FIELD_INPUTS).find((field) => errors[field]);
      doc.getElementById(FIELD_INPUTS[firstBadField]).focus();
      return;
    }

    for (const field of Object.keys(FIELD_INPUTS)) {
      showFieldError(doc, field, "");
    }
    touched.clear();

    const firstName = readValues(doc).name.trim().split(/\s+/)[0];
    successPanel.textContent =
      `Thank you, ${firstName}. Your request is in, and a real person will reply ` +
      `within one business day. Nothing has been charged; you pay at the counter ` +
      `when you pick up.`;
    successPanel.hidden = false;

    clearStoredBasket(storage);
    renderBasketCount(doc, emptyBasket());

    form.reset();
    prefillNotice.hidden = true;

    successPanel.focus();
  });

  function handleFieldChange(event) {
    const field = INPUT_TO_FIELD[event.target.id];
    if (!field || !touched.has(field)) {
      return;
    }

    const { errors } = validateOrderForm(readValues(doc));
    showFieldError(doc, field, errors[field] ?? "");

    if (field === "allergies" && touched.has("allergyAck")) {
      showFieldError(doc, "allergyAck", errors.allergyAck ?? "");
    }
  }

  form.addEventListener("input", handleFieldChange);
  form.addEventListener("change", handleFieldChange);
}