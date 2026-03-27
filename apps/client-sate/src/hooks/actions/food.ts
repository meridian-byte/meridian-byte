import { useStoreFood } from '@/libraries/zustand/stores/food';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { FoodGet } from '@repo/types/models/food';
import { Status, SyncStatus, WeightUnitType } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useFoodActions = () => {
  const { session } = useStoreSession();
  const { addFood, updateFood, deleteFood } = useStoreFood();

  const foodCreate = (params: Partial<FoodGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newFood: FoodGet = {
      id: params.id || id,
      name: params.name || '',
      description: params.description || '',
      per: params.per || 100,
      per_unit: params.per_unit || WeightUnitType.GRAMS,
      carbs: params.carbs || 0,
      protein: params.protein || 0,
      fat: params.fat || 0,
      kcal: params.kcal || 0,
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addFood(newFood);
  };

  const foodUpdate = (params: FoodGet) => {
    if (!session) return;

    const now = new Date();

    const newFood: FoodGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateFood(newFood);
  };

  const foodDelete = (params: FoodGet) => {
    if (!session) return;

    const now = new Date();

    deleteFood({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { foodCreate, foodUpdate, foodDelete };
};
