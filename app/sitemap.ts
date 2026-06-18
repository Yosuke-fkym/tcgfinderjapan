// app/sitemap.ts

import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tcgfinderjapan.com";

  const locales = ["en", "ja"];

  // Static pages
  const staticRoutes = [
    "",
    "/map",
    "/ranking",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/about",
  ];

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Published articles
  const { data: articles } = await supabaseAdmin
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published");

  const articleUrls: MetadataRoute.Sitemap =
    articles?.flatMap((article) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/${article.slug}`,
        lastModified: article.updated_at
          ? new Date(article.updated_at)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      }))
    ) ?? [];

  // Categories
  const { data: categories } = await supabaseAdmin
    .from("blog_categories")
    .select("slug");

  const categoryUrls: MetadataRoute.Sitemap =
    categories?.flatMap((category) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }))
    ) ?? [];

  // Tags
  const { data: tags } = await supabaseAdmin
    .from("general_blog_tags")
    .select("slug");

  const tagUrls: MetadataRoute.Sitemap =
    tags?.flatMap((tag) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }))
    ) ?? [];

  return [
    ...staticUrls,
    ...articleUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}