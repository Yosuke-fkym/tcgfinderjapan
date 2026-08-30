import ContactPageComponent from "@/components/contact/ContactPageComponent";
import React from "react";
import shopBg from "@/assets/japan-bg-poster.png";
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
    ? "お問い合わせ | TCG Finder Japan"
    : "Contact Us | TCG Finder Japan";

  const description = isJP
    ? "TCG Finder Japanへのお問い合わせはこちらから。店舗情報の修正や更新、サービスに関するご質問・ご連絡を受け付けています。"
    : "Contact TCG Finder Japan for questions, feedback, shop information updates, corrections, and other inquiries.";

  return {
    title,
    description,

    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        ja: `${baseUrl}/jp/contact`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/contact`,
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

export default async function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 🌆 Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${shopBg.src})` }}
      />

      {/* 🌑 Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 📦 Main Content */}
      <main className="relative z-10 flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <ContactPageComponent />
        </div>
      </main>
    </div>
  );
}
