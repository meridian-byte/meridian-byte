import { Prisma, Meal } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type MealCreate = Prisma.MealCreateInput;

// Type for updating a item (all fields optional except id)
export type MealUpdate = Prisma.MealUpdateInput;

// Type for default item (with id and no relations)
export type MealGet = Meal;

// Type for fetched item with relations
export type MealRelations = Prisma.MealGetPayload<{
  include: {
    // _count: {
    //   select: {
    //     servings: true;
    //   };
    // };

    servings: true;
  };
}>;
