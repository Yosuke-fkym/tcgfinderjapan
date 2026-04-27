import AdminAsideNav from "@/components/admin/shops/AdminAsideNav";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { getT } from "@/lib/getT";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Admin Dashboard | TCG Finder Japan",
  description: "Admin panel for managing shops, reports, and data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);

  
  return (
    <div className={`${inter.className} min-h-screen `}>
      
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3 p-3">

        <div className="xl:w-64 w-full">
          <AdminAsideNav />
        </div>

        <main className="flex-1 w-full">
          <div className=" rounded-xl shadow-sm px-2 py-4 md:p-0 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>

      <footer className="text-xs text-gray-400 text-center py-4">
        © {new Date().getFullYear()} {t.admin.footer}
      </footer>

      <Toaster />
    </div>
  );
}