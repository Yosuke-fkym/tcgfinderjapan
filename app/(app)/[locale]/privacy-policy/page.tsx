import { getT } from "@/lib/getT";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="max-w-3xl text-white mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{t.privacy.title}</h1>

      <p>{t.privacy.intro}</p>

      <h2 className="text-lg font-semibold">
        {t.privacy.sections.collect.title}
      </h2>
      <p>{t.privacy.sections.collect.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.privacy.sections.usage.title}
      </h2>
      <p>{t.privacy.sections.usage.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.privacy.sections.thirdParty.title}
      </h2>
      <p>{t.privacy.sections.thirdParty.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.privacy.sections.protection.title}
      </h2>
      <p>{t.privacy.sections.protection.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.privacy.sections.changes.title}
      </h2>
      <p>{t.privacy.sections.changes.desc}</p>
    </div>
  );
}