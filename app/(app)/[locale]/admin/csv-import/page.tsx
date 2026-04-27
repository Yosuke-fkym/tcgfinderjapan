import CSVImportPageComponent from "@/components/admin/csv-import/CSVImportPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "CSV Import | Admin Dashboard",
    description:
      "Upload and import shop data using CSV files into the system.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/admin/csv-import`,

      languages: {
        en: `${baseUrl}/en/admin/csv-import`,
        jp: `${baseUrl}/jp/admin/csv-import`,
      },
    },
  };
}

export default function CSVImportPage() {
  return <CSVImportPageComponent />;
}