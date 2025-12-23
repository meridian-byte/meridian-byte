import { Prisma, Link } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type LinkCreate = Prisma.LinkCreateInput;

// Type for updating a item (all fields optional except id)
export type LinkUpdate = Prisma.LinkUpdateInput;

// Type for default item (with id and no relations)
export type LinkGet = Link;
