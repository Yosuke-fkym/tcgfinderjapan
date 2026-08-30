import { getT } from "@/lib/getT";
import {
  UserCheck,
  Ban,
  MessageSquare,
  Store,
  Share2,
  Scale,
  UserX,
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
    ? "利用規約 | TCG Finder Japan"
    : "Terms of Service | TCG Finder Japan";

  const description = isJP
    ? "TCG Finder Japanの利用規約、ユーザーの責任、禁止事項、投稿コンテンツ、店舗情報、第三者サービス、責任制限などについて説明します。"
    : "Read the Terms of Service for TCG Finder Japan, including user responsibilities, prohibited activities, user content, shop information, third-party services, and limitations of liability.";

  return {
    title,
    description,

    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        en: `${baseUrl}/en/terms`,
        ja: `${baseUrl}/jp/terms`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/terms`,
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const sections = [
    {
      id: "responsibilities",
      icon: UserCheck,
      data: t.terms.sections.responsibilities,
    },
    { id: "prohibited", icon: Ban, data: t.terms.sections.prohibited },
    { id: "content", icon: MessageSquare, data: t.terms.sections.content },
    { id: "shopInfo", icon: Store, data: t.terms.sections.shopInfo },
    { id: "thirdParty", icon: Share2, data: t.terms.sections.thirdParty },
    { id: "liability", icon: Scale, data: t.terms.sections.liability },
    { id: "termination", icon: UserX, data: t.terms.sections.termination },
    { id: "changes", icon: RefreshCw, data: t.terms.sections.changes },
  ] as const;

  return (
    <div className="relative min-h-screen bg-[#08080b] text-white overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-225 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-100 w-100 rounded-full bg-violet-500/6 blur-[110px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        {/* TITLE */}
        <div className="space-y-4 pb-10 mb-10 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600/25 to-transparent border border-indigo-500/25">
            <Scale className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
            {t.terms.title}
          </h1>
          <p className="text-white/60 leading-relaxed max-w-2xl">
            {t.terms.intro}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* SIDEBAR NAV */}
          <nav className="hidden lg:block sticky top-24 self-start h-fit">
            <ul className="space-y-1 border-l border-white/10 pl-4">
              {sections.map(({ id, data }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block text-sm text-white/50 hover:text-indigo-400 transition-colors py-1.5"
                  >
                    {data.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* SECTIONS */}
          <div className="space-y-5">
            {sections.map(({ id, icon: Icon, data }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm p-6 sm:p-8 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.035]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600/20 to-indigo-600/2 border border-indigo-500/25">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                    {data.title}
                  </h2>
                </div>

                <p className="text-white/70 leading-8 text-[15px]">
                  {data.desc}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
