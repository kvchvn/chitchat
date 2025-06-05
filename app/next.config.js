import { withSentryConfig } from '@sentry/nextjs';
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  images: {
    remotePatterns: [
      {
        // github
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        // google
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // yandex
        protocol: 'https',
        hostname: 'avatars.yandex.net',
      },
      {
        // facebook
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
      },
      {
        // uploadthing
        protocol: 'https',
        hostname: 'cgaeud8ce2.ufs.sh',
      },
    ],
  },
};

export default withSentryConfig(config, {
  org: 'anton-kachan',
  project: 'chitchat-v2',
  disableLogger: true,
  telemetry: false,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
