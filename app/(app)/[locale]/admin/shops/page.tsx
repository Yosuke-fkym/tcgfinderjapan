import AdminShopsPageComponent from "@/components/admin/shops/AdminShopPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Shop Management | Admin Dashboard",
    description:
      "Manage shop listings, edit details, and maintain the card shop database.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/admin/shops`,
      languages: {
        en: `${baseUrl}/en/admin/shops`,
        jp: `${baseUrl}/jp/admin/shops`,
      },
    },
  };
}

export default function ShopPage() {
  return <AdminShopsPageComponent />;
}