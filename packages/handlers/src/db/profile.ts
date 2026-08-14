'use server';

import { DEFAULT_NAMES, getRandomColorName, sampleCalendars, sampleEvents } from '@repo/constants';
/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { db } from '@repo/db';
import { ProfileCreate } from '@repo/types';
import { generateUUID } from '@repo/utils';

export const profileCreateDb = async (params: ProfileCreate) => {
  try {
    const transaction = await db.$transaction(async (db) => {
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
            color: getRandomColorName(),
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

      return {
        profile: newProfile,
        existed: false,
      };
    });

    return transaction;
  } catch (error) {
    console.error('---> service error - (create profile):', error);
    throw error;
  }
};
