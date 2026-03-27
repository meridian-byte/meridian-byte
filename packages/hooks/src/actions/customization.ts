import { useStoreCustomization } from '@repo/libraries/zustand/stores/customization';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { CustomizationGet } from '@repo/types/models/customization';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useCustomizationActions = () => {
  const session = useStoreSession((s) => s.session);
  const addCustomization = useStoreCustomization((s) => s.addCustomization);
  const updateCustomization = useStoreCustomization(
    (s) => s.updateCustomization
  );
  const deleteCustomization = useStoreCustomization(
    (s) => s.deleteCustomization
  );

  const customizationCreate = (params: Partial<CustomizationGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newCustomization: CustomizationGet = {
      id: params.id || id,
      active: params.active || true,
      nickname: params.nickname || '',
      occupation: params.occupation || '',
      partialities: params.partialities || '',
      traits: params.traits || '',
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addCustomization(newCustomization);
  };

  const customizationUpdate = (params: CustomizationGet) => {
    if (!session) return;

    const now = new Date();

    const newCustomization: CustomizationGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateCustomization(newCustomization);
  };

  const customizationDelete = (params: CustomizationGet) => {
    if (!session) return;

    const now = new Date();

    deleteCustomization({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { customizationCreate, customizationUpdate, customizationDelete };
};
