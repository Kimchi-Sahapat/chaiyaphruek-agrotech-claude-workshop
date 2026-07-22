import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow testing the dev server from a phone on the same Wi-Fi (LAN IP).
  // Without this, Next 16 blocks client JS from non-localhost origins,
  // which makes the page render but every click/tap do nothing.
  allowedDevOrigins: ["192.168.1.126"],
};

export default nextConfig;
