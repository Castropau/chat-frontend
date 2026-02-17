import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// const nextConfig = {};
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains: ['lh3.googleusercontent.com'], // add your external domains here
    domains: [
      "lh3.googleusercontent.com",
      "i.pravatar.cc", 
      "via.placeholder.com",  // ✔ correct
    ],
  },
  
};

export default withNextIntl(nextConfig);
