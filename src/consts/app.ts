import { Space_Grotesk as SpaceGrotesk } from 'next/font/google';

export const MAIN_FONT = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-main',
  preload: true,
  fallback: ['sans-serif'],
});
export const APP_NAME = 'Autonomys Bridge';
export const APP_DESCRIPTION = 'Autonomys Bridge powered by Hyperlane';
export const APP_URL = 'https://autonomys-bridge.protofire.io';
export const BRAND_COLOR = '#000000';
export const BACKGROUND_COLOR = '#f0f0f0';
export const BACKGROUND_IMAGE = 'url(/backgrounds/main.svg)';
