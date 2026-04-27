export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isJP = locale === "jp";

  return {
    title: "Japan Card Shop Map | Find Trading Card Shops Near You",
    description:
      "Explore trading card shops across Japan using an interactive map. Discover Pokémon card stores, filter by area, and find top-rated shops.",

    alternates: {
      canonical: `${baseUrl}/${locale}/map`,
      languages: {
        en: `${baseUrl}/en/map`,
        jp: `${baseUrl}/jp/map`,
      },
    },

    openGraph: {
      title: "Japan Card Shop Map | Find Trading Card Shops Near You",
      description:
        "Explore trading card shops across Japan using an interactive map. Discover Pokémon card stores, filter by area, and find top-rated shops.",
      url: `${baseUrl}/${locale}/map`,
      siteName: "TCG Finder Japan",
      locale: isJP ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
  };
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="mx-auto px-2 ">
          {children}
        </div>
      </main>
    </div>
  );
}