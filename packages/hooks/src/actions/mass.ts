import { useStoreMass } from '@repo/libraries/zustand/stores/mass';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { MassGet } from '@repo/types/models/mass';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useMassActions = () => {
  const session = useStoreSession((s) => s.session);
  const addMass = useStoreMass((s) => s.addMass);
  const updateMass = useStoreMass((s) => s.updateMass);
  const deleteMass = useStoreMass((s) => s.deleteMass);

  const massCreate = (params: Partial<MassGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newMass: MassGet = {
      id: params.id || id,
      weight: params.weight || 0,
      fat: params.fat || 0,
      visceral_fat: params.visceral_fat || 0,
      lean_weight: params.lean_weight || 0,
      muscle: params.muscle || 0,
      bone: params.bone || 0,
      water: params.water || 0,
      bmi: params.bmi || 0,
      bmr: params.bmr || 0,
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addMass(newMass);
  };

  const massUpdate = (params: MassGet) => {
    if (!session) return;

    const now = new Date();

    const newMass: MassGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateMass(newMass);
  };

  const massDelete = (params: MassGet) => {
    if (!session) return;

    const now = new Date();

    deleteMass({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { massCreate, massUpdate, massDelete };
};
