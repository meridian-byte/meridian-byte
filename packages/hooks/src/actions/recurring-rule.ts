import { useStoreRecurringRule } from '@repo/libraries/zustand/stores/recurring-rule';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { RecurringRuleGet } from '@repo/types/models/recurring-rule';
import { Frequency, Status, SyncStatus } from '@repo/types/models/enums';
import { Weekdays } from '@repo/types/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useRecurringRuleActions = () => {
  const session = useStoreSession((s) => s.session);
  const addRecurringRule = useStoreRecurringRule((s) => s.addRecurringRule);
  const updateRecurringRule = useStoreRecurringRule(
    (s) => s.updateRecurringRule
  );
  const deleteRecurringRule = useStoreRecurringRule(
    (s) => s.deleteRecurringRule
  );

  const recurringRuleCreate = (params: Partial<RecurringRuleGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newRecurringRule: RecurringRuleGet = {
      id: params.id || id,
      end: params.end || null,
      end_date: params.end_date || null,
      frequency: (params.frequency || '') as Frequency,
      interval: params.interval || 1,
      months: params.months || [],
      weekdays: params.weekdays || [],
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addRecurringRule(newRecurringRule);
  };

  const recurringRuleUpdate = (params: RecurringRuleGet) => {
    if (!session) return;

    const now = new Date();

    const newRecurringRule: RecurringRuleGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateRecurringRule(newRecurringRule);
  };

  const recurringRuleDelete = (params: RecurringRuleGet) => {
    if (!session) return;

    const now = new Date();

    deleteRecurringRule({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { recurringRuleCreate, recurringRuleUpdate, recurringRuleDelete };
};
