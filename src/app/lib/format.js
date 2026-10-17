const currencyFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 2,
});

export function etb(value) {
  const amount = Number(value);
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function when(value) {
  if (!value) return "Date not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function relative(value) {
  if (!value) return "Time not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time not available";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  for (const [unit, duration] of units) {
    if (Math.abs(seconds) >= duration || unit === "second") {
      return formatter.format(Math.round(seconds / duration), unit);
    }
  }

  return "Just now";
}
