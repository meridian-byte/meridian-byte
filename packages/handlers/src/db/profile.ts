'use server';

import {
  DEFAULT_NAMES,
  getUniqueColor,
  sampleCalendars,
  sampleEvents,
  sampleTaskLists,
  sampleTasks,
} from '@repo/constants';
/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { Priority, ProfileCreate, TaskListGet } from '@repo/types';
import { generateUUID } from '@repo/utils';

export const profileCreateDb = async (params: ProfileCreate) => {
  try {
    const transaction = await db.$transaction(
      async (db) => {
        const profile = await db.profile.findUnique({
          where: { email: params.email },
        });

        if (profile) {
          const updatedProfile = profile.customized
            ? profile
            : await db.profile.update({
                where: { id: params.id },
                data: {
                  ...params,
                  updatedAt: new Date(),
                },
              });

          return { profile: updatedProfile, existed: true };
        }

        // Create the new Profile
        const newProfile = await db.profile.create({
          data: params,
        });

        // Create the default Workspace tied to the Profile
        const workspace = await db.workspace.create({
          data: {
            id: generateUUID(),
            name: DEFAULT_NAMES.WORKSPACE,
            profileId: newProfile.id,
          },
        });

        // Create Calendars and tie their 3 respective events to them
        for (let i = 0; i < sampleCalendars.length; i++) {
          const calendarTemplate = sampleCalendars[i]!;

          // Grab the 3 events that belong to this specific calendar category
          // (i = 0 gets events 0,1,2; i = 1 gets 3,4,5; etc.)
          const calendarEvents = sampleEvents.slice(i * 3, i * 3 + 3);

          await db.calendar.create({
            data: {
              id: generateUUID(),
              title: calendarTemplate.title,
              description: calendarTemplate.description,
              color: getUniqueColor(),
              profileId: newProfile.id,
              workspaceId: workspace.id,

              // Use Prisma's nested create to automatically link the calendarId
              events: {
                create: calendarEvents.map((event) => ({
                  ...event, // title, description, start, end, allDay, location
                  id: generateUUID(),
                  profileId: newProfile.id,
                  workspaceId: workspace.id,
                })),
              },
            },
          });
        }

        // Create default Task Lists
        for (const taskListTemplate of sampleTaskLists) {
          const tasksForList = sampleTasks.filter(
            (task) => task.taskListKey === taskListTemplate.key,
          );

          await db.taskList.create({
            data: {
              id: generateUUID(),
              title: taskListTemplate.title,
              description: taskListTemplate.description,
              color: getUniqueColor(),
              profileId: newProfile.id,
              workspaceId: workspace.id,

              tasks: {
                create: tasksForList.map((task) => ({
                  id: generateUUID(),
                  title: task.title,
                  description: task.description,
                  dueDate: task.dueDate,
                  complete: task.complete,
                  priority: task.priority as Priority,
                  profileId: newProfile.id,
                  workspaceId: workspace.id,
                })),
              },
            },
          });
        }

        const inboxTasks = sampleTasks.filter((task) => task.taskListKey === null);

        await db.task.createMany({
          data: inboxTasks.map((task) => ({
            id: generateUUID(),
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            complete: task.complete,
            priority: task.priority as Priority,
            profileId: newProfile.id,
            workspaceId: workspace.id,
            taskListId: null,
          })),
        });

        return {
          profile: newProfile,
          existed: false,
        };
      },
      {
        timeout: 15000,
      },
    );

    return transaction;
  } catch (error) {
    console.error('---> service error - (create profile):', error);
    throw error;
  }
};
