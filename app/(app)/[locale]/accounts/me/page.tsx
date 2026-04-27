import MyAccountPageComponent from "@/components/account/MyAccountPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: "My Account | TCGFINDERJAPAN",
    description:
      "Manage your favorite card shops and view your browsing history.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/accounts/me`,

      languages: {
        en: `${baseUrl}/en/accounts/me`,
        jp: `${baseUrl}/jp/accounts/me`,
      },
    },
  };
}

export default function MyAccountPage() {
  return <MyAccountPageComponent />;
}