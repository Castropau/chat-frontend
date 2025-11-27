import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  env: {
    baseUrl: 'http://192.168.0.122:8000',
    NEXT_PUBLIC_SOCKET_URL: 'https://growup-9psm.onrender.com',
  }
};

export default nextConfig;
