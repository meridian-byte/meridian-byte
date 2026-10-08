'use server';

import { db } from '@repo/db';
import { AccountGet, ProfileGet, SyncStatus } from '@repo/types';

export const dbProfileUpsert = async (params: ProfileGet, userId: string, account: AccountGet) => {
  try {
    const transaction = await db.$transaction(
      async (tx) => {
        const now = new Date();

        const dbAccounts = await tx.account.findMany({
          where: { userId },
          select: { id: true },
        });

        const accountIds = dbAccounts.map((ai) => ai.id);
        const targetAccountId = account.id;

        if (!accountIds.includes(targetAccountId)) {
          throw new Error('Unauthorized: Account does not belong to user.');
        }

        // 1. Check if a profile exists by targetAccountId (since accountId is @unique)
        //    or fallback to params.id
        let existingProfile = await tx.profile.findFirst({
          where: {
            OR: [{ accountId: targetAccountId }, ...(params.id ? [{ id: params.id }] : [])],
            accountId: { in: accountIds }, // Security check
          },
        });

        const { id, ...paramData } = params;

        let upsertProfile;

        if (existingProfile) {
          // 2. Profile exists for this account -> UPDATE existing record
          upsertProfile = await tx.profile.update({
            where: { id: existingProfile.id },
            data: {
              ...paramData,
              userName: existingProfile.userName || paramData.userName,
              firstName: existingProfile.firstName || paramData.firstName,
              lastName: existingProfile.lastName || paramData.lastName,
              avatar: existingProfile.avatar || paramData.avatar,
              phone: existingProfile.phone || paramData.phone,
              address: existingProfile.address || paramData.address,
              customized: existingProfile.customized || paramData.customized,
              accountId: targetAccountId,
              syncStatus: SyncStatus.SYNCED,
              updatedAt: now,
              // Omit createdAt to preserve original creation date
            },
          });
        } else {
          // 3. No profile exists for this account -> CREATE new record
          upsertProfile = await tx.profile.create({
            data: {
              ...paramData,
              ...(id ? { id } : {}), // Preserves passed id if defined, otherwise auto-generated
              accountId: targetAccountId,
              syncStatus: SyncStatus.SYNCED,
              createdAt: params?.createdAt ? new Date(params.createdAt) : now,
              updatedAt: now,
            },
          });
        }

        return {
          profile: upsertProfile,
          preExisting: !!existingProfile,
        };
      },
      {
        maxWait: 10000, // Wait up to 10s to acquire a connection from the pool
        timeout: 15000, // Allow 15s total execution time inside the transaction
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create profile):', error);
    throw error;
  }
};
