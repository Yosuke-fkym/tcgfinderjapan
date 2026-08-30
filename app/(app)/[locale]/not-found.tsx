"use client";

import Link from "next/link";
import { SearchX, MapPin, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function NotFound() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const t = getT(locale);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="relative mb-8">
          <div className="text-[clamp(7rem,20vw,12rem)] font-black leading-none tracking-tighter text-white/5 select-none">
            404
          </div>

          <div className="absolute inset-0 -top-65 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
              <SearchX className="h-8 w-8 text-white/60" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/40">
            {t.notFound.label}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.notFound.title}
          </h1>

          <p className="mx-auto max-w-md text-sm leading-7 text-white/55 sm:text-base">
            {t.notFound.description}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <MapPin className="h-4 w-4" />
            {t.notFound.exploreButton}
          </Link>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.notFound.backButton}
          </Link>
        </div>

        <p className="mt-10 text-xs text-white/30">{t.notFound.hint}</p>
      </div>
    </main>
  );
}
