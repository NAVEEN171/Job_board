import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ["lever-client-logos.s3.us-west-2.amazonaws.com"],
  },
};

export default nextConfig;
