import { useStoreMeal } from '@repo/libraries/zustand/stores/meal';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { MealGet, MealRelations } from '@repo/types/models/meal';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useMealActions = () => {
  const session = useStoreSession((s) => s.session);
  const addMeal = useStoreMeal((s) => s.addMeal);
  const updateMeal = useStoreMeal((s) => s.updateMeal);
  const deleteMeal = useStoreMeal((s) => s.deleteMeal);

  const mealCreate = (params: Partial<MealRelations>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newMeal: MealRelations = {
      id: params.id || id,
      name: params.name || '',
      description: params.description || '',
      profile_id: session.id || params.profile_id || '',
      servings: params.servings || [],
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addMeal(newMeal);
  };

  const mealUpdate = (params: MealRelations) => {
    if (!session) return;

    const now = new Date();

    const newMeal: MealRelations = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateMeal(newMeal);
  };

  const mealDelete = (params: MealGet) => {
    if (!session) return;

    const now = new Date();

    deleteMeal({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { mealCreate, mealUpdate, mealDelete };
};
