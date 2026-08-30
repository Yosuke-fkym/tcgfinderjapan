// app/sitemap.ts

import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tcgfinderjapan.com";

  const locales = ["en", "jp"];

  // Static pages
  const staticRoutes = [
    "",
    "/map",
    "/ranking",
    "/blog",
    // "/cards",
    // "/packs",
    "/contact",
    "/privacy-policy",
    "/about",
    "/terms",
  ];

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
    })),
  );

  // dynamic packs
  // const { data: packs, error: packsError } = await supabaseAdmin
  //   .from("packs")
  //   .select("slug");

  // if (packsError) {
  //   throw new Error(`Failed to fetch packs for sitemap: ${packsError.message}`);
  // }

  // const packUrls: MetadataRoute.Sitemap =
  //   packs?.flatMap((pack) =>
  //     locales.map((locale) => ({
  //       url: `${baseUrl}/${locale}/packs/${pack.slug}`,
  //       lastModified: new Date(),
  //       changeFrequency: "monthly",
  //       priority: 0.8,
  //     })),
  //   ) ?? [];

  // dynamic cards
  // const { data: cards, error: cardsError } = await supabaseAdmin
  //   .from("cards")
  //   .select("slug, updated_at");

  // if (cardsError) {
  //   throw new Error(`Failed to fetch cards for sitemap: ${cardsError.message}`);
  // }

  // const cardUrls: MetadataRoute.Sitemap =
  //   cards?.flatMap((card) =>
  //     locales.map((locale) => ({
  //       url: `${baseUrl}/${locale}/cards/${card.slug}`,
  //       lastModified: card.updated_at ? new Date(card.updated_at) : new Date(),
  //       changeFrequency: "monthly",
  //       priority: 0.8,
  //     })),
  //   ) ?? [];



  // Published articles
  const { data: articles, error: articlesError } = await supabaseAdmin
    .from("articles")
    .select("slug, updated_at, is_protected")
    .eq("status", "published");
  if (articlesError) {
    throw new Error(
      `Failed to fetch articles for sitemap: ${articlesError.message}`,
    );
  }

  const articleUrls: MetadataRoute.Sitemap =
    articles?.filter((article)=> !article.is_protected)
    .flatMap((article) =>({
        url: `${baseUrl}/en/blog/${article.slug}`,
        lastModified: article.updated_at
          ? new Date(article.updated_at)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      }),
    ) ?? [];

  // Categories
  const { data: categories, error: categoriesError } = await supabaseAdmin
    .from("blog_categories")
    .select("slug");

  if (categoriesError) {
    throw new Error(
      `Failed to fetch categories for sitemap: ${categoriesError.message}`,
    );
  }

  const categoryUrls: MetadataRoute.Sitemap =
    categories?.flatMap((category) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    ) ?? [];

  // Tags
  const { data: tags, error: tagsError } = await supabaseAdmin
    .from("general_blog_tags")
    .select("slug");

  if (tagsError) {
    throw new Error(`Failed to fetch tags for sitemap: ${tagsError.message}`);
  }

  const tagUrls: MetadataRoute.Sitemap =
    tags?.flatMap((tag) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/blog/tag/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      })),
    ) ?? [];

  // active shops
  const { data: shops, error: shopsError } = await supabaseAdmin
    .from("shops")
    .select("shop_id");
  if (shopsError) {
    throw new Error(`Failed to fetch shops for sitemap: ${shopsError.message}`);
  }

  const shopsUrls: MetadataRoute.Sitemap =
    shops?.flatMap((shop) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/shop/${shop.shop_id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      })),
    ) ?? [];

  return [
    ...staticUrls,
    ...articleUrls,
    ...categoryUrls,
    ...tagUrls,
    // ...cardUrls,
    // ...packUrls,
    ...shopsUrls,
  ];
}
