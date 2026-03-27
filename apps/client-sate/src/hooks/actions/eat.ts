import { useStoreEat } from '@/libraries/zustand/stores/eat';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { EatGet, EatRelations } from '@repo/types/models/eat';
import { EatTime, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useServingActions } from './serving';

export const useEatActions = () => {
  const { session } = useStoreSession();
  const { addEat, updateEat, deleteEat } = useStoreEat();
  const { servingCreate } = useServingActions();

  const eatCreate = (params: Partial<EatRelations>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newEat: EatRelations = {
      id: params.id || id,
      time: params.time || EatTime.BREAKFAST,
      profile_id: session.id || params.profile_id || '',
      servings: [],
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addEat(newEat);
    servingCreate(params.servings || []);
  };

  const eatUpdate = (params: EatRelations) => {
    if (!session) return;

    const now = new Date();

    const newEat: EatRelations = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateEat(newEat);
  };

  const eatDelete = (params: EatGet) => {
    if (!session) return;

    const now = new Date();

    deleteEat({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { eatCreate, eatUpdate, eatDelete };
};
