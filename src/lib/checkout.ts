export type CheckoutField = "name" | "phone" | "address" | "district" | "note";

export type CheckoutValues = {
  name: string;
  phone: string;
  address: string;
  district: string;
  note: string;
};

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

/** Bangladeshi mobile numbers: optional +88, then 01[3-9] and 8 more digits. */
export const BD_PHONE_PATTERN = /^(?:\+?88)?0?1[3-9]\d{8}$/;

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Please enter the name for this order.";
  } else if (name.length < 2) {
    errors.name = "That name looks too short.";
  }

  const phone = values.phone.trim().replace(/[\s-]/g, "");
  if (!phone) {
    errors.phone = "Please enter a mobile number the courier can reach.";
  } else if (!BD_PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid Bangladeshi mobile number, for example 01712345678.";
  }

  const address = values.address.trim();
  if (!address) {
    errors.address = "Please enter your street address and area.";
  } else if (address.length < 8) {
    errors.address = "Please add a little more detail so the parcel reaches you.";
  }

  if (!values.district.trim()) {
    errors.district = "Choose the district for delivery.";
  }

  return errors;
}

/** Builds a clearly-marked demo reference such as FMS-260921-4821. */
export function createDemoReference(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FMS-${yy}${mm}${dd}-${random}`;
}
