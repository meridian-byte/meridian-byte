import { Prisma, Notebook } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type NotebookCreate = Prisma.NotebookCreateInput;

// Type for updating a item (all fields optional except id)
export type NotebookUpdate = Prisma.NotebookUpdateInput;

// Type for default item (with id and no relations)
export type NotebookGet = Notebook;

// Type for fetched item with relations
export type NotebookRelations = Prisma.NotebookGetPayload<{
  include: {
    notes: true;
    profile: true;
  };
}>;
