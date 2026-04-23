import { Prisma, Workspace } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type WorkspaceCreate = Prisma.WorkspaceCreateInput;

// Type for updating a item (all fields optional except id)
export type WorkspaceUpdate = Prisma.WorkspaceUpdateInput;

// Type for default item (with id and no relations)
export type WorkspaceGet = Workspace;

// Type for fetched item with relations
export type WorkspaceRelations = Prisma.WorkspaceGetPayload<{
  include: {
    _count: { select: { notes: true } };
  };
}>;
