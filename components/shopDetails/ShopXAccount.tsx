"use client";

import { ExternalLink, Twitter } from "lucide-react";

export default function ShopSocials({
  xUrl,
}: {
  xUrl?: string;
}) {
  if (!xUrl) return null;

  return (
    <div className="flex items-center gap-3">
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 transition text-sm"
      >
        <Twitter className="text-black fill-black" size={16} />
        {/* <ExternalLink size={14} className="text-gray-400" /> */}
      </a>
    </div>
  );
}