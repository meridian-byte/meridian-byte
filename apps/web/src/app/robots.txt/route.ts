import { NextResponse } from 'next/server';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-static';

export async function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?ref=*
Disallow: /*?utm_*

Sitemap: ${(await getBaseUrl()).WEB}/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
