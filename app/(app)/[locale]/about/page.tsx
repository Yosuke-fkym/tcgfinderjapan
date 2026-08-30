import { getT } from "@/lib/getT";
import Link from "next/link";
import {
  Building2,
  Globe,
  Target,
  Layers,
  Mail,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const isJP = locale === "jp";

  const title = isJP
    ? "TCG Finder Japanについて | 日本のトレーディングカードショップ"
    : "About Us | TCG Finder Japan";

  const description = isJP
    ? "TCG Finder Japanの運営目的、店舗情報の収集・更新方針、サービス内容、お問い合わせ方法についてご紹介します。"
    : "Learn about TCG Finder Japan, our purpose, shop information collection and update policy, services, and how to contact us.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        ja: `${baseUrl}/jp/about`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/about`,
      siteName: "TCG Finder Japan",
      locale: isJP ? "ja_JP" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="relative min-h-screen bg-[#08080b] text-white overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-225 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-100 w-100 rounded-full bg-violet-500/6 blur-[110px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        {/* TITLE */}
        <div className="space-y-4 pb-10 mb-10 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600/25 to-transparent border border-indigo-500/25">
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
            {t.about.title}
          </h1>
          <p className="text-white/60 leading-relaxed max-w-2xl">
            {t.about.subtitle}
          </p>
        </div>

        <div className="space-y-5">
          {/* COMPACT FACTS: operator + website side by side */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-white/90">
                  {t.about.operatorLabel}
                </span>
              </div>
              <p className="text-white/70 leading-7 text-[15px]">
                {t.about.operator}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-white/90">
                  {t.about.websiteLabel}
                </span>
              </div>
              <a
                href="https://www.tcgfinderjapan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 hover:underline break-all text-[15px] transition-colors"
              >
                tcgfinderjapan.com
              </a>
            </div>
          </div>

          {/* PURPOSE */}
          <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t.about.purposeLabel}
              </h2>
            </div>
            <p className="text-white/70 leading-8 text-[15px]">
              {t.about.purpose}
            </p>
          </div>

          {/* ACTIVITIES */}
          <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t.about.activitiesLabel}
              </h2>
            </div>
            <p className="text-white/70 leading-8 text-[15px]">
              {t.about.activities}
            </p>
          </div>
          {/* SHOP INFORMATION & UPDATES */}
          <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                <RefreshCw className="w-4 h-4 text-indigo-400" />
              </div>

              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t.about.shopInfoPolicyLabel}
              </h2>
            </div>

            <p className="text-white/70 leading-8 text-[15px]">
              {t.about.shopInfoPolicy}
            </p>
          </div>

          {/* CONTACT - highlighted CTA card */}
          <div className="rounded-2xl border border-indigo-500/25 bg-linear-to-br from-indigo-600/8 to-transparent p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/25 to-indigo-600/5 border border-indigo-500/30">
                <Mail className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t.about.contactLabel}
              </h2>
            </div>
            <p className="text-white/70 leading-8 text-[15px] mb-5">
              {t.about.contactDesc}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              {t.about.contactButton}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* DISCLAIMER */}
          <div className="rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.035] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                <AlertTriangle className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                {t.about.disclaimerLabel}
              </h2>
            </div>
            <p className="text-white/70 leading-8 text-[15px]">
              {t.about.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
