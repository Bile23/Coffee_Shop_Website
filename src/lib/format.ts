// All prices in the store are South African rand (ZAR).
export function zar(amount: number, decimals = 2): string {
  return `R${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).replace(/ /g, " ")}`;
}

export const FREE_DELIVERY_THRESHOLD = 600;
export const STANDARD_DELIVERY_FEE = 60;
export const EXPRESS_DELIVERY_FEE = 120;
