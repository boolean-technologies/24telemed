
/**
 * Converts a number to Naira currency format
 * @param amount - The amount to be converted
 * @returns A formatted string representing the amount in Naira
 */
export function formatToNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  