export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <div lang={locale === "jp" ? "ja" : "en"}>{children}</div>;
}
