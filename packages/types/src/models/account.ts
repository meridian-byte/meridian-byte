import { Prisma, Account } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type AccountCreate = Prisma.AccountCreateInput;

// Type for updating a item (all fields optional except id)
export type AccountUpdate = Prisma.AccountUpdateInput;

// Type for default item (with id and no relations)
export type AccountGet = Account;

// Type for fetched item with relations
export type AccountRelations = Prisma.AccountGetPayload<{
  include: {
    _count: {
      select: {
        transactions: true;
      };
    };
  };
}>;
