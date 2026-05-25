"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  MoreHorizontalIcon,
  ArrowUpRightFromSquareIcon,
  Pencil,
  Trash2,
  Store,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
import { truncateText } from "@/lib/utils";

export default function ShopsTable({ shops, refresh }: any) {
  const [open, setOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const openDeleteDialog = (shop: any) => {
    setSelectedShop(shop);
    setOpen(true);
  };

  const deleteShop = async () => {
    if (!selectedShop) return;

    const res = await fetch(`/api/admin/shops`, {
      method: "DELETE",
      body: JSON.stringify({ shop_id: selectedShop.shop_id }),
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });
    const response = await res.json();
    if (!response.success) {
      toast(t.admin.shopsPage.error, { position: "top-right" });
      return;
    }
    toast(t.admin.shopForm.successDelete || "Deleted", { position: "top-right" });

    setOpen(false);
    refresh();
  };

  if (!shops?.length) {
    return (
      <div className="bg-white border flex flex-col justify-center items-center rounded-xl p-10 text-center text-gray-500">
        <Store className="mx-auto mb-3 opacity-60" size={28} />
        {t.shopDetails.list.empty}
      </div>
    );
  }

  return (
   <>
  <div className="bg-white border rounded-xl p-1.5 shadow-sm">

    <div className="hidden md:block overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-sm lg:text-base font-semibold py-4">
              {t.admin.recentShops.table.shop}
            </TableHead>
            <TableHead className="text-sm lg:text-base font-semibold py-4">
              {t.admin.recentShops.table.address}
            </TableHead>
            <TableHead className="text-sm lg:text-base font-semibold py-4">
              {t.admin.recentShops.table.reviews}
            </TableHead>
            <TableHead className="text-sm lg:text-base font-semibold py-4">
              {t.admin.recentShops.table.createdAt}
            </TableHead>
            <TableHead className="text-right text-sm lg:text-base font-semibold">
              {t.admin.recentShops.table.actions}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {shops.map((shop: any) => (
            <TableRow key={shop.shop_id} className="hover:bg-gray-50 transition">
              <TableCell className="font-medium text-base lg:text-lg py-4">
                <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 min-w-0">
  <Store size={18} className="text-gray-500 shrink-0" />

  <span className="truncate min-w-0 max-w-[180px] block">
                    {
                      truncateText(
                      //   locale === "jp" ?
                      // shop.shop_name
                      // :
                     shop.shop_name_in_langs && shop.shop_name_in_langs[locale as keyof typeof translations] || shop.shop_name, 25) || t.admin.recentShops.table.unknown
                    }
                      </span>
                  </div>

                  {shop.business_hours && isShopOpen(shop) ? (
                    <Badge className="bg-green-50 text-green-700">
                      {t.admin.recentShops.table.open}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700">
                      {t.admin.recentShops.table.closed}
                    </Badge>
                  )}
                </div>
              </TableCell>

             <TableCell className="py-4">
  <div className="max-w-[220px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:text-base text-gray-600">
    {
      truncateText(
        shop.shop_address_in_langs &&
        shop.shop_address_in_langs[
          locale as keyof typeof translations
        ] || shop.shop_address,
        35
      ) || t.admin.recentShops.table.unknown
    }
  </div>
</TableCell>

              <TableCell className="text-sm lg:text-base">
                {shop.reviews?.[0]?.count ?? 0}
              </TableCell>

              <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                {new Date(shop.created_at).toLocaleDateString()}
              </TableCell>

              <TableCell className="flex justify-end gap-3 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/shop/${shop.shop_id}`}
                        className="flex items-center gap-2"
                      >
                        <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                        {t.buttons.viewDetails}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/admin/shops/edit/${shop.shop_id}`}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        {t.reviews.card.edit}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(shop)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t.reviews.card.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

   <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>
        {t.admin.deleteDialog.title}
      </DialogTitle>

      <DialogDescription>
        {t.admin.deleteDialog.description}
        <span className="font-semibold"> {selectedShop?.shop_name}</span>？
        <br />
        {t.admin.deleteDialog.confirmText}
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        {t.admin.deleteDialog.cancel}
      </Button>

      <Button variant="destructive" onClick={deleteShop}>
        {t.admin.deleteDialog.delete}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    <div className="md:hidden space-y-4 p-2">
      {shops.map((shop: any) => (
        <div
          key={shop.shop_id}
          className="border rounded-xl p-4 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="font-medium flex items-center gap-2">
              <Store size={16} />
              {
                truncateText(
                //   locale === "jp" ?
                // shop.shop_name
                // :
                shop.shop_name_in_langs && shop.shop_name_in_langs[locale as keyof typeof translations], 25)
              }
            </div>

            {shop.business_hours && isShopOpen(shop) ? (
              <Badge className="bg-green-50 text-green-700">
                {t.admin.recentShops.table.open}
              </Badge>
            ) : (
              <Badge className="bg-red-50 text-red-700">
                {t.admin.recentShops.table.closed}
              </Badge>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {
              truncateText(
              //   locale === "jp" ?
              // shop.shop_address
              // :
              shop.shop_address_in_langs && shop.shop_address_in_langs[locale as keyof typeof translations], 35) || "—"
            }
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {t.admin.recentShops.table.reviews}: {shop.review_count ?? 0}
            </span>
            <span>
              {new Date(shop.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/${locale}/shop/${shop.shop_id}`}
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm"
            >
              {t.buttons.viewDetails}
            </Link>

            <Link
              href={`/${locale}/admin/shops/edit/${shop.shop_id}`}
              className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-md text-sm"
            >
              {t.reviews.card.edit}
            </Link>

            <button
              onClick={() => openDeleteDialog(shop)}
              className="flex-1 bg-red-500 text-white hover:bg-red-600 py-2 rounded-md text-sm"
            >
              {t.reviews.card.delete}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</>
  );
}