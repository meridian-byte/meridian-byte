import { Prisma, TaskList } from '@repo/db';

// Type for creating a item (without id and relations)
export type TaskListCreate = Prisma.TaskListCreateInput;

// Type for updating a item (all fields optional except id)
export type TaskListUpdate = Prisma.TaskListUpdateInput;

// Type for default item (with id and no relations)
export type TaskListGet = TaskList;

// Type for fetched item with relations
export type TaskListRelations = Prisma.TaskListGetPayload<{
  include: {
    workspace: true;
  };
}>;
