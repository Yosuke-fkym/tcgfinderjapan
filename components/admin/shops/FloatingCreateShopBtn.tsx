'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getT } from '@/lib/getT';

function FloatingCreateShopBtn() {
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  const handleClick = () => {
   router.push(`/${locale}/admin/shops/create`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={t.admin.shopsPage.addShop}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

export default FloatingCreateShopBtn;