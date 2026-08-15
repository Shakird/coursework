
const NAME_MIN = 2;
const NAME_MAX = 80;
const EMAIL_MAX = 120;
const ITEMS_MIN = 10;
const ITEMS_MAX = 1000;
const ALLERGIES_MAX = 500;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

const PHONE_CHARACTERS = /^[0-9\s\-().+]+$/;
const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(value) {
  const email = text(value);
  return email.length > 0 && EMAIL_PATTERN.test(email);
}

export function isValidPhone(value) {
  const phone = text(value);
  if (phone.length === 0 || !PHONE_CHARACTERS.test(phone)) {
    return false;
  }

  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount >= PHONE_MIN_DIGITS && digitCount <= PHONE_MAX_DIGITS;
}

export function validateOrderForm(values) {
  const form = values ?? {};
  const errors = {};

  const name = text(form.name);
  if (name === "") {
    errors.name = "Please enter your full name so we can label your order.";
  } else if (name.length < NAME_MIN) {
    errors.name = `Your name needs at least ${NAME_MIN} characters.`;
  } else if (name.length > NAME_MAX) {
    errors.name = `Your name cannot be longer than ${NAME_MAX} characters.`;
  }

  const email = text(form.email);
  if (email === "") {
    errors.email = "Please enter an email address so we can confirm your order.";
  } else if (email.length > EMAIL_MAX) {
    errors.email = `That email address is longer than ${EMAIL_MAX} characters.`;
  } else if (!isValidEmail(email)) {
    errors.email = "That email address does not look right. Check for a missing @ or domain.";
  }

  const phone = text(form.phone);
  if (phone !== "" && !isValidPhone(phone)) {
    errors.phone = "That phone number does not look right. Digits, spaces, and ( ) - + only.";
  }

  if (text(form.requestType) === "") {
    errors.requestType = "Please tell us which kind of request this is.";
  }

  if (text(form.pickupDate) === "") {
    errors.pickupDate = "Please choose the day you would like to pick up.";
  }

  if (text(form.pickupTime) === "") {
    errors.pickupTime = "Please choose a pickup time window.";
  }

  const items = text(form.items);
  if (items === "") {
    errors.items = "Please tell us what you would like to order.";
  } else if (items.length < ITEMS_MIN) {
    errors.items = `Please give us at least ${ITEMS_MIN} characters of detail so we know what to bake.`;
  } else if (items.length > ITEMS_MAX) {
    errors.items = `Please keep the details under ${ITEMS_MAX} characters, or call us instead.`;
  }

  const allergies = text(form.allergies);
  if (allergies.length > ALLERGIES_MAX) {
    errors.allergies = `Please keep allergy notes under ${ALLERGIES_MAX} characters.`;
  }

  if (allergies !== "" && !form.allergyAck) {
    errors.allergyAck =
      "You mentioned an allergy, so please confirm you have read the shared kitchen note.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
