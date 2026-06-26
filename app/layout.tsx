import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";


const noto_sans_jp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  weight: ['400'],
  preload: true
});


export const metadata:Metadata = {
  verification: {
    google: "gHCyD5HRoztBlUJ-2e6i_LJS_iDaM9WAE94eaU5nkyg",
  },
  title: "Japan Card Shop Map | Find Trading Card Shops Near You",
  description:
    "Explore trading card shops across Japan using an interactive map. Discover Pokémon card stores, filter by area, and find top-rated shops.",

  alternates: {
    canonical: "https://map-card.vercel.app/map",
    languages: {
      en: "https://map-card.vercel.app/map",
    },
  },

  openGraph: {
    title: "Japan Card Shop Map | Find Trading Card Shops Near You",
    description:
      "Explore trading card shops across Japan using an interactive map. Discover Pokémon card stores, filter by area, and find top-rated shops.",
    url: "https://map-card.vercel.app",
    siteName: "TCG Finder Japan",
    locale: "en_US",
    images: [
    {
      url: "https://map-card.vercel.app/og.png",
      width: 1200,
      height: 630,
    },
  ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${noto_sans_jp.className} antialiased`}
      >
        {children}
        <Toaster position="bottom-right"/>
      <GoogleAnalytics gaId="G-62REGN1YQB" />
       <Script
        id="google-adsense"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9123296248060105"
        crossOrigin="anonymous"
      />
      </body>
    </html>
  );
}
