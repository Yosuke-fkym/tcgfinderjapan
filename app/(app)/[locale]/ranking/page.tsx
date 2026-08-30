import RankingPageComponent from "@/components/ranking/RankingPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isJP = locale === "jp";

  const title = isJP
    ? "日本のカードショップランキング | 評価・レビュー"
    : "Top Card Shops in Japan | Rankings & Reviews";

  const description = isJP
    ? "ユーザーレビューと評価をもとに、日本のトレーディングカードショップをランキング形式でご紹介します。"
    : "Discover the top-rated trading card shops in Japan based on user reviews and ratings. Find the best places to buy Pokémon cards.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/ranking`,
      languages: {
        en: `${baseUrl}/en/ranking`,
        ja: `${baseUrl}/jp/ranking`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/ranking`,
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

export default async function RankingPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/shops/ranking`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  return <RankingPageComponent initialData={data} />;
}
