import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Remove the x-powered-by header for production */
  poweredByHeader: false,

  /* Strict React mode for production safety */
  reactStrictMode: true,
};

export default nextConfig;
