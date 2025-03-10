/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdn.greenhouse.io",
      },
      {
        protocol: "https",
        hostname: "lever-client-logos.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lever-client-logos.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
