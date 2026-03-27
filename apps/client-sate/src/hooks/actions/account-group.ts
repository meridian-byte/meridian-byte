import { useStoreAccountGroup } from '@/libraries/zustand/stores/account-group';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { AccountGroupGet } from '@repo/types/models/account-group';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useAccountGroupActions = () => {
  const { session } = useStoreSession();
  const { addAccountGroup, updateAccountGroup, deleteAccountGroup } =
    useStoreAccountGroup();

  const accountGroupCreate = (params: Partial<AccountGroupGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newAccountGroup: AccountGroupGet = {
      id: params.id || id,
      name: params.name || '',
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addAccountGroup(newAccountGroup);
  };

  const accountGroupUpdate = (params: AccountGroupGet) => {
    if (!session) return;

    const now = new Date();

    const newAccountGroup: AccountGroupGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateAccountGroup(newAccountGroup);
  };

  const accountGroupDelete = (params: AccountGroupGet) => {
    if (!session) return;

    const now = new Date();

    deleteAccountGroup({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { accountGroupCreate, accountGroupUpdate, accountGroupDelete };
};
