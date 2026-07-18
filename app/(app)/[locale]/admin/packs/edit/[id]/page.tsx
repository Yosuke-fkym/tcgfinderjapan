import PackForm from "@/components/admin/packs/PackForm";
import { notFound } from "next/navigation";

// Uses the real GET /api/admin/packs/[id] route, which returns { data, error }.
async function getPack(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/admin/packs/${id}`, {
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
    title: "Edit Pack | Admin Dashboard",
    description: "Edit an existing card pack in the card database.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/admin/pack/edit/${(await params).id}`,
    },
  };
}

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pack = await getPack(id);

  if (!pack) notFound();

  return <PackForm mode="edit" initialData={pack} />;
}