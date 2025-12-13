/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
  return uuidv4();
}

/**
 * Returns a random prime number from a preset list up to a given maximum.
 */
export const generateRandomPrime = (max: number): number => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  if (max <= 2) return 2;
  const validPrimes = primes.filter((p) => p <= max);
  const list = validPrimes.length ? validPrimes : [2];
  return list[Math.floor(Math.random() * list.length)];
};

/**
 * Deterministically generates a prime from a seed + index combination.
 */
export const generateSeededPrime = (seed: string, index = 0): number => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  if (!seed) return primes[index % primes.length];

  // FNV-1a inspired string hash
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const value = (hash + index * 31) >>> 0;
  return primes[value % primes.length];
};

/**
 * Generates a random integer in a given inclusive range [min, max].
 */
export const getRandomIntInRange = (min: number, max: number): number => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max must be integers.');
  }
  if (min > max) {
    throw new Error('Min cannot be greater than max.');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a numeric one-time passcode (OTP) with the specified number of digits.
 * Example: generateOtpCode(6) → 483920
 */
export const generateOtpCode = (digits: number = 6): number => {
  if (digits < 1 || digits > 12) {
    throw new Error('Digits must be between 1 and 12.');
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random alphanumeric key (like a product key), with optional checksum.
 *
 * @param {Object} options
 * @param {number} [options.chunks=4] - Number of groups separated by dashes.
 * @param {number} [options.chunkLength=4] - Characters per group.
 * @param {boolean} [options.alphanumeric=true] - Include numbers in the key.
 * @param {boolean} [options.uppercase=true] - Use uppercase letters.
 * @param {string} [options.separator='-'] - Character used between chunks.
 * @param {string} [options.seed] - Optional seed for deterministic generation.
 * @param {boolean} [options.includeChecksum=false] - Whether to append a checksum chunk.
 * @returns {string} Generated key, e.g. "A9G4-XM7R-3LQ2-Z8VT" or "A9G4-XM7R-3LQ2-Z8VT-C"
 */
export const generateRandomKey = ({
  chunks = 4,
  chunkLength = 4,
  alphanumeric = true,
  uppercase = true,
  separator = '-',
  seed,
  includeChecksum = false,
}: {
  chunks?: number;
  chunkLength?: number;
  alphanumeric?: boolean;
  uppercase?: boolean;
  separator?: string;
  seed?: string;
  includeChecksum?: boolean;
} = {}): string => {
  if (chunks < 1 || chunkLength < 1) {
    throw new Error('Chunks and chunkLength must be greater than 0.');
  }

  // Allowed characters
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const chars = alphanumeric ? letters + numbers : letters;
  const source = uppercase ? chars.toUpperCase() : chars;

  // Seeded RNG (FNV-1a + LCG combo)
  const seededRandom = (s: string): (() => number) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return h / 4294967296;
    };
  };

  const rng = seed ? seededRandom(seed) : Math.random;

  const createChunk = (): string =>
    Array.from(
      { length: chunkLength },
      () => source[Math.floor(rng() * source.length)]
    ).join('');

  let key = Array.from({ length: chunks }, createChunk).join(separator);

  if (includeChecksum) {
    const checksum = generateChecksum(key);
    key += `${separator}${checksum}`;
  }

  return key;
};

/**
 * Generates a single-character checksum for a key string.
 * Ensures simple validation without heavy computation.
 */
export const generateChecksum = (key: string): string => {
  const cleanKey = key.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  let sum = 0;
  for (let i = 0; i < cleanKey.length; i++) {
    sum += cleanKey.charCodeAt(i) * (i + 1);
  }
  const checksumChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return checksumChars[sum % checksumChars.length];
};

/**
 * Validates whether a key string matches its checksum.
 */
export const validateKeyChecksum = (key: string, separator = '-'): boolean => {
  const parts = key.split(separator);
  if (parts.length < 2) return false;

  const checksum = parts.pop()!;
  const base = parts.join(separator);
  return generateChecksum(base) === checksum;
};
