import { NextResponse } from 'next/server';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
User-agent: *
Disallow: /

Sitemap: ${(await getBaseUrl()).ATLAS}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
