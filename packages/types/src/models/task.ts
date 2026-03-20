import { Prisma, Task } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type TaskCreate = Prisma.TaskCreateInput;

// Type for updating a item (all fields optional except id)
export type TaskUpdate = Prisma.TaskUpdateInput;

// Type for default item (with id and no relations)
export type TaskGet = Task;

// Type for fetched item with relations
export type TaskRelations = Prisma.TaskGetPayload<{
  include: {
    _count: { select: { reminders: true } };

    category: true;
    reminders: true;
  };
}>;
