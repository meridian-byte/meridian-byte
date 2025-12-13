/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export interface MinSec {
  minutes: string;
  seconds: string;
}

/**
 * Converts milliseconds to minutes and seconds
 * Example: 125000 → { minutes: "02", seconds: "05" }
 */
export const millToMinSec = (milliseconds: number): MinSec | null => {
  if (milliseconds < 0 || !Number.isFinite(milliseconds)) return null;

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

/**
 * Pads a number with leading zeros
 * Example: prependZeros(7, 3) → "007"
 */
export const prependZeros = (value: number, length: number): string =>
  String(value).padStart(length, '0');

/**
 * Formats a large number into a short human-readable form
 * Example: 1234000 → "1.2M"
 */
export const formatNumber = (value: number, decimals = 1): string => {
  if (!Number.isFinite(value)) return '0';

  const lookup = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ];

  const absolute = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const item = lookup.find((i) => absolute >= i.value);

  if (!item) return sign + absolute.toString();

  const formatted = (absolute / item.value).toFixed(decimals);
  const cleaned = parseFloat(formatted).toString(); // removes trailing zeros

  return `${sign}${cleaned}${item.symbol}`;
};

/**
 * Converts milliseconds into a formatted duration string.
 * Example: 3661000 → "1h 1m 1s"
 */
export const formatDuration = (
  milliseconds: number,
  options: {
    compact?: boolean; // true → "01:01:01", false → "1h 1m 1s"
    includeMs?: boolean; // include milliseconds if < 1 second
  } = {}
): string => {
  if (milliseconds < 0 || !Number.isFinite(milliseconds)) return '0s';

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;

  // Compact format → "HH:MM:SS"
  if (options.compact) {
    const parts = [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].filter(Boolean);

    return parts.join(':');
  }

  // Readable format → "1h 1m 1s"
  const parts: string[] = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || (!hours && !minutes)) parts.push(`${seconds}s`);
  if (options.includeMs && milliseconds < 1000) parts.push(`${ms}ms`);

  return parts.join(' ');
};

/**
 * Converts milliseconds into a smart, human-readable duration.
 * Automatically picks the best time unit (e.g. "2h", "3d", "5w").
 */
export const formatAutoDuration = (
  milliseconds: number,
  options: {
    decimals?: number; // how many decimals to include (default = 1)
    short?: boolean; // use abbreviated units (e.g., "2h" instead of "2 hours")
    maxUnit?: 'w' | 'd' | 'h' | 'm' | 's'; // limit the largest allowed unit
  } = {}
): string => {
  if (milliseconds < 0 || !Number.isFinite(milliseconds)) return '0s';

  const { decimals = 1, short = true, maxUnit } = options;

  const units = [
    { label: 'w', full: 'week', value: 1000 * 60 * 60 * 24 * 7 },
    { label: 'd', full: 'day', value: 1000 * 60 * 60 * 24 },
    { label: 'h', full: 'hour', value: 1000 * 60 * 60 },
    { label: 'm', full: 'minute', value: 1000 * 60 },
    { label: 's', full: 'second', value: 1000 },
  ];

  // Optionally restrict the upper bound
  const filteredUnits = maxUnit
    ? units.slice(units.findIndex((u) => u.label === maxUnit))
    : units;

  // Find the best fitting unit
  const unit =
    filteredUnits.find((u) => milliseconds >= u.value) ?? filteredUnits.at(-1)!;

  const amount = milliseconds / unit.value;
  const formatted = amount.toFixed(decimals).replace(/\.0+$/, '');

  const label = short ? unit.label : `${unit.full}${amount !== 1 ? 's' : ''}`;

  return `${formatted}${short ? label : ' ' + label}`;
};

/**
 * Splits a total sum into a weighted partition array.
 * Example: getPartitions(3, 2, 100) → [14.29, 28.57, 57.14]
 */
export const getPartitions = (
  count: number,
  multiplier: number,
  totalSum: number
): number[] => {
  if (count <= 0 || multiplier <= 0 || totalSum <= 0) {
    throw new Error('All inputs must be positive numbers.');
  }

  // Generate weights (e.g., 1, multiplier, multiplier², ...)
  const weights = Array.from({ length: count }, (_, i) =>
    Math.pow(multiplier, i)
  );

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  const scale = totalSum / totalWeight;

  // Scale weights to match total sum and round for precision
  const result = weights.map((w) => +(w * scale).toFixed(2));

  // Fix rounding drift to ensure total sum matches
  const drift = totalSum - result.reduce((acc, num) => acc + num, 0);

  if (Math.abs(drift) >= 0.01) {
    result[result.length - 1] = +(result[result.length - 1] + drift).toFixed(2);
  }

  return result;
};

/**
 * Round a number to a specified number of decimal places
 * and remove unnecessary trailing zeros.
 *
 * Example:
 *   12.5000 with 2 decimals => 12.5
 *
 * @param value - the number to round
 * @param decimalPlaces - number of decimals to preserve
 * @returns number rounded and truncated
 */
export const roundAndTruncate = (
  value: number,
  decimalPlaces: number
): number => {
  if (decimalPlaces < 0) {
    throw new Error('Decimal places must be a non-negative integer.');
  }

  // Convert to fixed decimals (automatically rounds) and back to number to remove trailing zeros
  return parseFloat(value.toFixed(decimalPlaces));
};

/**
 * Round a number to a fixed number of decimal places
 * and return as a string, preserving exact decimal places.
 *
 * Example:
 *   12.5 with 2 decimals => "12.50"
 *
 * @param value - the number to round
 * @param decimalPlaces - number of decimals to preserve
 * @returns string with fixed decimals
 */
export const roundAndFormat = (
  value: number,
  decimalPlaces: number
): string => {
  if (decimalPlaces < 0) {
    throw new Error('Decimal places must be a non-negative integer.');
  }

  // toFixed automatically rounds and pads with zeros
  return value.toFixed(decimalPlaces);
};
