/**
 * Bio-tiful ERP Currency Formatting Utility
 * Handles conversion between TND (Tunisian Dinar) and USD ($)
 */

// Exchange rate: 1 TND = 0.32 USD (Approximation)
export const TND_TO_USD = 0.32;

export function formatCurrency(amountTND: string | number | null | undefined): string {
  if (amountTND === null || amountTND === undefined) return "0.00 TND ($0.00)";
  
  const tnd = typeof amountTND === 'string' ? parseFloat(amountTND) : amountTND;
  const usd = tnd * TND_TO_USD;

  return `${tnd.toLocaleString('en-TN', { minimumFractionDigits: 3 })} TND ($${usd.toLocaleString('en-US', { minimumFractionDigits: 2 })})`;
}

/**
 * Simplified formatter for small spaces (e.g. table cells)
 */
export function formatCurrencyCompact(amountTND: string | number | null | undefined): string {
  if (amountTND === null || amountTND === undefined) return "0 TND ($0)";
  
  const tnd = typeof amountTND === 'string' ? parseFloat(amountTND) : amountTND;
  const usd = tnd * TND_TO_USD;

  return `${tnd.toLocaleString('en-TN', { minimumFractionDigits: 3 })} TND ($${usd.toFixed(2)})`;
}
