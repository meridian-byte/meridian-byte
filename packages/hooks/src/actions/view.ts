import { useStoreView } from '@repo/libraries/zustand/stores/view';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { ViewGet } from '@repo/types/models/view';
import { GroupSort, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useViewActions = () => {
  const session = useStoreSession((s) => s.session);
  const addView = useStoreView((s) => s.addView);
  const updateView = useStoreView((s) => s.updateView);
  const deleteView = useStoreView((s) => s.deleteView);

  const viewCreate = (params: Partial<ViewGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newView: ViewGet = {
      id: params.id || id,
      category_filter: params.category_filter || null,
      group_by: params.group_by || GroupSort.DATE,
      priority_filter: params.priority_filter || null,
      sort_by: params.sort_by || null,
      sort_direction: params.sort_direction || null,
      title: params.title || '',
      view: params.view || null,
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addView(newView);
  };

  const viewUpdate = (params: ViewGet) => {
    if (!session) return;

    const now = new Date();

    const newView: ViewGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateView(newView);
  };

  const viewDelete = (params: ViewGet) => {
    if (!session) return;

    const now = new Date();

    deleteView({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { viewCreate, viewUpdate, viewDelete };
};
