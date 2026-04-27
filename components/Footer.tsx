"use client";

import { getT } from "@/lib/getT";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Footer() {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <footer className="bg-black border-t-[0.5px] border-t-[#ffffff42]">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* 🧭 Brand */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-600">
            {t.footer.brand.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.footer.brand.description}
          </p>
        </div>

        {/* 🔗 Navigation */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">
            {t.footer.explore.title}
          </h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <Link href={`/${locale}`} className="hover:text-gray-400">
                {t.footer.explore.map}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/ranking`} className="hover:text-gray-400">
                {t.footer.explore.rankings}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/auth/login`} className="hover:text-gray-400">
                {t.footer.explore.login}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/auth/signup`} className="hover:text-gray-400">
                {t.footer.explore.signup}
              </Link>
            </li>
          </ul>
        </div>

        {/* 🌍 Info */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            {t.footer.info.title}
          </h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <span>{t.footer.info.international}</span>
            </li>
            <li>
              <span>{t.footer.info.updated}</span>
            </li>
            <li>
              <span>{t.footer.info.powered}</span>
            </li>

            {/* 🔥 Legal links */}
            <li className="pt-2">
              <Link href={`/${locale}/privacy-policy`} className="hover:text-gray-400">
                {t.footer.legal.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className="hover:text-gray-400">
                {t.footer.legal.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 🔻 Bottom */}
      <div className="border-t-[0.5px] border-t-[#ffffff42] text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} {t.footer.brand.title}. {t.footer.bottom.rights}
      </div>
    </footer>
  );
}