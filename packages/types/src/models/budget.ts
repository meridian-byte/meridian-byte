import { Prisma, Budget } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type BudgetCreate = Prisma.BudgetCreateInput;

// Type for updating a item (all fields optional except id)
export type BudgetUpdate = Prisma.BudgetUpdateInput;

// Type for default item (with id and no relations)
export type BudgetGet = Budget;

// Type for fetched item with relations
export type BudgetRelations = Prisma.BudgetGetPayload<{
  include: {
    category: true;
  };
}>;
