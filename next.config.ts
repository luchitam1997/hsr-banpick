import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "webstatic.hoyoverse.com",
      },
      {
        protocol: "https",
        hostname: "fastcdn.hoyoverse.com",
      },
    ],
  },
};

export default nextConfig;
