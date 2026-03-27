import { Prisma, View } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type ViewCreate = Prisma.ViewCreateInput;

// Type for updating a item (all fields optional except id)
export type ViewUpdate = Prisma.ViewUpdateInput;

// Type for default item (with id and no relations)
export type ViewGet = View;
