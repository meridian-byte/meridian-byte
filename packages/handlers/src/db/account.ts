'use server';

import { db } from '@repo/db';
import { SyncStatus, AccountGet, Role } from '@repo/types';

export const dbAccountUpsert = async (accounts: AccountGet[], userId?: string) => {
  try {
    const transaction = await db.$transaction(
      async (tx) => {
        const newAccounts: AccountGet[] = [];
        const now = new Date();

        for (const acc of accounts) {
          // Destructure 'id' out so it isn't passed into the update block
          const { id, ...accData } = acc;

          const upserted = await tx.account.upsert({
            where: { email: acc.email },

            update: {
              ...accData, // Contains everything EXCEPT 'id' — keeps existing DB ID
              userId: userId || acc.userId,
              syncStatus: SyncStatus.SYNCED,
              updatedAt: now,
              // Note: omitted createdAt so existing creation timestamp is preserved
            },

            create: {
              ...accData,
              ...(id ? { id } : {}), // Uses acc.id if provided, otherwise Prisma auto-generates
              role: acc.role || Role.USER,
              userId: userId || acc.userId,
              syncStatus: SyncStatus.SYNCED,
              createdAt: acc.createdAt ? new Date(acc.createdAt) : now,
              updatedAt: now,
            },
          });

          newAccounts.push(upserted);
        }

        return { accounts: newAccounts };
      },
      {
        maxWait: 10000, // Wait up to 10s to acquire a connection from the pool
        timeout: 15000, // Allow 15s total execution time inside the transaction
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create account):', error);
    throw error;
  }
};
