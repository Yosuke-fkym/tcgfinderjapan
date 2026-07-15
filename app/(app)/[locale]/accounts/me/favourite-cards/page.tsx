import FavouriteCardsPageComponent from "@/components/account/FavouritesCardPageComponent";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Favourite Card | TCGFINDERJAPAN",
    description:
      "Manage your favorite card.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/accounts/me/favourite-cards`,

      languages: {
        en: `${baseUrl}/en/accounts/me/favourite-cards`,
        jp: `${baseUrl}/jp/accounts/me/favourite-cards`,
      },
    },
  };
}

export default function FavouriteCardsPage() {
  return <FavouriteCardsPageComponent />;
}