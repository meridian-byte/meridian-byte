import { routeAuthSignIn } from '@repo/handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return routeAuthSignIn(request);
}
