import { Prisma, Category } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type CategoryCreate = Prisma.CategoryCreateInput;

// Type for updating a item (all fields optional except id)
export type CategoryUpdate = Prisma.CategoryUpdateInput;

// Type for default item (with id and no relations)
export type CategoryGet = Category;

// Type for fetched item with relations
export type CategoryRelations = Prisma.CategoryGetPayload<{
  include: {
    _count: { select: { posts: true } };

    posts: {
      include: {
        _count: { select: { comments: true } };

        category: true;
        profile: true;
      };
    };
  };
}>;
