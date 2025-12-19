import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { ServingGet } from '@repo/types/models/serving';
import { Status, SyncStatus, WeightUnitType } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useServingActions = () => {
  const { session } = useStoreSession();
  const { addServing, updateServing, deleteServing } = useStoreServing();

  const servingCreate = (params: Partial<ServingGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newServing: ServingGet = {
      id: params.id || id,
      serving_size: params.serving_size || 0,
      serving_unit: params.serving_unit || WeightUnitType.GRAMS,
      profile_id: session.id || params.profile_id || '',
      food_id: params.food_id || '',
      meal_id: params.meal_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: now.toISOString() as any,
      updated_at: now.toISOString() as any,
    };

    addServing(newServing);
  };

  const servingUpdate = (params: ServingGet) => {
    if (!session) return;

    const now = new Date();

    const newServing: ServingGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    updateServing(newServing);
  };

  const servingDelete = (params: ServingGet) => {
    if (!session) return;

    const now = new Date();

    deleteServing({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { servingCreate, servingUpdate, servingDelete };
};
