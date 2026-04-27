import { Toaster } from "sonner";
import shopBg from  "@/assets/japan-bg-poster.png"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {children}
          <Toaster />
        </div>
      </main>
    </div>
  );
}