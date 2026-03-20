import { Prisma, Notification } from '@repo/db/generated/prisma/client.js';

// Type for creating a item (without id and relations)
export type NotificationCreate = Prisma.NotificationCreateInput;

// Type for updating a item (all fields optional except id)
export type NotificationUpdate = Prisma.NotificationUpdateInput;

// Type for default item (with id and no relations)
export type NotificationGet = Notification;
