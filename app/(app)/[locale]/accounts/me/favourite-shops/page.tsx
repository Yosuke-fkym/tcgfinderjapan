import FavouriteShopsPageComponent from "@/components/account/FavouriteShopsPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Favourite Card Shops | TCGFINDERJAPAN",
    description:
      "Manage your favorite card shops and view your browsing history.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/accounts/me/favourite-shops`,

      languages: {
        en: `${baseUrl}/en/accounts/me/favourite-shops`,
        jp: `${baseUrl}/jp/accounts/me/favourite-shops`,
      },
    },
  };
}

export default function FavouriteShopsPage() {
  return <FavouriteShopsPageComponent />;
}