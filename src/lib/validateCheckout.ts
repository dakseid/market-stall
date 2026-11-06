export interface CheckoutValues {
  name: string;
  phone: string;
  address: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

// Accepts 080..., 070..., 090..., +234..., 234... (spaces and dashes allowed)
const NG_PHONE = /^(?:\+234|234|0)[789][01]\d{8}$/;

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = "Enter your full name.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";

  const phone = values.phone.replace(/[\s-]/g, "");
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!NG_PHONE.test(phone))
    errors.phone = "Enter a valid Nigerian number, e.g. 0803 123 4567 or +234 803 123 4567.";

  const address = values.address.trim();
  if (!address) errors.address = "Enter your delivery address.";
  else if (address.length < 10)
    errors.address = "Address is too short. Include street, area and city.";

  return errors;
}