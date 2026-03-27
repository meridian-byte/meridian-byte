import { Prisma, AccountGroup } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type AccountGroupCreate = Prisma.AccountGroupCreateInput;

// Type for updating a item (all fields optional except id)
export type AccountGroupUpdate = Prisma.AccountGroupUpdateInput;

// Type for default item (with id and no relations)
export type AccountGroupGet = AccountGroup;

// Type for fetched item with relations
export type AccountGroupRelations = Prisma.AccountGroupGetPayload<{
  include: {
    accounts: true;

    _count: {
      select: {
        accounts: true;
      };
    };
  };
}>;
