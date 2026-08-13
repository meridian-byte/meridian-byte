import { routeAuthCallbackOauth } from '@repo/handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return routeAuthCallbackOauth(request);
}
