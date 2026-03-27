import { useStoreServing } from '@/libraries/zustand/stores/serving';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { ServingGet } from '@repo/types/models/serving';
import { Status, SyncStatus, WeightUnitType } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { FormEat } from '../form/eat';

export const useServingActions = (params?: { formEat?: FormEat }) => {
  const { session } = useStoreSession();
  const { servings, setServings, updateServing, deleteServing } =
    useStoreServing();

  const servingCreate = (paramsCreate: Partial<ServingGet> | ServingGet[]) => {
    if (!session) return;

    // if not array, convert to array
    const paramsCreateArray = Array.isArray(paramsCreate)
      ? paramsCreate
      : [paramsCreate];

    const newServings: ServingGet[] = [];

    const now = new Date();

    paramsCreateArray.forEach((item) => {
      const id = generateUUID();

      const newServing: ServingGet = {
        id: item.id || id,
        serving_size: item.serving_size || 0,
        serving_unit: item.serving_unit || WeightUnitType.GRAMS,
        profile_id: session.id || item.profile_id || '',
        food_id: item.food_id || '',
        meal_id: item.meal_id || '',
        eat_id: item.eat_id || '',
        status: item.status || Status.ACTIVE,
        sync_status: SyncStatus.PENDING,
        created_at: new Date(item.created_at || now).toISOString() as any,
        updated_at: new Date(item.updated_at || now).toISOString() as any,
      };

      newServings.push(newServing);
    });

    if (params?.formEat) {
      params.formEat.setFieldValue('servings', [
        ...(params.formEat.values.servings || []),
        ...newServings,
      ]);
    } else {
      setServings([...(servings || []), ...newServings]);
    }
  };

  const servingUpdate = (params: ServingGet) => {
    if (!session) return;

    const now = new Date();

    const newServing: ServingGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateServing(newServing);
  };

  const servingDelete = (params: ServingGet) => {
    if (!session) return;

    const now = new Date();

    deleteServing({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { servingCreate, servingUpdate, servingDelete };
};
