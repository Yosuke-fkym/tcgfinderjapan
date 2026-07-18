"use client";

import { useState } from "react";
import Image from "next/image";

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
  Pencil,
  Trash2,
  ImageOff,
  ArrowUpRightFromSquareIcon,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { truncateText } from "@/lib/utils";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardsTable({ cards, refresh }: any) {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const openDeleteDialog = (card: any) => {
    setSelectedCard(card);
    setOpen(true);
  };

  const deleteCard = async () => {
    if (!selectedCard) return;
    const res = await fetch(`/api/admin/cards`, {
      method: "DELETE",
      body: JSON.stringify({ card_id: selectedCard.id }),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });
    const response = await res.json();
    if (!response.success) {
      toast(t.admin.cardsPage.error, { position: "top-right" });
      return;
    }
    toast(t.admin.cardForm.toast.successDelete || "Deleted", { position: "top-right" });
    setOpen(false);
    refresh();
  };

  if (!cards?.length) {
    return (
      <div className="bg-white border flex flex-col justify-center items-center rounded-xl p-10 text-center text-gray-500">
        <ImageOff className="mx-auto mb-3 opacity-60" size={28} />
        {t.admin.cardsPage.empty}
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
                  {t.admin.cardsPage.table.image}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.cardsPage.table.nameEn}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.cardsPage.table.cardNumber}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.cardsPage.table.rarity}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.cardsPage.table.pack}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.cardsPage.table.createdAt}
                </TableHead>
                <TableHead className="text-right text-sm lg:text-base font-semibold">
                  {t.admin.cardsPage.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cards.map((card: any) => (
                <TableRow key={card.id} className="hover:bg-gray-50 transition">

                  {/* Image */}
                  <TableCell className="py-4">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-gray-50 shrink-0">
                      {card.card_image ? (
                        <Image
                          src={card.card_image}
                          alt={card.card_name?.en || "card"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* English name */}
                  <TableCell className="font-medium text-base py-4">
                    {truncateText(card.card_name, 25) || t.admin.recentShops.table.unknown}
                  </TableCell>

                  {/* Card number */}
                  <TableCell className="text-sm lg:text-base">
                    {card.card_number || "—"}
                  </TableCell>

                  {/* Rarity */}
                  <TableCell className="text-sm lg:text-base">
                    {card.rarity ? (
                      <Badge className="bg-indigo-50 text-indigo-700">{card.rarity}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Pack */}
                  <TableCell className="py-4 max-w-45 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:text-base text-gray-600">
                    {truncateText(card.pack_name, 30) || "—"}
                  </TableCell>

                  {/* Created at */}
                  <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                    {new Date(card.created_at).toLocaleDateString()}
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
                  href={`/${locale}/cards/${card.slug}`}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm"
                >
                   <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                  {t.buttons.viewDetails}
                </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            target="_blank"
                            href={`/${locale}/admin/cards/edit/${card.id}`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            {t.reviews.card.edit}
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(card)}
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

        {/* ── Delete dialog ─────────────────────────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.admin.deleteDialog.title}</DialogTitle>
              <DialogDescription>
                {t.admin.deleteDialog.description}
                <span className="font-semibold"> {selectedCard?.card_name?.en}</span>？
                <br />
                {t.admin.deleteDialog.confirmText}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.admin.deleteDialog.cancel}
              </Button>
              <Button variant="destructive" onClick={deleteCard}>
                {t.admin.deleteDialog.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Mobile cards ──────────────────────────────────────────────────── */}
        <div className="md:hidden space-y-4 p-2">
          {cards.map((card: any) => (
            <div key={card.id} className="border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-gray-50 shrink-0">
                    {card.card_image ? (
                      <Image
                        src={card.card_image}
                        alt={card.card_name?.en || "card"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageOff size={16} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{card.card_name?.en}</div>
                    <div className="text-xs text-gray-500 truncate">{card.card_name?.ja}</div>
                  </div>
                </div>
                {card.rarity && (
                  <Badge className="bg-indigo-50 text-indigo-700 shrink-0">{card.rarity}</Badge>
                )}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{card.card_number || "—"}</span>
                <span>{new Date(card.created_at).toLocaleDateString()}</span>
              </div>

              <div className="text-sm text-gray-600 truncate">
                {card.pack_name?.en || "—"}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${locale}/admin/cards/edit/${card.id}`}
                  className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-md text-sm"
                >
                  {t.reviews.card.edit}
                </Link>
                <button
                  onClick={() => openDeleteDialog(card)}
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