import { withSentryConfig } from '@sentry/nextjs';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/**
 * @param {string} phase
 * @returns @type {import("next").NextConfig}
 */
const config = (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    // Required for build via Dockerfile
    output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : 'standalone',
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

  return withSentryConfig(nextConfig, {
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
};

export default config;
