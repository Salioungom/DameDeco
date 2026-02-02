import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Ajouter un timeout plus court pour éviter les longs chargements
    minimumCacheTTL: 60,
  },
  // Configuration pour éviter les timeouts
  serverExternalPackages: [],
};

export default nextConfig;
