import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { WorkspaceGet } from '@repo/types/models/workspace';
import { Status, SyncStatus, WorkspaceType } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useWorkspaceActions = () => {
  const session = useStoreSession((s) => s.session);
  const addWorkspace = useStoreWorkspace((s) => s.addWorkspace);
  const updateWorkspace = useStoreWorkspace((s) => s.updateWorkspace);
  const deleteWorkspace = useStoreWorkspace((s) => s.deleteWorkspace);

  const accountCreate = (
    params: Omit<Partial<WorkspaceGet>, 'type'> & { type: WorkspaceType }
  ) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newWorkspace: WorkspaceGet = {
      id: params.id || id,
      title: params.title || 'New Workspace',
      type: params.type,
      profile_id: params.profile_id || session.id,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addWorkspace(newWorkspace);
  };

  const accountUpdate = (params: WorkspaceGet) => {
    if (!session) return;

    const now = new Date();

    const newWorkspace: WorkspaceGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateWorkspace(newWorkspace);
  };

  const accountDelete = (params: WorkspaceGet) => {
    if (!session) return;

    const now = new Date();

    deleteWorkspace({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { accountCreate, accountUpdate, accountDelete };
};
