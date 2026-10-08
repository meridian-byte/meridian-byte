'use server';

import { db } from '@repo/db';
import { SyncStatus, SessionGet, AccountGet } from '@repo/types';

export const dbSessionCreate = async (session: SessionGet, upsertedAccounts: AccountGet[]) => {
  try {
    const transaction = await db.$transaction(
      async (tx) => {
        const now = new Date();

        // Destructure 'id' if you want Prisma to generate a fresh ID automatically,
        // or keep it if session.id is a pre-generated UUID/cuid.
        const { id, ...sessionData } = session;

        const newSession = await tx.session.create({
          data: {
            ...sessionData,
            ...(id ? { id } : {}), // Uses pre-generated ID if provided, otherwise Prisma auto-generates
            otp: null,
            syncStatus: SyncStatus.SYNCED,
            expiresAt: session?.expiresAt ? new Date(session.expiresAt) : now,
            createdAt: session?.createdAt ? new Date(session.createdAt) : now,
            updatedAt: now,

            accounts: {
              connect: upsertedAccounts.map((acc) => ({ id: acc.id })),
            },
          },
        });

        return { session: newSession };
      },
      {
        maxWait: 10000, // Wait up to 10s to acquire a connection from the pool
        timeout: 15000, // Allow 15s total execution time inside the transaction
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create session):', error);
    throw error;
  }
};
