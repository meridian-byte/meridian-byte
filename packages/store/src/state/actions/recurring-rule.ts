import { useStoreRecurringRule } from '../recurring-rule';
import { useStoreSession } from '../session';
import { Frequency, RecurringRuleGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID, getNextMonth } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useViewModal } from '../../handler/view';

export const useRecurringRuleActions = () => {
  const session = useStoreSession((s) => s.session);
  const recurringRules = useStoreRecurringRule((s) => s.recurringRules);
  const addRecurringRule = useStoreRecurringRule((s) => s.addRecurringRule);
  const updateRecurringRule = useStoreRecurringRule((s) => s.updateRecurringRule);
  const deleteRecurringRule = useStoreRecurringRule((s) => s.deleteRecurringRule);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const { modalViewValue, closeModalView } = useViewModal();

  const recurringRuleCreate = (params?: Partial<RecurringRuleGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newRecurringRule: RecurringRuleGet = {
      id: params?.id || id,
      endDate: !params?.endDate ? null : (new Date(params.endDate).toISOString() as any),
      frequency: params?.frequency || Frequency.WEEKLY,
      interval: params?.interval || 1,
      weekdays: params?.weekdays || [],
      months: params?.months || [],
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addRecurringRule(newRecurringRule);

    return newRecurringRule;
  };

  const recurringRuleUpdate = (params: RecurringRuleGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newRecurringRule: RecurringRuleGet = {
      ...params,
      endDate: !params?.endDate ? null : (new Date(params.endDate).toISOString() as any),
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateRecurringRule(newRecurringRule);
  };

  const recurringRuleDelete = (params: RecurringRuleGet) => {
    if (!session) return;
    if (!recurringRules) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteRecurringRule({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });

    if (!!modalViewValue) closeModalView();
  };

  return {
    recurringRuleCreate,
    recurringRuleUpdate,
    recurringRuleDelete,
  };
};
