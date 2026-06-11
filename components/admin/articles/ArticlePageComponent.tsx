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
  FileText,
} from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { useParams } from "next/navigation";

import { getT } from "@/lib/getT";

type Article = {
  id: string;

  title: string;

  slug: string;

  excerpt: string;

  status: "draft" | "published";

  published_at: string | null;

  created_at: string;

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

export default function ArticlesTable({ articles, refresh }: Props) {
  const [open, setOpen] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { locale } = useParams();

  const t = getT(locale as string);

  const openDeleteDialog = (article: Article) => {
    setSelectedArticle(article);

    setOpen(true);
  };

  const deleteArticle = async () => {
    if (!selectedArticle) return;

    const res = await fetch(`/api/admin/articles/edit/${selectedArticle.id}`, {
      method: "DELETE",

      body: JSON.stringify({ id: selectedArticle.id }),

      headers: {
        "Content-Type": "application/json",
      },

      next: { revalidate: 0 },
    });

    const response = await res.json();

    if (!response.success) {
      toast("Failed to delete article", { position: "top-right" });

      return;
    }

    toast("Article deleted successfully", { position: "top-right" });

    setOpen(false);

    refresh();
  };

  if (!articles?.length) {
    return (
      <div className="bg-white border flex flex-col justify-center items-center rounded-xl p-10 text-center text-gray-500">
        <FileText className="mx-auto mb-3 opacity-60" size={28} />

        <div className="text-lg font-semibold mb-2">No articles found</div>

        <div className="text-gray-500">Create your first article.</div>
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
                  Article
                </TableHead>

                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  Category
                </TableHead>

                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  Status
                </TableHead>

                <TableHead className="text-sm lg:text-base font-semibold py-4">
                  Published
                </TableHead>

                <TableHead className="text-right text-sm lg:text-base font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="font-medium text-base lg:text-lg py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-gray-500 shrink-0" />

                      <span className="truncate min-w-0 max-w-45 block">
                        {article.title}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="max-w-55 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:text-base text-gray-600">
                      {article.blog_categories?.name || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    {article.status === "published" ? (
                      <Badge className="bg-green-50 text-green-700">
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-50 text-yellow-700">
                        Draft
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-sm lg:text-base text-gray-500 py-4">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString()
                      : "—"}
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
                            href={`/${locale}/blog/${article.slug}`}
                            className="flex items-center gap-2"
                          >
                            <ArrowUpRightFromSquareIcon className="h-4 w-4" />
                            View Article
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/admin/articles/edit/${article.id}`}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
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
              <DialogTitle>Delete Article</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this article?
                <span className="font-semibold"> {selectedArticle?.title}</span>
                ?
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button variant="destructive" onClick={deleteArticle}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="md:hidden space-y-4 p-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="font-medium flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />

                  <span className="truncate max-w-50">
                    {article.title}
                  </span>
                </div>

                {article.status === "published" ? (
                  <Badge className="bg-green-50 text-green-700">
                    Published
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-50 text-yellow-700">Draft</Badge>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {article.blog_categories?.name || "—"}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Published:{" "}
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${locale}/blog/${article.slug}`}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm"
                >
                  View
                </Link>

                <Link
                  href={`/${locale}/admin/articles/edit/${article.id}`}
                  className="flex-1 text-center bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-md text-sm"
                >
                  Edit
                </Link>

                <button
                  onClick={() => openDeleteDialog(article)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 py-2 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
