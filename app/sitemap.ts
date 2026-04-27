import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://map-card.vercel.app";

  return [
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
    },
  ];
}