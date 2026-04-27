
import AdminDashboardStatsCards from '@/components/admin/shops/AdminDashboardStatsCards'
import AdminRecentShops from '@/components/admin/shops/AdminRecentShops'
import FloatingCreateShopBtn from '@/components/admin/shops/FloatingCreateShopBtn'
import React from 'react'

export default async function AdminPage({params}: {params: Promise<{ locale: string }>}) {
 const { locale } = await params;
  
  return (
    <div>
      <div className='flex flex-col-reverse sm:flex-col'>
      <AdminRecentShops/>
      <AdminDashboardStatsCards locale={locale} />
      </div>
      <FloatingCreateShopBtn/>
    </div>
  )
}
