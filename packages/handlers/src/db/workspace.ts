'use server';

import { DEFAULT_NAMES } from '@repo/constants';
import { db } from '@repo/db';
import { SyncStatus, WorkspaceGet } from '@repo/types';

export const dbWorkspaceUpsert = async (workspaces: WorkspaceGet[], accountId: string) => {
  try {
    const transaction = await db.$transaction(
      async (db) => {
        const newWorkspaces: WorkspaceGet[] = [];
        const now = new Date();

        for (const wspace of workspaces) {
          const { id, ...wspaceData } = wspace;
          const isDefaultWorkspace = wspace.name === DEFAULT_NAMES.WORKSPACE;

          // 1. Check if this specific workspace exists by ID
          let existingWorkspace = id
            ? await db.workspace.findFirst({
                where: { id, accountId },
              })
            : null;

          // 2. If not found by ID, but it's a DEFAULT workspace, check if a default workspace already exists for this accountId
          if (!existingWorkspace && isDefaultWorkspace) {
            existingWorkspace = await db.workspace.findFirst({
              where: {
                accountId,
                name: DEFAULT_NAMES.WORKSPACE,
              },
            });
          }

          if (existingWorkspace) {
            // 3. Existing workspace found (by ID or default name match) -> UPDATE
            const updated = await db.workspace.update({
              where: { id: existingWorkspace.id },
              data: {
                ...wspaceData,
                accountId,
                syncStatus: SyncStatus.SYNCED,
                updatedAt: now,
                // Omit createdAt to preserve original creation date
              },
            });
            newWorkspaces.push(updated);
          } else {
            // 4. Truly new non-default workspace (or first default workspace) -> CREATE
            const created = await db.workspace.create({
              data: {
                ...wspaceData,
                ...(id ? { id } : {}), // Preserves client-generated UUID if provided
                accountId,
                syncStatus: SyncStatus.SYNCED,
                createdAt: wspace.createdAt ? new Date(wspace.createdAt) : now,
                updatedAt: now,
              },
            });
            newWorkspaces.push(created);
          }
        }

        return { workspaces: newWorkspaces };
      },
      {
        timeout: 15000,
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create workspace):', error);
    throw error;
  }
};
// // Create Calendars and tie their 3 respective events to them
// for (let i = 0; i < sampleCalendars.length; i++) {
//   const calendarTemplate = sampleCalendars[i]!;

//   // Grab the 3 events that belong to this specific calendar category
//   // (i = 0 gets events 0,1,2; i = 1 gets 3,4,5; etc.)
//   const calendarEvents = sampleEvents.slice(i * 3, i * 3 + 3);

//   await db.calendar.create({
//     data: {
//       id: generateUUID(),
//       title: calendarTemplate.title,
//       description: calendarTemplate.description,
//       color: getUniqueColor(),
//       workspaceId: workspace.id,

//       // Use Prisma's nested create to automatically link the calendarId
//       events: {
//         create: calendarEvents.map((event) => ({
//           ...event, // title, description, start, end, allDay, location
//           id: generateUUID(),
//           workspaceId: workspace.id,
//         })),
//       },
//     },
//   });
// }

// // Create default Task Lists
// for (const taskListTemplate of sampleTaskLists) {
//   const tasksForList = sampleTasks.filter((task) => task.taskListKey === taskListTemplate.key);

//   await db.taskList.create({
//     data: {
//       id: generateUUID(),
//       title: taskListTemplate.title,
//       description: taskListTemplate.description,
//       color: getUniqueColor(),
//       workspaceId: workspace.id,

//       tasks: {
//         create: tasksForList.map((task) => ({
//           id: generateUUID(),
//           title: task.title,
//           description: task.description,
//           dueDate: task.dueDate,
//           complete: task.complete,
//           priority: task.priority as Priority,
//           workspaceId: workspace.id,
//         })),
//       },
//     },
//   });
// }

// const inboxTasks = sampleTasks.filter((task) => task.taskListKey === null);

// await db.task.createMany({
//   data: inboxTasks.map((task) => ({
//     id: generateUUID(),
//     title: task.title,
//     description: task.description,
//     dueDate: task.dueDate,
//     complete: task.complete,
//     priority: task.priority as Priority,
//     workspaceId: workspace.id,
//     taskListId: null,
//   })),
// });

// // Seed default Notes
// await db.note.createMany({
//   data: sampleNotes.map((note) => ({
//     id: generateUUID(),
//     title: note.title,
//     content: note.content,
//     workspaceId: workspace.id,
//     syncStatus: 'SYNCED',
//   })),
// });
