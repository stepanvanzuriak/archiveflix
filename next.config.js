/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://archive.org/download/**")],
  },
};

module.exports = nextConfig;
