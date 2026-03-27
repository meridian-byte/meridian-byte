import { Prisma, Transaction } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type TransactionCreate = Prisma.TransactionCreateInput;

// Type for updating a item (all fields optional except id)
export type TransactionUpdate = Prisma.TransactionUpdateInput;

// Type for default item (with id and no relations)
export type TransactionGet = Transaction;

// Type for fetched item with relations
export type TransactionRelations = Prisma.TransactionGetPayload<{
  include: {
    category: true;
    account: true;
    recurring_rule: true;
  };
}>;
