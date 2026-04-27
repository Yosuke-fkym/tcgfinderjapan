"use client";
import React from "react";
import {
  BarChart2Icon,
  Home,
  Import,
  ShapesIcon,
} from "lucide-react";
import AdminNavButton from "./AdminNavButton";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

function AdminAsideNav() {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <aside className="w-full xl:w-64 bg-white rounded-xl shadow-sm border p-4 md:p-6 flex flex-col">

      {/* Title */}
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold mb-4 md:mb-6">
        {t.admin.sidebar.title}
      </h2>

      {/* Nav */}
      <nav className="flex xl:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible">

        <AdminNavButton
          icon={Home}
          name={t.admin.sidebar.overview}
          path={`/${locale}/admin`}
          key="overview"
        />

        <AdminNavButton
          icon={ShapesIcon}
          name={t.admin.sidebar.shops}
          path={`/${locale}/admin/shops`}
          key="shops"
        />

        <AdminNavButton
          icon={BarChart2Icon}
          name={t.admin.sidebar.reports}
          path={`/${locale}/admin/reports`}
          key="reports"
        />

        <AdminNavButton
          icon={Import}
          name={t.admin.sidebar.importCsv}
          path={`/${locale}/admin/csv-import`}
          key="csv-import"
        />
      </nav>
    </aside>
  );
}

export default AdminAsideNav;