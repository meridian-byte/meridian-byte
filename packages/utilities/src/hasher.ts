/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Hashing } from '@repo/types/enums';

/**
 * Convert ArrayBuffer to hex string
 */
const arrayBufferToHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

/**
 * Hash a string or number using Web Crypto API
 */
export const hashValue = async (
  rawValue: string | number,
  algorithm: Hashing = Hashing.SHA256
): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawValue.toString());
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return arrayBufferToHex(hashBuffer);
  } catch (error) {
    console.error('---> utility error (hash value):', error);
    throw error;
  }
};

/**
 * Compare a raw value against a hashed string
 */
export const compareHashes = async (
  rawValue: string | number,
  hashedValue: string | null,
  algorithm: Hashing = Hashing.SHA256
): Promise<boolean> => {
  if (!hashedValue) return false;

  try {
    const hashHex = await hashValue(rawValue, algorithm);
    return hashHex === hashedValue;
  } catch (error) {
    console.error('---> utility error (compare hashes):', error);
    return false;
  }
};
