import { useStoreLink } from '../link';
import { useStoreSession } from '../session';
import { LinkGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';

export const useLinkActions = () => {
  const session = useStoreSession((s) => s.session);
  const links = useStoreLink((s) => s.links);
  const addLink = useStoreLink((s) => s.addLink);
  const updateLink = useStoreLink((s) => s.updateLink);
  const deleteLink = useStoreLink((s) => s.deleteLink);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const linkCreate = (params?: Partial<LinkGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newLink: LinkGet = {
      id: params?.id || id,
      fromId: params?.fromId || '',
      toId: params?.toId || '',
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addLink(newLink);

    return newLink;
  };

  const linkUpdate = (params: LinkGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newLink: LinkGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateLink(newLink);
  };

  const linkDelete = (params: LinkGet) => {
    if (!session) return;
    if (!links) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteLink({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return {
    linkCreate,
    linkUpdate,
    linkDelete,
  };
};
