export function formatNaira(amount?: number | null): string {
  const value = amount ?? 0;
  return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}
