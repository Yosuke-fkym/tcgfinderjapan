"use client";

import { getT } from "@/lib/getT";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Compass, Info } from "lucide-react";
import logo from '@/assets/logo.png'

export default function Footer() {
  const { locale } = useParams();
  const pathname = usePathname();
const isBlogPage = pathname.includes("/blog");
const navLocaleParams = isBlogPage ? "en" : locale;
 const navLocale = Array.isArray(navLocaleParams) ? navLocaleParams[0] : navLocaleParams;
   const t = getT((navLocale) || "en");

  return (
    <footer className="relative bg-[#08080b] border-t border-white/10 overflow-hidden">
      {/* subtle top glow, consistent with rest of the site */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[700px] rounded-full bg-indigo-600/[0.06] blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
           <div
          className="flex items-center cursor-pointer group shrink-0"
          // onClick={() => router.push(`/${locale}/blog`)}
        >
          <img
            src={logo.src}
            alt="TCG Finder Japan"
            className="
              w-[145px]
              min-[400px]:w-[165px]
              lg:w-[180px]
              h-auto
              object-contain
              transition-opacity
              group-hover:opacity-85
            "
          />
        </div>
          <p className="text-sm text-white/45 leading-relaxed max-w-xs">
            {t.footer.brand.description}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            {t.footer.explore.title}
          </h3>
          <ul className="space-y-2.5 text-sm text-white/45">
            <li>
              <Link
                href={`/${locale}/map`}
                className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-0.5 will-change-transform"
              >
                {t.footer.explore.map}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/ranking`}
                className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-0.5 will-change-transform"
              >
                {t.footer.explore.rankings}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-0.5 will-change-transform"
              >
                {t.footer.explore.login}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/auth/signup`}
                className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-0.5 will-change-transform"
              >
                {t.footer.explore.signup}
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            {t.footer.info.title}
          </h3>
          <ul className="space-y-2.5 text-sm text-white/45">
            <li>{t.footer.info.international}</li>
            <li>{t.footer.info.updated}</li>
            <li>{t.footer.info.powered}</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/35">
          <p>
            © {new Date().getFullYear()} {t.footer.brand.title}. {t.footer.bottom.rights}
          </p>

          <div className="flex items-center gap-5">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-indigo-400 transition-colors">
              {t.footer.legal.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-indigo-400 transition-colors">
              {t.footer.legal.terms}
            </Link>
            <Link href={`/${locale}/about`} className="hover:text-indigo-400 transition-colors">
              {t.footer.legal.about}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}