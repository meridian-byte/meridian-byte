/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import prisma from '@/libraries/prisma';
import { ProfileGet } from '@repo/types/models/profile';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const revalidate = 3600;

export async function GET() {
  try {
    const profileRecords = await prisma.profile.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(
      { items: profileRecords },
      { status: 200, statusText: 'Profiles Retrieved' }
    );
  } catch (error) {
    console.error('---> route handler error (get profiles):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      profiles,
      deletedIds,
    }: { profiles: ProfileGet[]; deletedIds?: string[] } = await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await prisma.profile.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = profiles.map((profile) =>
      prisma.profile.upsert({
        where: { id: profile.id },
        update: {
          user_name: profile.user_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          avatar: profile.avatar,
          role: profile.role,
          updated_at: new Date(profile.updated_at),
        },
        create: {
          id: profile.id,
          user_name: profile.user_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          avatar: profile.avatar,
          role: profile.role,
          created_at: new Date(profile.created_at),
          updated_at: new Date(profile.updated_at),
        },
      })
    );

    // Run all operations in one transaction
    const updateProfiles = await prisma.$transaction(operations);

    return NextResponse.json(
      { items: updateProfiles },
      { status: 200, statusText: 'Profiles Updated' }
    );
  } catch (error) {
    console.error('---> route handler error (update profiles):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
