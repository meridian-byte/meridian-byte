import { Prisma, Eat } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type EatCreate = Prisma.EatCreateInput;

// Type for updating a item (all fields optional except id)
export type EatUpdate = Prisma.EatUpdateInput;

// Type for default item (with id and no relations)
export type EatGet = Eat;

// Type for fetched item with relations
export type EatRelations = Prisma.EatGetPayload<{
  include: {
    // _count: {
    //   select: {
    //     servings: true;
    //   };
    // };

    servings: true;
  };
}>;
