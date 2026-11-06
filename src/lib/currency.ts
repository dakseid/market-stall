// Assumption: the API prices are in USD. Change this one number to update the whole app.
export const USD_TO_NGN = 1500;

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function toNaira(usd: number): number {
  return Math.round(usd * USD_TO_NGN);
}

// Format an amount that is already in naira (used for line totals and cart total)
export function formatNgn(naira: number): string {
  return formatter.format(naira);
}

export function formatNaira(usd: number): string {
  return formatNgn(toNaira(usd));
}