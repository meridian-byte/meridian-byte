import { useStoreLink } from '@/libraries/zustand/stores/link';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { LinkGet } from '@repo/types/models/link';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useLinkActions = () => {
  const { session } = useStoreSession();
  const { addLink, updateLink, deleteLink } = useStoreLink();

  const linkCreate = (params: Partial<LinkGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newLink: LinkGet = {
      id: params.id || id,
      profile_id: session.id || params.profile_id || '',
      from_id: params.from_id || '',
      to_id: params.to_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addLink(newLink);
  };

  const linkUpdate = (params: LinkGet) => {
    if (!session) return;

    const now = new Date();

    const newLink: LinkGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateLink(newLink);
  };

  const linkDelete = (params: LinkGet) => {
    if (!session) return;

    const now = new Date();

    deleteLink({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { linkCreate, linkUpdate, linkDelete };
};
