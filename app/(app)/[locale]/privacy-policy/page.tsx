import { getT } from "@/lib/getT";
import Link from "next/link";
import {
  Database,
  Settings2,
  Megaphone,
  Cookie,
  BarChart3,
  Share2,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
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
    ? "プライバシーポリシー | TCG Finder Japan"
    : "Privacy Policy | TCG Finder Japan";

  const description = isJP
    ? "TCG Finder Japanにおける個人情報の取り扱い、Cookie、広告、アクセス解析、第三者サービスなどについて説明します。"
    : "Learn how TCG Finder Japan collects and uses information, and how we handle cookies, advertising, analytics, and third-party services.";

  return {
    title,
    description,

    alternates: {
      canonical: `${baseUrl}/${locale}/privacy-policy`,
      languages: {
        en: `${baseUrl}/en/privacy-policy`,
        ja: `${baseUrl}/jp/privacy-policy`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/privacy-policy`,
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

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  const sections = [
    { id: "collect", icon: Database, data: t.privacy.sections.collect },
    { id: "usage", icon: Settings2, data: t.privacy.sections.usage },
    { id: "ads", icon: Megaphone, data: t.privacy.sections.ads },
    { id: "cookies", icon: Cookie, data: t.privacy.sections.cookies },
    { id: "analytics", icon: BarChart3, data: t.privacy.sections.analytics },
    { id: "thirdParty", icon: Share2, data: t.privacy.sections.thirdParty },
    {
      id: "protection",
      icon: ShieldCheck,
      data: t.privacy.sections.protection,
    },
    {
      id: "disclaimer",
      icon: AlertTriangle,
      data: t.privacy.sections.disclaimer,
    },
    { id: "changes", icon: RefreshCw, data: t.privacy.sections.changes },
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
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-br from-white to-white/60 bg-clip-text text-transparent">
            {t.privacy.title}
          </h1>
          <p className="text-white/60 leading-relaxed max-w-2xl">
            {t.privacy.intro}
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

                {id === "ads" ? (
                  <div className="space-y-4 text-white/70 leading-8 text-[15px]">
                    <p>{t.privacy.sections.ads.desc1}</p>
                    <p>{t.privacy.sections.ads.desc2}</p>
                    <p>{t.privacy.sections.ads.desc3}</p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={t.privacy.sections.ads.adsSettingsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-white/80 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-600/8 transition-colors"
                      >
                        Google Ads Settings
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>

                      <a
                        href={t.privacy.sections.ads.aboutAdsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-white/80 hover:border-indigo-500/40 hover:text-indigo-400 hover:bg-indigo-600/8 transition-colors"
                      >
                        Digital Advertising Alliance – WebChoices
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 leading-8 text-[15px]">
                    {data.desc}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
