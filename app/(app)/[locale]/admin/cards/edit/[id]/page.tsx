import CardForm from "@/components/admin/cards/CardForm";
import { notFound } from "next/navigation";

// Uses the real GET /api/admin/cards/[id] route, which returns { data, error }.
async function getCard(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/admin/cards/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  const result = await res.json();
  return result.data || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "Edit Card | Admin Dashboard",
    description: "Edit an existing card in the card database.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/admin/cards/edit/${(await params).id}`,
    },
  };
}

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) notFound();

  return <CardForm mode="edit" initialData={card} />;
}