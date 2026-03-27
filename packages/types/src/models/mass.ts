import { Prisma, Mass } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type MassCreate = Prisma.MassCreateInput;

// Type for updating a item (all fields optional except id)
export type MassUpdate = Prisma.MassUpdateInput;

// Type for default item (with id and no relations)
export type MassGet = Mass;

// Type for fetched item with relations
export type MassRelations = Prisma.MassGetPayload<{
  include: {
    profile: true;
  };
}>;
