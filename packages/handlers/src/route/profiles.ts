'use server';

import { db } from '@repo/db';
import { ProfileGet } from '@repo/types';
import { NextRequest, NextResponse } from 'next/server';

export async function routeProfilesGet() {
  try {
    const profileRecords = await db.profile.findMany();

    return NextResponse.json(
      { items: profileRecords },
      { status: 200, statusText: 'Profiles Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get profiles):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function routeProfilesPut(request: NextRequest) {
  try {
    const { profiles, deletedIds }: { profiles: ProfileGet[]; deletedIds?: string[] } =
      await request.json();

    // First handle explicit deletions if any exist
    if (deletedIds?.length) {
      await db.profile.deleteMany({
        where: { id: { in: deletedIds } },
      });
    }

    // Prepare upsert operations
    const operations = profiles.map((profile) =>
      db.profile.upsert({
        where: { id: profile.id },
        update: {
          ...profile,
          updatedAt: new Date(profile.updatedAt),
        },
        create: {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt),
        },
      }),
    );

    // Run all operations in one transaction
    const updateProfiles = await db.$transaction(operations);

    return NextResponse.json(
      { items: updateProfiles },
      { status: 200, statusText: 'Profiles Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update profiles):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function routeProfileGet(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  try {
    const { profileId } = await params;

    const profileRecord = await db.profile.findUnique({
      where: { id: profileId },
    });

    return NextResponse.json(
      { item: profileRecord },
      { status: 200, statusText: 'Profile Retrieved' },
    );
  } catch (error) {
    console.error('---> route handler error (get profile):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function routeProfilePost(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  try {
    const profile: ProfileGet = await request.json();

    const profileRecord = await db.profile.create({
      data: profile,
    });

    return NextResponse.json(
      { items: profileRecord },
      { status: 200, statusText: 'Profile Created' },
    );
  } catch (error) {
    console.error('---> route handler error (create profile):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function routeProfilePut(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  try {
    const { profileId } = await params;

    const profile: ProfileGet = await request.json();

    const updateProfile = await db.profile.update({
      where: { id: profileId },
      data: profile,
    });

    return NextResponse.json(
      { items: updateProfile },
      { status: 200, statusText: 'Profile Updated' },
    );
  } catch (error) {
    console.error('---> route handler error (update profile):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
