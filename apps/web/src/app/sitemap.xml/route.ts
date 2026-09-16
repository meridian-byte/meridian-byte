// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { getBaseUrl } from '@repo/constants';

export const dynamic = 'force-static';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const baseUrl = (await getBaseUrl()).WEB;

  const staticRoutes = [
    '', // homepage
    // additional routes go here
  ].map((route) => ({
    loc: `${baseUrl}${route}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // --- MERGE ALL ROUTES ---
  const allRoutes = [...staticRoutes];

  // --- CONVERT TO XML ---
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((r) => {
    return `<url>
  <loc>${escapeXml(r.loc)}</loc>
  <lastmod>${escapeXml(r.lastmod)}</lastmod>
  <changefreq>${escapeXml(r.changefreq)}</changefreq>
  <priority>${escapeXml(String(r.priority))}</priority>
</url>`;
  })
  .join('\n')}
</urlset>`.trim();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
