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
        hostname: "lever-client-logos.s3-us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lever-client-logos.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "app.ashbyhq.com",
      },
      {
        protocol: "https",
        hostname: "c.smartrecruiters.com",
      },
      {
        protocol: "https",
        hostname: "*.myworkdayjobs.com",
      },
      {
        protocol: "https",
        hostname: "app.jobvite.com",
      },
    ],
  },
};

module.exports = nextConfig;
