"use client";

// components/admin/articles/ArticlesTable.tsx

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
  FileText,
  Star,
} from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { useParams } from "next/navigation";

import { getT } from "@/lib/getT";
import { categoryColors } from "@/lib/getArticleCategoryColor";

// ─── Types ────────────────────────────────────────────────────────────────────

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  is_featured: boolean;
  blog_categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Props = {
  articles: Article[];
  refresh: () => void;
};

// ─── Featured Toggle Button ───────────────────────────────────────────────────
// Self-contained: manages its own loading state, fires the PATCH, calls back
// onToggle(id, newValue) so the parent can update optimistic state.

function FeaturedToggle({
  articleId,
  isFeatured,
  onToggle,
}: {
  articleId: string;
  isFeatured: boolean;
  onToggle: (id: string, newValue: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    const newValue = !isFeatured;
    setLoading(true);

    // Optimistic update immediately
    onToggle(articleId, newValue);

    try {
      const res = await fetch(
        `/api/admin/articles/edit/${articleId}/featured`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_featured: newValue }),
        }
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        // Roll back optimistic update on failure
        onToggle(articleId, isFeatured);
        toast.error("Failed to update featured status.");
      } else {
        toast.success(
          newValue ? "Article marked as featured." : "Article removed from featured."
        );
      }
    } catch {
      onToggle(articleId, isFeatured);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isFeatured) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        title="Remove from featured"
        className="
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
          bg-amber-50 text-amber-700 border border-amber-200
          hover:bg-amber-100 hover:border-amber-300
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-150 whitespace-nowrap
        "
      >
        <Star
          size={12}
          className={`fill-amber-500 text-amber-500 ${loading ? "animate-pulse" : ""}`}
        />
        Featured
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Mark as featured"
      className="
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium
        bg-transparent text-stone-400 border border-stone-200
        hover:bg-stone-50 hover:text-stone-600 hover:border-stone-300
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150 whitespace-nowrap
      "
    >
      <Star
        size={12}
        className={`text-stone-400 ${loading ? "animate-pulse" : ""}`}
      />
      Feature
    </button>
  );
}

// ─── Dropdown version for desktop actions menu ────────────────────────────────

function FeaturedDropdownItem({
  articleId,
  isFeatured,
  onToggle,
}: {
  articleId: string;
  isFeatured: boolean;
  onToggle: (id: string, newValue: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    const newValue = !isFeatured;
    setLoading(true);
    onToggle(articleId, newValue);

    try {
      const res = await fetch(
        `/api/admin/articles/edit/${articleId}/featured`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_featured: newValue }),
        }
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        onToggle(articleId, isFeatured);
        toast.error("Failed to update featured status.");
      } else {
        toast.success(
          newValue ? "Article marked as featured." : "Article removed from featured."
        );
      }
    } catch {
      onToggle(articleId, isFeatured);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenuItem
      onClick={handleClick}
      disabled={loading}
      className={isFeatured ? "text-amber-700 focus:text-amber-700" : ""}
    >
      <Star
        className={`h-4 w-4 mr-2 ${
          isFeatured ? "fill-amber-500 text-amber-500" : "text-stone-400"
        } ${loading ? "animate-pulse" : ""}`}
      />
      {isFeatured ? "Remove from Featured" : "Mark as Featured"}
    </DropdownMenuItem>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export default function ArticlesTable({ articles, refresh }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { locale } = useParams();
  const t = getT(locale as string);

  // Optimistic featured state: id → is_featured override.
  // Starts empty — values only populated after a toggle fires.
  const [featuredOverrides, setFeaturedOverrides] = useState<
    Record<string, boolean>
  >({});

  function handleFeaturedToggle(id: string, newValue: boolean) {
    setFeaturedOverrides((prev) => ({ ...prev, [id]: newValue }));
  }

  // /** Returns the effective is_featured value, respecting optimistic overrides. */
  // function isFeatured(article: Article): boolean {
  //   return article.id in featuredOverrides
  //     ? featuredOverrides[article.id]
  //     : article.is_featured ?? false;
  //   // Note: 'id' below refers to article.id — extracted in the map
  // }

  // ── helper used inside map ──
  function getFeatured(article: Article): boolean {
    return article.id in featuredOverrides
      ? featuredOverrides[article.id]
      : article.is_featured ?? false;
  }

  const openDeleteDialog = (article: Article) => {
    setSelectedArticle(article);
    setOpen(true);
  };

  const deleteArticle = async () => {
    if (!selectedArticle) return;
    const res = await fetch(`/api/admin/articles/edit/${selectedArticle.id}`, {
      method: "DELETE",
      body: JSON.stringify({ id: selectedArticle.id }),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });
    const response = await res.json();

    if (!response.success) {
      toast(t.blogArticlesTable.deleteFailed, { position: "top-right" });
      return;
    }

    toast(t.blogArticlesTable.deleteSuccess, { position: "top-right" });
    setOpen(false);
    refresh();
  };

  if (!articles?.length) {
    return (
      <div className="bg-white border flex flex-col justify-center items-center rounded-xl p-10 text-center text-gray-500">
        <FileText className="mx-auto mb-3 opacity-60" size={28} />
        <div className="text-lg font-semibold mb-2">
          {t.blogArticlesTable.noArticlesFound}
        </div>
        <div className="text-gray-500">
          {t.blogArticlesTable.createFirstArticle}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border rounded-xl p-1.5 shadow-sm">

        {/* ── Desktop table ── */}
        <div className="hidden md:block overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.blogArticlesTable.article}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.blogArticlesTable.category}
                </TableHead>
                {/* Featured column */}
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  Featured
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.blogArticlesTable.status}
                </TableHead>
                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  {t.blogArticlesTable.published}
                </TableHead>
                <TableHead className="text-right text-sm lg:text-base font-semibold">
                  {t.blogArticlesTable.actions}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* Title */}
                  <TableCell className="font-medium text-base lg:text-lg py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-gray-500 shrink-0" />
                      <span className="truncate min-w-0 max-w-45 block">
                        {article.title}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-4">
                    <div className={`w-fit overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:text-[14px] text-gray-600 ${article.blog_categories?.name != undefined && categoryColors[article.blog_categories.name as keyof typeof categoryColors]} px-4 py-1 rounded-md`}>
                      {article.blog_categories?.name || "—"}

                    </div>
                  </TableCell>

                  {/* Featured toggle */}
                  <TableCell className="py-4">
                    <FeaturedToggle
                      articleId={article.id}
                      isFeatured={getFeatured(article)}
                      onToggle={handleFeaturedToggle}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4">
                    {article.status === "published" ? (
                      <Badge className="bg-green-50 text-green-700">
                        {t.blogArticlesTable.publishedStatus}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-50 text-yellow-700">
                        {t.blogArticlesTable.draftStatus}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Published date */}
                  <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  {/* Actions dropdown */}
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
                            href={`/${locale}/blog/${article.slug}`}
                            className="flex items-center gap-2"
                          >
                            <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                            {t.blogArticlesTable.viewArticle}
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/admin/articles/edit/${article.id}`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            {t.blogArticlesTable.edit}
                          </Link>
                        </DropdownMenuItem>

                        {/* Featured toggle in dropdown */}
                        <FeaturedDropdownItem
                          articleId={article.id}
                          isFeatured={getFeatured(article)}
                          onToggle={handleFeaturedToggle}
                        />

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t.blogArticlesTable.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ── Delete dialog ── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.blogArticlesTable.deleteArticle}</DialogTitle>
              <DialogDescription>
                {t.blogArticlesTable.deleteConfirm}
                <span className="font-semibold"> {selectedArticle?.title}</span>?
                <br />
                {t.blogArticlesTable.cannotUndo}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.blogArticlesTable.cancel}
              </Button>
              <Button variant="destructive" onClick={deleteArticle}>
                {t.blogArticlesTable.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Mobile cards ── */}
        <div className="md:hidden space-y-4 p-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border rounded-xl p-4 shadow-sm space-y-3"
            >
              {/* Title + status */}
              <div className="flex justify-between items-start">
                <div className="font-medium flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="truncate max-w-50">{article.title}</span>
                </div>
                {article.status === "published" ? (
                  <Badge className="bg-green-50 text-green-700">
                    {t.blogArticlesTable.publishedLabel}
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-50 text-yellow-700">Draft</Badge>
                )}
              </div>

              {/* Category */}
              <div className="text-sm text-gray-600">
                {article.blog_categories?.name || "—"}
              </div>

              {/* Featured toggle + date row */}
              <div className="flex items-center justify-between">
                <FeaturedToggle
                  articleId={article.id}
                  isFeatured={getFeatured(article)}
                  onToggle={handleFeaturedToggle}
                />
                <span className="text-xs text-gray-500">
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/blog/${article.slug}`}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm"
                >
                  {t.blogArticlesTable.view}
                </Link>
                <Link
                  href={`/${locale}/admin/articles/edit/${article.id}`}
                  className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-md text-sm"
                >
                  {t.blogArticlesTable.edit}
                </Link>
                <button
                  onClick={() => openDeleteDialog(article)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 py-2 rounded-md text-sm"
                >
                  {t.blogArticlesTable.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}