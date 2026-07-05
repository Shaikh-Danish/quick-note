import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  experimental: {
    proxyClientMaxBodySize: "50mb",
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
