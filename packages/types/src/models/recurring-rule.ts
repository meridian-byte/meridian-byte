import { Prisma, RecurringRule } from '@repo/db';

// Type for creating a item (without id and relations)
export type RecurringRuleCreate = Prisma.RecurringRuleCreateInput;

// Type for updating a item (all fields optional except id)
export type RecurringRuleUpdate = Prisma.RecurringRuleUpdateInput;

// Type for default item (with id and no relations)
export type RecurringRuleGet = RecurringRule;

// Type for fetched item with relations
export type RecurringRuleRelations = Prisma.RecurringRuleGetPayload<{
  include: {
    workspace: true;
  };
}>;
