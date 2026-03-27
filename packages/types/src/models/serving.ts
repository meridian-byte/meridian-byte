import { Prisma, Serving } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type ServingCreate = Prisma.ServingCreateInput;

// Type for updating a item (all fields optional except id)
export type ServingUpdate = Prisma.ServingUpdateInput;

// Type for default item (with id and no relations)
export type ServingGet = Serving;

// Type for fetched item with relations
export type ServingRelations = Prisma.ServingGetPayload<{
  include: {
    food: true;
  };
}>;
