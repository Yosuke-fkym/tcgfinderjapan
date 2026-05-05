"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";


export default function RankingLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user?.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">loading <Spinner className="inline-flex mx-0.5"/></div>;
  }

  return (
    <div className="mx-auto pb-10 pt-4">
      <div className="max-w-6xl px-4 sm:px-10">
        <div className="flex items-center justify-between mb-4">
          
          {/* Back Button */}
          <button
            onClick={() => router.push('map')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
           Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-10 flex justify-center items-center mt-8 gap-6">
        {/* Content */}
        <div className="md:col-span-3">
          <Card className="p-3 sm:p-6">{children}</Card>
        </div>
      </div>
    </div>
  );
}