export const CURRENCY_LIST = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export function formatCurrency(
  amount: number,
  currency: string = "NGN",
  locale: string = "en-NG"
): string {
  if (isNaN(amount)) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_LIST.find((c) => c.code === code)?.symbol || "";
}
