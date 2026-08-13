import { routeProfileGet, routeProfilePost, routeProfilePut } from '@repo/handlers';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  return routeProfileGet(request, { params });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  return routeProfilePost(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  return routeProfilePut(request, { params });
}
