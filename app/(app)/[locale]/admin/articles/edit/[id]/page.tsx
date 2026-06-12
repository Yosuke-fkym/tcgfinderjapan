// app/[locale]/admin/articles/edit/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import ArticleForm from "@/components/admin/articles/ArticleForm";

type ArticleTag = {
  general_blog_tag_id: string;
};

type RawArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  category_id: string;
  status: "draft" | "published";
  is_protected: boolean;          // ← ADD
  article_tags: ArticleTag[];
};

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const id     = params.id as string;
  const locale = params.locale as string;

  const [article,  setArticle]  = useState<RawArticle | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadArticle() {
      try {
        const res = await fetch(`/api/admin/articles/edit/${id}`, {
          cache: "no-store",
        });

        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { toast.error("Failed to load article."); return; }

        const { data } = await res.json();
        setArticle(data);
      } catch {
        toast.error("Something went wrong while loading the article.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 min-h-[60vh] flex justify-center items-center gap-2">
        Loading article <Spinner className="inline-flex mx-0.5" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="text-sm text-gray-500 min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <p>Article not found.</p>
        <button
          onClick={() => router.push(`/${locale}/admin/articles`)}
          className="text-sm underline hover:text-gray-800 transition"
        >
          ← Back to Articles
        </button>
      </div>
    );
  }

  const tag_ids = article.article_tags?.map((at) => at.general_blog_tag_id) ?? [];

  return (
    <ArticleForm
      mode="edit"
      initialData={{
        id:            article.id,
        title:         article.title,
        slug:          article.slug,
        excerpt:       article.excerpt,
        content:       article.content,
        thumbnail_url: article.thumbnail_url,
        category_id:   article.category_id,
        status:        article.status,
        is_protected:  article.is_protected,  // ← ADD
        tag_ids,
      }}
    />
  );
}