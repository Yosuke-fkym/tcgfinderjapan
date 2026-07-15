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
  Languages,
  RotateCcw,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
import { truncateText } from "@/lib/utils";

// ─── Translation types ────────────────────────────────────────────────────────

type TranslationStatus = "translated" | "not_translated" | "failed";
type T = ReturnType<typeof getT>;

// ─── Translation Status Badge ─────────────────────────────────────────────────

function TranslationBadge({ status, t }: { status: TranslationStatus, t: T }) {
  
  if (status === "translated") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-green-50 text-green-700 ring-1 ring-green-200 select-none">
        {t.admin.recentShops.table.translated}
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-600 ring-1 ring-red-200 select-none">
        {t.admin.recentShops.table.failed}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-500 ring-1 ring-gray-200 select-none">
     {t.admin.recentShops.table.notTranslated}
    </span>
  );
}

// ─── Translate action inside the existing DropdownMenu ───────────────────────

function TranslateMenuItem({
  shopId,
  status,
  onSuccess,
  t
}: {
  shopId: string;
  status: TranslationStatus;
  t: T
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const isTranslated = status === "translated";

  const handleTranslate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/translate/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, overwrite: isTranslated }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        isTranslated ? t.admin.recentShops.table.reTranslatedSuccessfully : t.admin.recentShops.table.translatedSuccessfully,
        { position: "top-right" }
      );
      onSuccess();
    } catch {
      toast.error(t.admin.recentShops.table.notTranslated, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={loading}
      onSelect={(e) => e.preventDefault()} // keep dropdown open during async request
      onClick={handleTranslate}
      className="flex items-center gap-2 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isTranslated ? (
        <RotateCcw className="h-4 w-4" />
      ) : (
        <Languages className="h-4 w-4" />
      )}
      {loading ? t.admin.recentShops.table.translating : isTranslated ? t.admin.recentShops.table.reTranslate : t.admin.recentShops.table.translate}
    </DropdownMenuItem>
  );
}

// ─── Standalone translate button for mobile cards ─────────────────────────────

function MobileTranslateButton({
  shopId,
  status,
  onSuccess,
  t
}: {
  shopId: string;
  status: TranslationStatus;
  t: T,
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const isTranslated = status === "translated";

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/translate/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, overwrite: isTranslated }),
      });
      if (!res.ok) throw new Error();
      toast.success(
       isTranslated ? t.admin.recentShops.table.reTranslatedSuccessfully : t.admin.recentShops.table.translatedSuccessfully,
        { position: "top-right" }
      );
      onSuccess();
    } catch {
      toast.error(t.admin.recentShops.table.notTranslated, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTranslate}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : isTranslated ? (
        <RotateCcw size={12} />
      ) : (
        <Languages size={12} />
      )}
        {loading ? t.admin.recentShops.table.translating : isTranslated ? t.admin.recentShops.table.reTranslate : t.admin.recentShops.table.translate}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
      headers: { "Content-Type": "application/json" },
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

  /** Resolve per-shop translation status. Adjust field name to match your DB schema. */
  const getStatus = (shop: any): TranslationStatus =>
    shop.isTranslated ?  "translated" : "not_translated";

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

        {/* ── Desktop table ─────────────────────────────────────────────────── */}
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

                {/* ── NEW ── */}
                <TableHead className="text-sm lg:text-base font-semibold py-4 whitespace-nowrap">
                  {t.admin.recentShops.table.translation}
                </TableHead>

                <TableHead className="text-right text-sm lg:text-base font-semibold">
                  {t.admin.recentShops.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {shops.map((shop: any) => (
                <TableRow key={shop.shop_id} className="hover:bg-gray-50 transition">

                  {/* Shop name */}
                  <TableCell className="font-medium text-base lg:text-lg py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Store size={18} className="text-gray-500 shrink-0" />
                        <span className="truncate min-w-0 max-w-[180px] block">
                          {truncateText(
                            (shop.shop_name_in_langs &&
                              shop.shop_name_in_langs[locale as keyof typeof translations]) ||
                              shop.shop_name,
                            25
                          ) || t.admin.recentShops.table.unknown}
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

                  {/* Address */}
                  <TableCell className="py-4">
                    <div className="max-w-[220px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:text-base text-gray-600">
                      {truncateText(
                        (shop.shop_address_in_langs &&
                          shop.shop_address_in_langs[locale as keyof typeof translations]) ||
                          shop.shop_address,
                        35
                      ) || t.admin.recentShops.table.unknown}
                    </div>
                  </TableCell>

                  {/* Reviews */}
                  <TableCell className="text-sm lg:text-base">
                    {shop.reviews?.[0]?.count ?? 0}
                  </TableCell>

                  {/* Created at */}
                  <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                    {new Date(shop.created_at).toLocaleDateString()}
                  </TableCell>

                  {/* ── NEW: Translation status badge ── */}
                  <TableCell className="py-4">
                    <TranslationBadge status={getStatus(shop)} t={t} />
                  </TableCell>

                  {/* Actions */}
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
                            target="_blank"
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
                            target="_blank"
                            href={`/${locale}/admin/shops/edit/${shop.shop_id}`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            {t.reviews.card.edit}
                          </Link>
                        </DropdownMenuItem>

                        {/* ── NEW: Translate action ── */}
                        <DropdownMenuSeparator />

                        <TranslateMenuItem
                          shopId={shop.shop_id}
                          status={getStatus(shop)}
                          onSuccess={refresh}
                          t={t}
                        />

                        <DropdownMenuSeparator />

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

        {/* ── Delete dialog (unchanged) ─────────────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.admin.deleteDialog.title}</DialogTitle>
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

        {/* ── Mobile cards ──────────────────────────────────────────────────── */}
        <div className="md:hidden space-y-4 p-2">
          {shops.map((shop: any) => (
            <div key={shop.shop_id} className="border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="font-medium flex items-center gap-2">
                  <Store size={16} />
                  {truncateText(
                    shop.shop_name_in_langs &&
                      shop.shop_name_in_langs[locale as keyof typeof translations],
                    25
                  )}
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
                {truncateText(
                  shop.shop_address_in_langs &&
                    shop.shop_address_in_langs[locale as keyof typeof translations],
                  35
                ) || "—"}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{t.admin.recentShops.table.reviews}: {shop.review_count ?? 0}</span>
                <span>{new Date(shop.created_at).toLocaleDateString()}</span>
              </div>

              {/* ── NEW: Translation status + button row on mobile ── */}
              <div className="flex items-center justify-between pt-0.5">
                <TranslationBadge status={getStatus(shop)} t={t} />
                <MobileTranslateButton
                  shopId={shop.shop_id}
                  t={t}
                  status={getStatus(shop)}
                  onSuccess={refresh}
                />
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