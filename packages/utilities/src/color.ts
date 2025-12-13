/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { generateSeededPrime, generateRandomPrime } from './generators';

/**
 * Options for color generation
 * @param {boolean} options.includeAlpha - Whether to include alpha channel
 * @param {number} options.minBrightness - Minimum brightness value between 0-1
 * @param {number} options.maxBrightness - Maximum brightness value between 0-1
 * @param {string} options.seed - Seed string to generate consistent colors (e.g., category name)
 */

type ColorOptions = {
  includeAlpha?: boolean;
  minBrightness?: number;
  maxBrightness?: number;
  seed?: string;
};

/**
 * Generates a hexadecimal color value, optionally based on a seed string.
 * If a seed is provided, the same seed will always generate the same color.
 */
export const generateRandomHexColor = ({
  includeAlpha = false,
  minBrightness = 0.1,
  maxBrightness = 0.6,
  seed = '',
}: ColorOptions = {}): string => {
  // Validate brightness values
  if (
    minBrightness < 0 ||
    minBrightness > 1 ||
    maxBrightness < 0 ||
    maxBrightness > 1 ||
    minBrightness > maxBrightness
  ) {
    throw new Error(
      'Brightness values must be between 0 and 1, and minBrightness must be less than or equal to maxBrightness'
    );
  }

  // Enhanced string hash function that uses a different prime for each RGB component
  const hashString = (str: string, prime: number): number => {
    let hash = prime;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Get deterministic or random value in range
  const getValueInRange = (index: number, min: number, max: number): number => {
    const prime = seed
      ? generateSeededPrime(seed, index)
      : generateRandomPrime(9);

    if (seed) {
      const hash = hashString(seed + index.toString(), prime);
      return min + (hash % (max - min + 1));
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Convert brightness range to RGB values (0-255)
  const minValue = Math.round(minBrightness * 255);
  const maxValue = Math.round(maxBrightness * 255);

  // Generate RGB values with random or seeded primes
  const r = getValueInRange(1, minValue, maxValue);
  const g = getValueInRange(2, minValue, maxValue);
  const b = getValueInRange(3, minValue, maxValue);
  const a = includeAlpha ? getValueInRange(4, 0, 255) : null;

  // Convert to hex and pad with zeros if necessary
  const toHex = (n: number): string => n.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a ? toHex(a) : ''}`;
};
