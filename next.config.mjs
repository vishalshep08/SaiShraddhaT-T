/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // Disable Webpack disk caching to prevent OneDrive file lock conflicts (ENOENT / PackFileCacheStrategy)
    config.cache = false;
    return config;
  },
};

export default nextConfig;
