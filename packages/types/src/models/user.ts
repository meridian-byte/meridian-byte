import { Prisma, User } from '@repo/db';

// Type for creating a item (without id and relations)
export type UserCreate = Prisma.UserCreateInput;

// Type for updating a item (all fields optional except id)
export type UserUpdate = Prisma.UserUpdateInput;

// Type for default item (with id and no relations)
export type UserGet = User;

// Type for fetched item with relations
export type UserRelations = Prisma.UserGetPayload<{
  include: {
    _count: { select: { accounts: true } };
  };
}>;
