import ShopPageComponent from "@/components/shopDetails/ShopPageComponent";
import { fetchShop } from "@/lib/helpers/getShopById";
import { notFound } from "next/navigation";
import { translations } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; shop_id: string }>;
}) {
  const { shop_id: id, locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isJP = locale === "jp";

  const shop = await fetchShop({ id });

  // 🔥 fallback
  if (!shop) {
    notFound();
  }

  const basePath = `${baseUrl}/${locale}/shop/${id}`;
  const shopName =
    shop.shop_name_in_langs?.[locale as keyof typeof translations] ||
    shop.shop_name;

  const description =
    locale === "jp"
      ? `${shopName}の店舗情報、レビュー、評価、場所、取り扱いカードをご確認いただけます。`
      : `Visit ${shopName}. Check reviews, ratings, location, and available trading cards in Japan.`;

  const title =
    locale === "jp"
      ? `${shopName} | 日本のトレーディングカードショップ`
      : `${shopName} | Trading Card Shop in Japan`;
  return {
    title,
    description,

    alternates: {
      canonical: basePath,
      languages: {
        en: `${baseUrl}/en/shop/${id}`,
        ja: `${baseUrl}/jp/shop/${id}`,
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

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string; shop_id: string }>;
}) {
  const { shop_id: id, locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const shop = await fetchShop({ id });

  if (!shop) {
    notFound();
  }

  const localizedName =
    shop.shop_name_in_langs?.[locale as keyof typeof translations] ||
    shop.shop_name;

  const localizedDescription =
    shop.shop_desc_in_langs?.[locale as keyof typeof translations] ||
    shop.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",

    name: localizedName,

    description: localizedDescription,

    url: `${baseUrl}/${locale}/shop/${id}`,

    address: {
      "@type": "PostalAddress",
      streetAddress: shop.shop_address,
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.latitude,
      longitude: shop.longitude,
    },

    ...(shop.images?.length > 0 && {
      image: shop.images,
    }),

    ...(shop.website && {
      sameAs: [shop.website],
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <ShopPageComponent shop={shop} />
    </>
  );
}
