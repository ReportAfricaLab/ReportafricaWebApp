const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@reportafrica/shared'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Powered-By', value: '' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://*.firebaseio.com https://*.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; font-src 'self' data:; connect-src 'self' https://api.reportafrica.africa wss://api.reportafrica.africa https://*.firebaseio.com https://*.googleapis.com https://fcm.googleapis.com https://api.mapbox.com https://*.tiles.mapbox.com https://*.s3.eu-west-1.amazonaws.com https://www.gstatic.com https://*.livekit.cloud wss://*.livekit.cloud https://paystack.com https://*.paystack.com https://checkout.paystack.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com; frame-src 'self' https://www.google.com https://checkout.paystack.com https://www.youtube.com; media-src 'self' blob: https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG || 'reportafrica',
  project: process.env.SENTRY_PROJECT || 'reportafrica-web',
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  telemetry: false,
});
