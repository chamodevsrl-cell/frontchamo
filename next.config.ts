import type { NextConfig } from "next";

const extraDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  /** Permite probar el dev server por IP LAN (ej. ALLOWED_DEV_ORIGINS=192.168.1.20). */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...extraDevOrigins,
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
