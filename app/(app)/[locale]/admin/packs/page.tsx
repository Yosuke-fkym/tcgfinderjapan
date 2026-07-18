import AdminPacksPageComponent from "@/components/admin/packs/AdminPacksPageComponent";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Pack Management | Admin Dashboard",
    description:
      "Manage trading card pack listings, edit details, and maintain the card-pack database.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/admin/packs`,
      languages: {
        en: `${baseUrl}/en/admin/packs`,
        jp: `${baseUrl}/jp/admin/packs`,
      },
    },
  };
}

export default function PackPage() {
  return <AdminPacksPageComponent />;
}