import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/blog";

interface RelatedBlogCardProps {
  post: BlogPost;
  locale: string;
}

export function RelatedBlogCard({ post, locale}: RelatedBlogCardProps) {
  
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm sm:flex-row">
      <div className="aspect-[16/9] w-full shrink-0 bg-stone-100 sm:aspect-auto sm:w-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnail_url as string}
          alt="related-blogs-thumbnail-image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900">
          {post.title}
        </h3>
        <p className="text-sm line-clamp-2 leading-relaxed text-stone-500">
          {post.excerpt}
        </p>

        <Button
          asChild
          variant="outline"
          className="mt-3 w-fit gap-1.5 rounded-full border-stone-300 text-stone-700 hover:bg-stone-100"
        >
          <Link target="_blank" href={`/${locale}/blog/${post.slug}`}>
            Read Article
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}