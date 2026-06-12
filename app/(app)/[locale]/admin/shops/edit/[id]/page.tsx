import ShopForm from "@/components/admin/shops/ShopForm";

async function getShop(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/shops/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch shop");
  }

  return res.json();
}

export default async function EditShopPage( props: any) {
  const { id } = await props.params
  
  const shop = await getShop(id);
  if (shop.error) {
    return null;
  }
  
  return (
    <div className="max-w-3xl px-0 sm:px-4">
      <ShopForm initialData={shop.data} mode="edit" />
    </div>
  );
}
