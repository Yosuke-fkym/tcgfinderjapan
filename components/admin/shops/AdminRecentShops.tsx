"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, MapPin, Eye, Clock, Building2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { Shop } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";
import { getT } from "@/lib/getT";

function AdminRecentShops() {
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  const [recentShops, setRecentShops] = useState<Shop[]>([]);
  const [stats, setStats] = useState({ opened: 0, closed: 0 });
  const [loadingState, setLoadingState] = useState<
    "ready" | "loading" | "error" | "empty"
  >("loading");

  useEffect(() => {
    fetchRecentShops();
  }, []);

  const fetchRecentShops = async () => {
    try {
      const response = await fetch("/api/admin/shops/recent");

      if (!response.ok) {
        setLoadingState("error");
        return;
      }

      const data = await response.json();

      if (data.error) {
        setLoadingState("error");
        return;
      }

      if (data.count === 0) {
        setLoadingState("empty");
        return;
      }

      setRecentShops(data.data);
      setStats(data.stats);
      setLoadingState("ready");
    } catch (error) {
      setLoadingState("error");
      console.error("Error fetching recent shops:", error);
    }
  };

  return (
    <div className="bg-white shadow-sm border rounded-xl p-4 sm:p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  
  {/* LEFT */}
  <div className="flex items-center gap-3">
    <Store className="text-indigo-600 shrink-0" size={22} />

    <div>
      <h1 className="text-base sm:text-lg md:text-xl xl:text-2xl font-semibold text-gray-800">
        {t.admin.recentShops.title}
      </h1>
      <p className="text-xs sm:text-sm xl:text-base text-gray-500">
        {t.admin.recentShops.subtitle}
      </p>
    </div>
  </div>

  {/* RIGHT - STATS */}
  <div className="flex gap-4 justify-center sm:gap-6">
    
    <div className="flex flex-col items-center sm:items-end">
      <span className="text-green-500 font-semibold text-base sm:text-lg xl:text-2xl">
        {stats.opened}
      </span>
      <span className="text-[10px] sm:text-xs uppercase text-gray-500">
        {t.admin.recentShops.stats.openToday}
      </span>
    </div>

    <div className="flex flex-col items-center sm:items-end">
      <span className="text-red-500 font-semibold text-base sm:text-lg xl:text-2xl">
        {stats.closed}
      </span>
      <span className="text-[10px] sm:text-xs uppercase text-gray-500">
        {t.admin.recentShops.stats.closedToday}
      </span>
    </div>

  </div>
</div>

      {loadingState === "loading" && (
        <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
          {t.common.loading} <Spinner />
        </div>
      )}

      {loadingState === "error" && (
        <div className="text-center py-12 text-red-500">
          {t.admin.recentShops.states.error}
        </div>
      )}

      {loadingState === "empty" && (
        <div className="text-center w-fit mx-auto py-12 text-gray-500">
          <Building2 className="inline-flex" /> {t.admin.recentShops.states.emptyTitle}
          <br />
           {t.admin.recentShops.states.emptyDesc}
        </div>
      )}

      {loadingState === "ready" && (
  <>
    {/* 🖥️ Desktop Table */}
    <div className="hidden md:block w-full overflow-x-auto scrollbar-thin rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-80 text-gray-600">{t.admin.recentShops.table.shop}</TableHead>
            <TableHead className="text-gray-600">{t.admin.recentShops.table.address}</TableHead>
            <TableHead className="text-gray-600">{t.admin.recentShops.table.reviews}</TableHead>
            <TableHead className="text-gray-600">{t.admin.recentShops.table.createdAt}</TableHead>
            <TableHead className="text-right text-gray-600">{t.admin.recentShops.table.actions}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {recentShops.map((shop: Shop) => (
            <TableRow key={shop.shop_id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store size={16} className="text-gray-500" />
                    {shop.shop_name}
                  </div>

                  {shop.business_hours && isShopOpen(shop) ? (
                    <Badge className="bg-green-50 text-green-700">{t.admin.recentShops.table.open}</Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700">{t.admin.recentShops.table.closed}</Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {shop.shop_address || t.admin.recentShops.table.unknown}
                </div>
              </TableCell>

              <TableCell>{shop.reviews[0]?.count as unknown as any || 0}</TableCell>

              <TableCell className="text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(shop.created_at).toLocaleDateString()}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <button
                  onClick={() => router.push(`/shop/${shop.shop_id}`)}
                  className="flex ml-auto items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-md transition"
                >
                  <Eye size={14} />
                  {t.admin.recentShops.actions.view}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* 📱 Mobile Cards */}
    <div className="md:hidden space-y-4">
      {recentShops.map((shop: Shop) => (
        <div
          key={shop.shop_id}
          className="border rounded-xl p-4 shadow-sm bg-white space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="font-medium text-gray-800 flex items-center gap-2">
              <Store size={16} />
              {shop.shop_name}
            </div>

            {shop.business_hours && isShopOpen(shop) ? (
              <Badge className="bg-green-50 text-green-700">{t.admin.recentShops.table.open}</Badge>
            ) : (
              <Badge className="bg-red-50 text-red-700">{t.admin.recentShops.table.closed}</Badge>
            )}
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin size={14} />
            {shop.shop_address || t.admin.recentShops.table.unknown}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Clock size={14} />
            {new Date(shop.created_at).toLocaleDateString()}
          </div>

          <button
            onClick={() => router.push(`/shop/${shop.shop_id}`)}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-md transition"
          >
            <Eye size={14} />
            {t.admin.recentShops.actions.viewDetails}
          </button>
        </div>
      ))}
    </div>
  </>
)}
    </div>
  );
}

export default AdminRecentShops;