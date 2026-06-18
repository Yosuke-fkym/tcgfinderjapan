import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/admin", "/auth"],
      },
    ],
    sitemap: "https://www.tcgfinderjapan.com/sitemap.xml",
  };
}