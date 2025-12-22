export function formatNumber(n: number, options?: { round?: boolean }): number {
  if (Number.isInteger(n)) return n;

  if (options?.round) {
    // Round to 1 decimal place
    return Math.round(n * 10) / 10;
  } else {
    // Truncate to 1 decimal place
    return Math.floor(n * 10) / 10;
  }
}
