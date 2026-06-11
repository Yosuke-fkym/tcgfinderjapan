"use client";

import { useEffect, useState } from "react";
import ArticlesTable from "@/components/admin/articles/ArticlePageComponent";
import FloatingCreateArticleBtn from "@/components/admin/articles/FloatingCreateArticleBtn";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/admin/articles");

      const json = await res.json();

      setArticles(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <ArticlesTable
      articles={articles}
      refresh={fetchArticles}
      />
      <FloatingCreateArticleBtn/>
      </>
  );
}