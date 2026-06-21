import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/[.\\/]+$/, '');

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return new NextResponse('Missing id', { status: 400 });

  try {
    const res = await fetch(`${API_URL}/reports/${id}`);
    const report = await res.json();
    if (!report || !report.title) return new NextResponse('Not found', { status: 404 });

    const ogImage = report.media?.[0]?.url || 'https://reportafrica.africa/logo.png';
    const description = report.description?.substring(0, 200) || '';
    const location = report.city || report.state || report.country || '';

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${report.title} | ReportAfrica</title>
  <meta property="og:title" content="${report.title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="https://reportafrica.africa/report?id=${id}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="ReportAfrica" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${report.title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="description" content="${description}" />
  <meta name="geo.position" content="${report.latitude};${report.longitude}" />
  <meta name="geo.placename" content="${location}" />
  <meta http-equiv="refresh" content="0;url=https://reportafrica.africa/report?id=${id}" />
</head>
<body>Redirecting...</body>
</html>`;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
  } catch {
    return new NextResponse('Error', { status: 500 });
  }
}
