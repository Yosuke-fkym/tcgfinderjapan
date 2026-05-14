import { getT } from "@/lib/getT";
import Link from "next/link";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      <section className="space-y-6">
        
        {/* TITLE */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">
            {t.about.title}
          </h1>

          <p className="text-white/70 leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-5 text-white/80 leading-8">

          <p>
            <span className="font-semibold text-white">
             {t.about.operatorLabel}
            </span>{" "}
            {t.about.operator}
          </p>

          <p>
            <span className="font-semibold text-white">
              {t.about.websiteLabel}
            </span>{" "}
            <a
              href="https://www.tcgfinderjapan.com"
              target="_blank"
              className="text-blue-400 hover:underline break-all"
            >
              https://www.tcgfinderjapan.com
            </a>
          </p>

          <p>
            <span className="font-semibold text-white">
             {t.about.purposeLabel}
            </span>{" "}
            {t.about.purpose}
          </p>

          <p>
            <span className="font-semibold text-white">
              {t.about.activitiesLabel}
            </span>{" "}
            {t.about.activities}
          </p>

          <div>
            <span className="font-semibold text-white">
              {t.about.contactLabel}
            </span>

            <div className="mt-2">
              <Link
                href={`/${locale}/contact`}
                className="text-blue-400 hover:underline"
              >
                {t.about.contactButton}
              </Link>
            </div>
          </div>

          <p>
            <span className="font-semibold text-white">
              {t.about.disclaimerLabel}
            </span>{" "}
            {t.about.disclaimer}
          </p>

        </div>
      </section>
    </div>
  );
}