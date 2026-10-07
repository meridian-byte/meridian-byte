'use server';

import { EncryptionAlg } from '@repo/types';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

export const jwtOps = async (
  secret: string = process.env.NEXT_JWT_SECRET || 'your-default-secure-secret-key',
  encryption: EncryptionAlg = EncryptionAlg.HS256,
) => {
  // Cache key encoding once per helper instantiation
  const secretEncoded = new TextEncoder().encode(secret);

  return {
    /**
     * Signs any custom payload object and returns the signed JWT token string.
     */
    sign: async <T extends Record<string, unknown>>(
      payload: T,
      expiryInSeconds: number = 60 * 5, // Default: 5 minutes
    ): Promise<{ signature: string; encryptionUsed: EncryptionAlg }> => {
      const expirationTime = Math.floor(Date.now() / 1000) + expiryInSeconds;

      const signature = await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: encryption })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(secretEncoded);

      return { signature, encryptionUsed: encryption };
    },

    /**
     * Verifies a JWT token and returns the payload typed as T.
     * Returns null if signature is invalid, tampered with, or expired.
     */
    unsign: async <T extends Record<string, unknown>>(
      signature: string,
    ): Promise<(T & JWTPayload) | null> => {
      try {
        const { payload } = await jwtVerify(signature, secretEncoded, {
          algorithms: [encryption],
        });

        return payload as T & JWTPayload;
      } catch (error) {
        console.error('[ERROR] Failed to verify JWT token:', error);
        return null;
      }
    },
  };
};
