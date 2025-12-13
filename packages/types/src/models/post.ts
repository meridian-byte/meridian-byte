import { Prisma, Post } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type PostCreate = Prisma.PostCreateInput;

// Type for updating a item (all fields optional except id)
export type PostUpdate = Prisma.PostUpdateInput;

// Type for default item (with id and no relations)
export type PostGet = Post;

// Type for fetched item with relations
export type PostRelations = Prisma.PostGetPayload<{
  include: {
    _count: { select: { comments: true } };

    category: true;
    profile: true;
  };
}>;
