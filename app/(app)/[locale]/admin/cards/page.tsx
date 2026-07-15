import AdminCardsPageComponent from "@/components/admin/cards/AdminCardsPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Card Management | Admin Dashboard",
    description:
      "Manage trading card listings, edit details, and maintain the card database.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/admin/cards`,
      languages: {
        en: `${baseUrl}/en/admin/cards`,
        jp: `${baseUrl}/jp/admin/cards`,
      },
    },
  };
}

export default function CardPage() {
  return <AdminCardsPageComponent />;
}