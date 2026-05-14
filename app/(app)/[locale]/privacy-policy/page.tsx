import { getT } from "@/lib/getT";
import Link from "next/link";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
const t = getT(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      <div className="space-y-10">

        {/* TITLE */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">
           {t.privacy.title}
          </h1>

          <p className="text-white/70 leading-relaxed">
            {t.privacy.intro}
          </p>
        </div>

        {/* SECTION 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.collect.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.collect.desc}
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.usage.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.usage.desc}
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.ads.title}
          </h2>

          <div className="space-y-4 text-white/80 leading-8">
            <p>
              {t.privacy.sections.ads.desc1}
            </p>

            <p>
              {t.privacy.sections.ads.desc2}
            </p>

            <p>
              {t.privacy.sections.ads.desc3}
            </p>
            <p>
              {t.privacy.sections.ads.desc4}
            </p>

            {/* <a
              href="https://www.aboutads.info/"
              target="_blank"
              className="text-blue-400 hover:underline break-all"
            >
              https://www.aboutads.info/
            </a> */}
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.analytics.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.analytics.desc}
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.thirdParty.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.thirdParty.desc}
          </p>
        </section>

        {/* SECTION 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.protection.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.protection.desc}
          </p>
        </section>

        {/* SECTION 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.disclaimer.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.disclaimer.desc}
          </p>
        </section>

        {/* SECTION 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t.privacy.sections.changes.title}
          </h2>

          <p className="text-white/80 leading-8">
            {t.privacy.sections.changes.desc}
          </p>
        </section>

      </div>
    </div>
  );
}