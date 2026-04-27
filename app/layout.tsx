import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


const noto_sans_jp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  weight: ['400'],
  preload: true
});


export const metadata:Metadata = {
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
      </body>
    </html>
  );
}
