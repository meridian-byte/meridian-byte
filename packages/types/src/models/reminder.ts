import { Prisma, Reminder } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type ReminderCreate = Prisma.ReminderCreateInput;

// Type for updating a item (all fields optional except id)
export type ReminderUpdate = Prisma.ReminderUpdateInput;

// Type for default item (with id and no relations)
export type ReminderGet = Reminder;

// Type for fetched item with relations
export type ReminderRelations = Prisma.ReminderGetPayload<{
  include: {
    task:true
  };
}>;
