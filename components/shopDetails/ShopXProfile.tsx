"use client";

import { getT } from "@/lib/getT";
import { ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";

// ─── Helper ────────────────────────────────────────────────────────────────

/**
 * Accepts any of these formats and returns a clean handle (no @ prefix):
 *   username | @username | https://x.com/username | https://twitter.com/username
 * Returns null if the input is empty / invalid.
 */
export function sanitizeXUsername(
  raw: string | null | undefined
): string | null {
  if (!raw) return null;

  let cleaned = raw.trim();

  // Strip full URLs
  cleaned = cleaned.replace(
    /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
    ""
  );

  // Strip leading @
  cleaned = cleaned.replace(/^@/, "");

  // Remove any trailing path segments or query strings
  cleaned = cleaned.split("/")[0].split("?")[0];

  // Twitter/X usernames: 1–15 alphanumeric or underscore chars
  return /^[A-Za-z0-9_]{1,15}$/.test(cleaned) ? cleaned : null;
}

// ─── X logo SVG (official mark, monochrome) ────────────────────────────────

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1227"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.163 519.284ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.828Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

interface ShopXProfileCardProps {
  username: string | null | undefined;
  shopName?: string | null;
}

export default function ShopXProfile({
  username,
  shopName,
}: ShopXProfileCardProps) {
  const { locale } = useParams();
const t = getT(locale as string);
  const cleanUsername = sanitizeXUsername(username);
  if (!cleanUsername) return null;

  const profileUrl = `https://x.com/${cleanUsername}`;
  const displayName = shopName?.trim() || null;

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open @${cleanUsername} on X`}
      className="
        group block w-full
        rounded-xl border border-white/10
        bg-white/[0.03]
        px-5 py-4
        transition-all duration-200
        hover:border-white/20 hover:bg-white/[0.06]
        hover:shadow-[0_0_24px_0_rgba(139,92,246,0.12)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
      "
    >
      {/* Top row: X logo + label */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="
            flex items-center justify-center
            w-7 h-7 rounded-md
            bg-white/10
            text-white/80
            flex-shrink-0
          "
        >
          <XLogo className="w-3.5 h-3.5" />
        </span>
        <span className="text-[11px] font-semibold tracking-widest text-white/40 uppercase">
          {t.shopDetails.xProfile.title}
        </span>
      </div>

      {/* Supporting text */}
      <p className="text-sm text-white/55 leading-snug mb-3.5">
        {displayName ? (
          <>
            Follow the latest from{" "}
            <span className="text-white/80 font-medium">{displayName}</span> on
            X.
          </>
        ) : (
          t.shopDetails.xProfile.description
        )}
      </p>

      {/* Handle + CTA row */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-mono font-medium text-violet-300/90 tracking-tight">
          @{cleanUsername}
        </span>

        <span
          className="
            inline-flex items-center gap-1.5
            px-3 py-1.5
            rounded-lg
            text-xs font-semibold
            bg-white/10 text-white/75
            border border-white/10
            transition-all duration-150
            group-hover:bg-violet-600/70 group-hover:text-white group-hover:border-violet-500/60
          "
        >
          {t.shopDetails.xProfile.openOnX}
          <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
        </span>
      </div>
    </a>
  );
}