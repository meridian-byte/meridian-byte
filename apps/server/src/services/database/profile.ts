/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { ProfileCreate } from '@repo/types/models/profile';

export const profileCreate = async (params: ProfileCreate) => {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.findUnique({
        where: { id: params.id },
      });

      if (profile) {
        const updatedProfile = await prisma.profile.update({
          where: { id: params.id },
          data: {
            ...params,
            updated_at: new Date(),
          },
        });

        return { profile: updatedProfile, existed: true };
      }

      const newProfile = await prisma.profile.create({
        data: params,
      });

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
