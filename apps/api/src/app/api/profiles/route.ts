import { routeProfilesGet, routeProfilesPut } from '@repo/handlers';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return routeProfilesGet();
}

export async function PUT(request: NextRequest) {
  return routeProfilesPut(request);
}
