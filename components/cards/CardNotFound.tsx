'use client'
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

/**
 * Rendered by app/cards/[slug]/not-found.tsx when a slug doesn't match any
 * card in the dummy dataset. Kept as its own component so it can also be
 * reused anywhere else a "no such card" state is needed.
 */
export function CardNotFound() {
    const { locale } = useParams();
  const t = getT(locale as string);
  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-1.5 text-sm text-stone-500">
            <li>
              <Link href="/" className="transition-colors hover:text-stone-800">
                {t.cardPage.cardNotFound.home}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/cards" className="transition-colors hover:text-stone-800">
               {t.cardPage.cardNotFound.cardEncyclopedia}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-stone-800" aria-current="page">
              {t.cardPage.cardNotFound.notFound}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-20 text-center">
          <svg
            width="88"
            height="88"
            viewBox="0 0 88 88"
            fill="none"
            aria-hidden="true"
            className="text-stone-300"
          >
            <rect x="16" y="8" width="40" height="56" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <rect x="32" y="24" width="40" height="56" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <path d="M42 44L62 64M62 44L42 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-stone-800"> {t.cardPage.cardNotFound.title}</p>
            <p className="text-sm text-stone-500">
               {t.cardPage.cardNotFound.description}
            </p>
          </div>

          <Button asChild className="rounded-full bg-[#B23A2F] px-6 text-white hover:bg-[#963026]">
            <Link href="/cards"> {t.cardPage.cardNotFound.backToCardEncyclopedia}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}