import ShopPageComponent from "@/components/shopDetails/ShopPageComponent";
import { fetchShop } from "@/lib/helpers/getShopById";
import { translations } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string, shop_id: string }>;
}) {
  
  const { shop_id: id, locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isJP = locale === "jp";

  const shop = await fetchShop({ id });

  const basePath = `${baseUrl}/${locale}/shop/${id}`;

  // 🔥 fallback
  if (!shop) {
    return {
      title: "Card Shop Details | Japan",
      description: "View details of trading card shops in Japan.",

      alternates: {
        canonical: basePath,
        languages: {
          en: `${baseUrl}/en/shop/${id}`,
          jp: `${baseUrl}/jp/shop/${id}`,
        },
      },
    };
  }

  const title = `${isJP ? shop.shop_name : shop.shop_name_in_langs?.[locale as keyof typeof translations]} | Trading Card Shop in Japan`;
  const description = `Visit ${shop.shop_name}. Check reviews, ratings, location, and available trading cards in Japan.`;

  return {
    title,
    description,

    alternates: {
      canonical: basePath,
      languages: {
        en: `${baseUrl}/en/shop/${id}`,
        jp: `${baseUrl}/jp/shop/${id}`,
      },
    },

    openGraph: {
      title,
      description,
      url: basePath,
      siteName: "TCG Finder Japan",
      locale: isJP ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function ShopPage() {
  return <ShopPageComponent />;
}