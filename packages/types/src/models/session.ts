import { Prisma, Session } from '@repo/db';

// Type for creating a item (without id and relations)
export type SessionCreate = Prisma.SessionCreateInput;

// Type for updating a item (all fields optional except id)
export type SessionUpdate = Prisma.SessionUpdateInput;

// Type for default item (with id and no relations)
export type SessionGet = Session;

// Type for fetched item with relations
export type SessionRelations = Prisma.SessionGetPayload<{
  include: {
    _count: { select: { accounts: true } };
  };
}>;
