import { Prisma, Food } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type FoodCreate = Prisma.FoodCreateInput;

// Type for updating a item (all fields optional except id)
export type FoodUpdate = Prisma.FoodUpdateInput;

// Type for default item (with id and no relations)
export type FoodGet = Food;

// Type for fetched item with relations
export type FoodRelations = Prisma.FoodGetPayload<{
  include: {
    profile: true;
  };
}>;
