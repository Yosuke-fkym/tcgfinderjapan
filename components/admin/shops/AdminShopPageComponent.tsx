"use client";

import { useEffect, useState } from "react";
import ShopsTable from "@/components/admin/shops/ShopsTable";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function AdminShopsPageComponent() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState<
    "loading" | "ready" | "error" | "empty"
  >("loading");

  const { locale } = useParams();
  const t = getT(locale as string);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/admin/shops");
      if (!res.ok) throw new Error("Failed to fetch shops");

      const data = await res.json();
      setShops(data.data);
      setLoading(data.data.length > 0 ? "ready" : "empty");
    } catch (error) {
      console.error(error);
      setLoading("error");
    }
  };

  if (loading === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="ml-4 text-white">
           {t.admin.shopsPage.loading} <Spinner className="inline mx-0.5"/>
        </p>
      </div>
    );
  }

  if (loading === "empty") {
    return (
      <div className="flex flex-col items-center text-white gap-4 min-h-125 h-125 justify-center">
        <p className="text-gray-500">
          {t.admin.shopsPage.empty}
        </p>
        <a
          href={`/${locale}/admin/shops/create`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.addShop}
        </a>
      </div>
    );
  }

  if (loading === "error") {
    return (
      <div className="flex flex-col items-center gap-4 min-h-125 h-125 justify-center">
        <p className="text-red-500">
          {t.admin.shopsPage.error}
        </p>
        <button
          onClick={fetchShops}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {t.admin.shopsPage.title}
        </h1>

        <a
          href={`/${locale}/admin/shops/create`}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {t.admin.shopsPage.addShop}
        </a>
      </div>

      <ShopsTable shops={shops} refresh={fetchShops} />
    </div>
  );
}