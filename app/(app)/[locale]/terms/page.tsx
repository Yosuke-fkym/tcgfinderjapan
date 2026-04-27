import { getT } from "@/lib/getT";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="max-w-3xl text-white mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{t.terms.title}</h1>

      <p>{t.terms.intro}</p>

      <h2 className="text-lg font-semibold">
        {t.terms.sections.responsibilities.title}
      </h2>
      <p>{t.terms.sections.responsibilities.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.terms.sections.prohibited.title}
      </h2>
      <p>{t.terms.sections.prohibited.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.terms.sections.content.title}
      </h2>
      <p>{t.terms.sections.content.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.terms.sections.liability.title}
      </h2>
      <p>{t.terms.sections.liability.desc}</p>

      <h2 className="text-lg font-semibold">
        {t.terms.sections.changes.title}
      </h2>
      <p>{t.terms.sections.changes.desc}</p>
    </div>
  );
}