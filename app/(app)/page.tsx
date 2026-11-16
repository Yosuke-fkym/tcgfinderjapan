// (temporarily commented out) app/page.tsx
// app/page.tsx
// import { redirect } from "next/navigation";


// export default function Home() {
//   redirect("/en/blog");
// }



import BlogListPage from "./[locale]/blog/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | TCG Finder Japan",
  description:
    "Trading card news, store guides, investment insights, and community updates across Japan.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Blog | TCG Finder Japan",
    description:
      "Trading card news, store guides, investment insights, and community updates across Japan.",
    url: "/",
    type: "website",
  },
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default function Home({ searchParams }: Props) {
  return BlogListPage({
    params: Promise.resolve({ locale: "en" }),
    searchParams,
  });
}
