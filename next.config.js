/** @type {import('next').NextConfig} */

const { version } = require('./package.json');
// const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false, // process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV !== 'production';

// Sometimes useful to disable this during development
const ENABLE_CSP_HEADER = true;
const FRAME_SRC_HOSTS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'https://cdn.solflare.com',
];
const STYLE_SRC_HOSTS = ['https://fonts.googleapis.com'];
const FONT_SRC_HOSTS = ['https://fonts.gstatic.com'];
const IMG_SRC_HOSTS = [
  'https://*.walletconnect.com',
  'https://*.githubusercontent.com',
  'https://cdn.jsdelivr.net/gh/hyperlane-xyz/hyperlane-registry@main/',
];
const SCRIPT_SRC_HOSTS = ['https://snaps.consensys.io'];
// Connect sources needed for RPC, WalletConnect, APIs
const CONNECT_SRC_HOSTS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.com',
  'wss://*.walletconnect.org',
  'https://api.github.com',
  'https://raw.githubusercontent.com',
  'https://*.infura.io',
  'https://*.alchemy.com',
  'https://*.hyperlane.xyz',
  'https://proxy.hyperlane.xyz',
  'https://*.reown.com', // WalletConnect rebranded
  'wss://*.reown.com',
];
// Note: 'unsafe-inline' and 'wasm-unsafe-eval' are required for MetaMask/wallet extensions
// especially in Firefox. See: https://github.com/MetaMask/metamask-extension/issues/3133
// SECURITY: 'unsafe-inline' for script-src is a trade-off for wallet compatibility.
// Mitigations: strict input validation, no URL parameter reflection, regular audits.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${SCRIPT_SRC_HOSTS.join(' ')};
  style-src 'self' 'unsafe-inline' ${STYLE_SRC_HOSTS.join(' ')};
  connect-src 'self' ${CONNECT_SRC_HOSTS.join(' ')} https: wss:;
  img-src 'self' blob: data: ${IMG_SRC_HOSTS.join(' ')};
  font-src 'self' data: ${FONT_SRC_HOSTS.join(' ')};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-src 'self' ${FRAME_SRC_HOSTS.join(' ')};
  frame-ancestors 'none';
  ${!isDev ? 'block-all-mixed-content;' : ''}
  ${!isDev ? 'upgrade-insecure-requests;' : ''}
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Note, causes a problem for firefox: https://github.com/MetaMask/metamask-extension/issues/3133
  ...(ENABLE_CSP_HEADER
    ? [
        {
          key: 'Content-Security-Policy',
          value: cspHeader,
        },
      ]
    : []),
];

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'yaml-loader',
    });
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_VERSION: version,
  },

  output: 'standalone',

  reactStrictMode: true,
};

// const sentryOptions = {
//   org: 'hyperlane',
//   project: 'warp-ui',
//   authToken: process.env.SENTRY_AUTH_TOKEN,
//   hideSourceMaps: true,
//   tunnelRoute: '/monitoring-tunnel',
//   bundleSizeOptimizations: {
//     excludeDebugStatements: true,
//     excludeReplayIframe: true,
//     excludeReplayShadowDom: true,
//   },
// };

// module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, sentryOptions));
module.exports = withBundleAnalyzer(nextConfig);
