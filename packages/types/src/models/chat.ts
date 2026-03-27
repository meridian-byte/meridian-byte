import { Prisma, Chat } from '@repo/db/generated/prisma/client.js';

// Type for creating an item (without id and relations)
export type ChatCreate = Prisma.ChatCreateInput;

// Type for updating an item (all fields optional except id)
export type ChatUpdate = Prisma.ChatUpdateInput;

// Type for default item (with id and no relations)
export type ChatGet = Chat;

// Type for fetched item with relations
export type ChatRelations = Prisma.ChatGetPayload<{
  include: { messages: true };
}>;
