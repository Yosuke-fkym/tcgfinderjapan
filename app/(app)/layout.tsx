'use client'
import AdminNavbar from "@/components/admin/shops/AdminNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(220deg,#372950_0%,#1e1b2e_50%,#151420_100%)]">
      
      {isAdmin ? <AdminNavbar /> : <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto">
          {children}
          <Toaster />
        </div>
      </main>

      {/* Footer */}
      {!isAdmin && <Footer />}
    </div>
  );
}