'use server';

import { db } from '@repo/db';
import { SyncStatus, UserGet } from '@repo/types';
import { generateRandomKey } from '@repo/utils';

export const dbUserUpsert = async (user: UserGet, email: string) => {
  try {
    const transaction = await db.$transaction(
      async (tx) => {
        const now = new Date();

        // 1. Look up the first account matching the email
        const existingAccount = await tx.account.findFirst({
          where: { email },
          select: { userId: true },
        });

        // 2. If account exists and is linked to a user, fetch and return that user
        if (existingAccount?.userId) {
          const existingUser = await tx.user.findUnique({
            where: { id: existingAccount.userId },
          });

          if (existingUser) {
            return { user: existingUser };
          }
        }

        // 3. Otherwise, create a new user
        const newUser = await db.user.create({
          data: {
            ...user,
            userCode:
              user.userCode ||
              generateRandomKey({
                chunks: 8,
                chunkLength: 1,
                separator: '',
              }).toUpperCase(),
            syncStatus: SyncStatus.SYNCED,
            createdAt: user.createdAt ? new Date(user.createdAt) : now,
            updatedAt: now,
          },
        });

        return { user: newUser };
      },
      {
        maxWait: 10000, // Wait up to 10s to acquire a connection from the pool
        timeout: 15000, // Allow 15s total execution time inside the transaction
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create user):', error);
    throw error;
  }
};
