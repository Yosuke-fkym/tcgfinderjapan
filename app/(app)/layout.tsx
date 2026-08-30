"use client";

import AdminNavbar from "@/components/admin/shops/AdminNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import shopBg from "@/assets/japan-bg-poster.png";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${shopBg.src})` }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {isAdmin ? <AdminNavbar /> : <Navbar />}

        <main className="flex-1">
          <div className="mx-auto">
            {children}
            <Toaster />
          </div>
        </main>

        {!isAdmin && <Footer />}
      </div>
    </div>
  );
}
