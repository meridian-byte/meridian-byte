export function formatNumber(n: number): number {
  // If integer, return as-is
  if (Number.isInteger(n)) return Math.floor(n);

  // Round to 1 decimal place
  return Math.round(n * 10) / 10;
}
