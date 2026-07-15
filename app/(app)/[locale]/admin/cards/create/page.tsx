import CardForm from "@/components/admin/cards/CardForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Create Card | Admin Dashboard",
    description: "Add a new card to the card database.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/admin/cards/create`,
    },
  };
}

export default function CreateCardPage() {
  return <CardForm mode="create" />;
}