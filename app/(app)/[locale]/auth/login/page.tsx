import LoginPageComponent from "@/components/auth/LoginPageComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isJP = locale === "jp";

  return {
    title: "Login | TCG Finder Japan",
    description:
      "Log in to your account to manage your favorite card shops and view your activity.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${baseUrl}/${locale}/auth/login`,
      languages: {
        en: `${baseUrl}/en/auth/login`,
        jp: `${baseUrl}/jp/auth/login`,
      },
    },

    openGraph: {
      title: "Login | TCG Finder Japan",
      description:
        "Log in to your account to manage your favorite card shops and view your activity.",
      url: `${baseUrl}/${locale}/auth/login`,
      siteName: "TCG Finder Japan",
      locale: isJP ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default function LoginPage() {
  return <LoginPageComponent />;
}