import SignupPageComponent from "@/components/auth/SignupPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { locale } = await params;
  const isJP = locale === "jp";

  return {
    title: "Sign Up | TCG Finder Japan",
    description:
      "Create an account to save your favorite card shops, post reviews, and explore trading card stores across Japan.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/auth/signup`,
      languages: {
        en: `${baseUrl}/en/auth/signup`,
        jp: `${baseUrl}/jp/auth/signup`,
      },
    },

    openGraph: {
      title: "Sign Up | TCG Finder Japan",
      description:
        "Create an account to save your favorite card shops, post reviews, and explore trading card stores across Japan.",
      url: `${baseUrl}/${locale}/auth/signup`,
      siteName: "TCG Finder Japan",
      locale: isJP ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default function SignupPage() {
  return <SignupPageComponent />;
}