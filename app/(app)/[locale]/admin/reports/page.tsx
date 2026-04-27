import AdminReportsPageComponent from "@/components/admin/reports/ReportsPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Reports Management | Admin Dashboard",
    description:
      "View and manage reported content, user reports, and moderation actions.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/admin/reports`,

      languages: {
        en: `${baseUrl}/en/admin/reports`,
        jp: `${baseUrl}/jp/admin/reports`,
      },
    },
  };
}

export default function AdminReportsPage() {
  return <AdminReportsPageComponent />;
}