const PHONE_RE = /^(\+251|0)?[79]\d{8}$/;

export function validateCustomer(input) {
  const values = {
    name: String(input?.name ?? "").trim(),
    phone: String(input?.phone ?? "").replace(/[\s-]/g, ""),
    address: String(input?.address ?? "").trim(),
    notes: String(input?.notes ?? "").trim(),
  };

  const errors = {};
  if (values.name.length < 2 || values.name.length > 80)
    errors.name = "Enter your full name (2–80 characters)";
  if (!PHONE_RE.test(values.phone))
    errors.phone = "Enter a valid Ethiopian phone number, e.g. 0911223344";
  if (values.address.length < 5 || values.address.length > 200)
    errors.address = "Enter a delivery address (5–200 characters)";
  if (values.notes.length > 200)
    errors.notes = "Notes must be under 200 characters";

  return { values, errors, isValid: Object.keys(errors).length === 0 };
}
