import { useStoreTransaction } from '@/libraries/zustand/stores/transaction';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { TransactionGet } from '@repo/types/models/transaction';
import { Status, SyncStatus, TransactionType } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreAccount } from '@/libraries/zustand/stores/account';
import { AccountGet } from '@repo/types/models/account';
import { useAccountActions } from './account';

export const useTransactionActions = () => {
  const { session } = useStoreSession();
  const { accounts } = useStoreAccount();
  const { accountUpdate } = useAccountActions();

  const { addTransaction, updateTransaction, deleteTransaction } =
    useStoreTransaction();

  const transactionCreate = (params: Partial<TransactionGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTransaction: TransactionGet = {
      id: params.id || id,
      type: (params.type || '') as any,
      date: new Date(params.date || '').toISOString() as any,
      amount: Number(params.amount || 0).toFixed(2) as any,
      fees: Number(params.fees || 0).toFixed(2) as any,
      category_id: params.category_id || '',
      account_id: params.account_id || '',
      description: params.description || '',
      recurring_rule_id: params.recurring_rule_id || '',
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: (params.created_at || now).toISOString() as any,
      updated_at: (params.updated_at || now).toISOString() as any,
    };

    const newAccountBalance = getNewAccountBalance({
      accounts: accounts || [],
      newTransaction: newTransaction,
    });

    if (newAccountBalance) {
      accountUpdate({
        ...newAccountBalance.account,
        balance: newAccountBalance.newBalance as any,
      });
    }

    addTransaction(newTransaction);
  };

  const transactionUpdate = (params: {
    newTransaction: TransactionGet;
    previousTransaction: TransactionGet;
  }) => {
    const { newTransaction, previousTransaction } = params;

    if (!session) return;

    const now = new Date();

    const newTransactionObject: TransactionGet = {
      ...newTransaction,
      amount: Number(newTransaction.amount).toFixed(2) as any,
      date: new Date(newTransaction.date || '').toISOString() as any,
      sync_status: SyncStatus.PENDING,
      updated_at: now.toISOString() as any,
    };

    const newAccountBalance = getNewAccountBalance({
      accounts: accounts || [],
      newTransaction: newTransactionObject,
      previousTransaction: previousTransaction,
    });

    if (newAccountBalance) {
      accountUpdate({
        ...newAccountBalance.account,
        balance: newAccountBalance.newBalance as any,
      });
    }

    updateTransaction(newTransactionObject);
  };

  const transactionDelete = (params: TransactionGet) => {
    if (!session) return;

    const now = new Date();

    const newAccountBalance = getNewAccountBalance({
      accounts: accounts || [],
      previousTransaction: params,
    });

    if (newAccountBalance) {
      accountUpdate({
        ...newAccountBalance.account,
        balance: newAccountBalance.newBalance as any,
      });
    }

    deleteTransaction({
      ...params,
      sync_status: SyncStatus.DELETED,
      updated_at: now.toISOString() as any,
    });
  };

  return { transactionCreate, transactionUpdate, transactionDelete };
};

const adjustBalance = (
  balance: number,
  transaction: TransactionGet,
  reverse = false
) => {
  const amount = Number(transaction.amount);
  const fees = Number(transaction.fees);
  const multiplier = reverse ? -1 : 1;

  return transaction.type === TransactionType.CREDIT
    ? balance + amount * multiplier
    : balance - (amount + fees) * multiplier;
};

const getNewAccountBalance = (params: {
  newTransaction?: TransactionGet;
  previousTransaction?: TransactionGet;
  accounts: AccountGet[];
}): {
  account: AccountGet;
  newBalance: string;
} | null => {
  const { newTransaction, previousTransaction, accounts } = params;

  const targetTransaction = newTransaction || previousTransaction;
  if (!targetTransaction) return null;

  const account = accounts?.find((a) => a.id == targetTransaction.account_id);
  if (!account) return null;

  let updatedBalance = Number(account.balance);

  if (previousTransaction) {
    updatedBalance = adjustBalance(updatedBalance, previousTransaction, true);
  }

  if (newTransaction) {
    updatedBalance = adjustBalance(updatedBalance, newTransaction);
  }

  return { account, newBalance: updatedBalance.toFixed(2) };
};
