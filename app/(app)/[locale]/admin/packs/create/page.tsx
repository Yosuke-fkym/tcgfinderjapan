import PackForm from "@/components/admin/packs/PackForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Create Card Pack | Admin Dashboard",
    description: "Add a new cardpack to the card database.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/admin/packs/create`,
    },
  };
}

export default function CreateCardPage() {
  return <PackForm mode="create" />;
}