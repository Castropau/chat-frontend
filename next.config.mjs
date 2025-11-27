import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// const nextConfig = {};
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // add your external domains here
  },
  NEXT_PUBLIC_SOCKET_URL: 'https://growup-9psm.onrender.com',
};

export default withNextIntl(nextConfig);
