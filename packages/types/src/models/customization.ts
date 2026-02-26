import { Prisma, Customization } from '@repo/db/generated/prisma/client.js';

// Type for creating an item (without id and relations)
export type CustomizationCreate = Prisma.CustomizationCreateInput;

// Type for updating an item (all fields optional except id)
export type CustomizationUpdate = Prisma.CustomizationUpdateInput;

// Type for default item (with id and no relations)
export type CustomizationGet = Customization;

// Type for fetched item with relations
export type CustomizationRelations = Prisma.CustomizationGetPayload<{
  include: { profile: true };
}>;
