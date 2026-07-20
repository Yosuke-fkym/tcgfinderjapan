import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "sivpzxvptzmyvuwtpucc.supabase.co" },
      // { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // { protocol: "https", hostname: "media.valorant-api.com" },
      // { protocol: "https", hostname: "pbs.twimg.com"}
    ],
  },
};

export default nextConfig;
