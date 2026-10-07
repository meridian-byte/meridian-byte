'use server';

import { db } from '@repo/db';
import { SyncStatus, UserGet } from '@repo/types';
import { generateRandomKey } from '@repo/utils';

export const dbUserUpsert = async (user: UserGet, email: string) => {
  try {
    const transaction = await db.$transaction(
      async (db) => {
        const now = new Date();

        // 1. Look up the first account matching the email
        const existingAccount = await db.account.findFirst({
          where: { email },
          select: { userId: true },
        });

        // 2. If account exists and is linked to a user, fetch and return that user
        if (existingAccount?.userId) {
          const existingUser = await db.user.findUnique({
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
        timeout: 15000,
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create user):', error);
    throw error;
  }
};
