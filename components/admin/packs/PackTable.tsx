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
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { truncateText } from "@/lib/utils";

interface Pack {
  id: string;
  slug: string;
  name_en: string;
  name_jp: string;
  image_url: string | null;
  release_date: string | null;
  created_at?: string;
}

interface Props {
  packs: Pack[];
  refresh: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PackTable({ packs, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const openDeleteDialog = (pack: Pack) => {
    setSelectedPack(pack);
    setOpen(true);
  };

  const deletePack = async () => {
    if (!selectedPack) return;
    const res = await fetch(`/api/admin/packs`, {
      method: "DELETE",
      body: JSON.stringify({ pack_id: selectedPack.id }),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });
    const response = await res.json();
    if (!response.success) {
      toast(t.admin.packsPage?.error || "削除に失敗しました", { position: "top-right" });
      return;
    }
    toast(t.admin.packForm.toast.successDelete || "Deleted", { position: "top-right" });
    setOpen(false);
    refresh();
  };

  if (!packs?.length) {
    return (
      <div className="bg-white border flex flex-col justify-center items-center rounded-xl p-10 text-center text-gray-500">
        <ImageOff className="mx-auto mb-3 opacity-60" size={28} />
        {t.admin.packsPage.empty || "No packs found."}
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
                <TableHead className="text-sm mx-auto lg:text-base font-semibold py-4">
                  {t.admin.packsPage?.table?.image || "Image"}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.packsPage?.table?.nameJa || "Japanese Name"}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.packsPage?.table?.nameEn || "English Name"}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.admin.packsPage?.table?.releaseDate || "Release Date"}
                </TableHead>
                <TableHead className="text-right text-sm lg:text-base font-semibold">
                  {t.admin.packsPage?.table?.actions || "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {packs.map((pack) => (
                <TableRow key={pack.id} className="hover:bg-gray-50 transition">

                  {/* Image */}
                  <TableCell className="py-4">
                    <div className="relative h-20 w-14 overflow-hidden rounded-md border bg-gray-50">
                      {pack.image_url ? (
                       <Image
    src={pack.image_url}
    alt={pack.name_en}
    fill
    unoptimized
    className="object-contain"
  />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Japanese name */}
                  <TableCell className="font-medium text-base py-4">
                    {truncateText(pack.name_jp, 25) || "—"}
                  </TableCell>

                  {/* English name */}
                  <TableCell className="text-sm lg:text-base">
                    {truncateText(pack.name_en, 25) || "—"}
                  </TableCell>

                  {/* Release date */}
                  <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                    {pack.release_date
                      ? new Date(pack.release_date).toLocaleDateString()
                      : "—"}
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
                            href={`/${locale}/packs/${pack.slug}`}
                            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm"
                          >
                            <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                            {t.buttons.viewDetails}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            target="_blank"
                            href={`/${locale}/admin/packs/edit/${pack.id}`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            {t.reviews.card.edit}
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(pack)}
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
                <span className="font-semibold"> {selectedPack?.name_en}</span>？
                <br />
                {t.admin.deleteDialog.confirmText}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.admin.deleteDialog.cancel}
              </Button>
              <Button variant="destructive" onClick={deletePack}>
                {t.admin.deleteDialog.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Mobile cards ──────────────────────────────────────────────────── */}
        <div className="md:hidden space-y-4 p-2">
          {packs.map((pack) => (
            <div key={pack.id} className="border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-gray-50 shrink-0">
                    {pack.image_url ? (
                      <Image
                        src={pack.image_url}
                        alt={pack.name_en || "pack"}
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
                    <div className="font-medium truncate">{pack.name_en}</div>
                    <div className="text-xs text-gray-500 truncate">{pack.name_jp}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{pack.slug || "—"}</span>
                <span>
                  {pack.release_date
                    ? new Date(pack.release_date).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${locale}/admin/packs/${pack.id}`}
                  className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-md text-sm"
                >
                  {t.reviews.card.edit}
                </Link>
                <button
                  onClick={() => openDeleteDialog(pack)}
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