import { createAuthClient } from "@/lib/supabase/serverAuth";
import { ArchiveRestoreIcon, BarChart2, Shapes, User2 } from "lucide-react";
import { getT } from "@/lib/getT";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function AdminDashboardStatsCards({ locale }: { locale: string }) {
  const supabaseClient = await createAuthClient();
  const t = getT(locale);

  const { count } = await supabaseAdmin
    .from("shops")
    .select("*", { count: "exact", head: true });

  const today = new Date().toISOString().split("T")[0];

  const { count: todayCount } = await supabaseAdmin
    .from("shops")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today);

       const { count: reviewCount } = await supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true });

       const { count: usersCount } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true });



  return (
    <div className="mb-3 sm:mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

        {/* TOTAL SHOPS */}
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {t.admin.dashboard.stats.totalShops}
            </p>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mt-1">
              <Shapes className="text-gray-400" size={18} />
              {count || 0}
            </h2>
          </div>
        </div>

        {/* NEW TODAY */}
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {t.admin.dashboard.stats.newShopsToday}
            </p>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mt-1">
              <ArchiveRestoreIcon className="text-gray-400" size={18} />
              {todayCount || 0}
            </h2>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {t.admin.dashboard.stats.reviews}
            </p>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mt-1">
              <BarChart2 className="text-gray-400" size={18} />
              {reviewCount || 0}
            </h2>
          </div>
        </div>

        {/* USERS */}
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {t.admin.dashboard.stats.users}
            </p>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 mt-1">
              <User2 className="text-gray-400" size={18} />
              {usersCount || 0}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardStatsCards;