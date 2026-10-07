'use client';

import { useEffect } from 'react';
import { STORAGE_NAME } from '@repo/constants';
import {
  generateRandomKey,
  generateUUID,
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utils';
import { SessionValue, useStoreSession } from '../session';
import { AccountGet, ProfileGet, Role, SessionCookie, SyncStatus, UserGet } from '@repo/types';

export const useSessionInitialize = (serverSession: SessionCookie | null) => {
  const setSession = useStoreSession((s) => s.setSession);

  useEffect(() => {
    // Authenticated user:
    // server session is authoritative.
    if (serverSession) {
      setSession(serverSession);

      saveToLocalStorage(STORAGE_NAME.AUTH.SESSION, serverSession);

      return;
    }

    // Unauthenticated user:
    // restore an existing local session if one exists.
    const localSession: SessionValue = getFromLocalStorage(STORAGE_NAME.AUTH.SESSION);

    if (localSession) {
      setSession(localSession);
      return;
    }

    // First visit:
    // create a local anonymous identity.
    const now = new Date().toISOString();

    const user: UserGet = {
      id: generateUUID(),
      userCode: generateRandomKey({
        chunks: 8,
        chunkLength: 1,
        separator: '',
      }),
      syncStatus: SyncStatus.SYNCED,
      createdAt: now as any,
      updatedAt: now as any,
    };

    const account: AccountGet = {
      id: generateUUID(),
      email: '',
      role: Role.USER,
      userId: user.id,
      syncStatus: SyncStatus.SYNCED,
      createdAt: now as any,
      updatedAt: now as any,
    };

    const profile: ProfileGet = {
      id: generateUUID(),
      address: null,
      phone: null,
      firstName: null,
      lastName: null,
      userName: null,
      avatar: null,
      customized: false,
      accountId: account.id,
      syncStatus: SyncStatus.SYNCED,
      createdAt: now as any,
      updatedAt: now as any,
    };

    const anonymousSession: SessionCookie = {
      id: generateUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() as any,
      otp: null,
      timezone: null,
      accounts: [account],
      user,
      profile,
      syncStatus: SyncStatus.SYNCED,
      createdAt: now as any,
      updatedAt: now as any,
    };

    saveToLocalStorage(STORAGE_NAME.AUTH.SESSION, anonymousSession);

    setSession(anonymousSession);
  }, [serverSession, setSession]);
};
