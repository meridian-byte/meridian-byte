import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { AccountGet } from '@repo/types/models/account';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useAccountActions = () => {
  const { session } = useStoreSession();
  const { addAccount, updateAccount, deleteAccount } = useStoreAccount();

  const accountCreate = (params: Partial<AccountGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newAccount: AccountGet = {
      id: params.id || id,
      balance: Number(params.balance || 0).toFixed(2) as any,
      currency: params.currency || null,
      currency_code: params.currency_code || null,
      group_id: params.group_id || '',
      profile_id: session.id || params.profile_id || '',
      name: params.name || '',
      description: params.description || '',
      type: (params.type || '') as any,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addAccount(newAccount);
  };

  const accountUpdate = (params: AccountGet) => {
    if (!session) return;

    const now = new Date();

    const newAccount: AccountGet = {
      ...params,
      balance: Number(params.balance).toFixed(2) as any,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateAccount(newAccount);
  };

  const accountDelete = (params: AccountGet) => {
    if (!session) return;

    const now = new Date();

    deleteAccount({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { accountCreate, accountUpdate, accountDelete };
};
