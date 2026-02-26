import { Prisma, ChatMessage } from '@repo/db/generated/prisma/client.js';

// Type for creating an item (without id and relations)
export type ChatMessageCreate = Prisma.ChatMessageCreateInput;

// Type for updating an item (all fields optional except id)
export type ChatMessageUpdate = Prisma.ChatMessageUpdateInput;

// Type for default item (with id and no relations)
export type ChatMessageGet = ChatMessage;

// Type for fetched item with relations
export type ChatMessageRelations = Prisma.ChatMessageGetPayload<{
  include: { chat: true };
}>;
