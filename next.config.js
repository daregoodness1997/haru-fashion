const nextConfig = {
  i18n: {
    locales: ["en", "fr", "es"],
    defaultLocale: "en",
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
