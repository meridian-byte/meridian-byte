import { Prisma, Folder } from '@repo/db';

// Type for creating a item (without id and relations)
export type FolderCreate = Prisma.FolderCreateInput;

// Type for updating a item (all fields optional except id)
export type FolderUpdate = Prisma.FolderUpdateInput;

// Type for default item (with id and no relations)
export type FolderGet = Folder;

// Type for fetched item with relations
export type FolderRelations = Prisma.FolderGetPayload<{
  include: {
    workspace: true;
  };
}>;
