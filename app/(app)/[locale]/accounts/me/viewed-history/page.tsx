import ViewedHistoryPageComponent from "@/components/account/ViewedHistoryPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Viewed History | TCGFINDERJAPAN",
    description:
      "Manage your favorite card shops and view your browsing history.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/accounts/me/viewed-history`,

      languages: {
        en: `${baseUrl}/en/accounts/me/viewed-history`,
        jp: `${baseUrl}/jp/accounts/me/viewed-history`,
      },
    },
  };
}

export default function ViewedHistoryPage() {
  return <ViewedHistoryPageComponent />;
}