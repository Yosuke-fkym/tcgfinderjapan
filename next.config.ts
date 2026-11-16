// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       { protocol: "https", hostname: "sivpzxvptzmyvuwtpucc.supabase.co" },
//       // { protocol: "https", hostname: "avatars.githubusercontent.com" },
//       // { protocol: "https", hostname: "media.valorant-api.com" },
//       // { protocol: "https", hostname: "pbs.twimg.com"}
//     ],
//   },
// };

// export default nextConfig;




// ------------------------------------------------------


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sivpzxvptzmyvuwtpucc.supabase.co",
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path((?!api(?:/|$)|_next(?:/|$)|en(?:/|$)|jp(?:/|$)|robots\\.txt$|sitemap\\.xml$|blog$).+)",
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default nextConfig;
