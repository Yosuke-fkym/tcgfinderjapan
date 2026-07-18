import type { Rarity } from "@/types/card";
import { cn } from "@/lib/utils";

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
}

/**
 * Rarity is shown as a small circular seal — a nod to the red hanko (印鑑)
 * ink stamps used to authenticate documents in Japan, repurposed here as a
 * card-authenticity mark. Color and label vary by tier.
 */
const RARITY_STYLES: Record<Rarity, { label: string; classes: string }> = {
  MUR: {
    label: "MUR",
    classes: "bg-rose-100 text-rose-700 ring-rose-300",
  },
  FUR: {
    label: "FUR",
    classes: "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-300",
  },
  MA: {
    label: "MA",
    classes: "bg-orange-100 text-orange-700 ring-orange-300",
  },
  BWR: {
    label: "BWR",
    classes: "bg-black text-white ring-gray-500",
  },
  SSR: {
    label: "SSR",
    classes: "bg-yellow-100 text-yellow-800 ring-yellow-400",
  },
  SSS: {
    label: "SSS",
    classes: "bg-amber-100 text-amber-800 ring-amber-500",
  },
  Masterball: {
    label: "MB",
    classes: "bg-purple-100 text-purple-700 ring-purple-300",
  },
  Monsterball: {
    label: "PB",
    classes: "bg-red-100 text-red-700 ring-red-300",
  },
  CSR: {
    label: "CSR",
    classes: "bg-cyan-100 text-cyan-700 ring-cyan-300",
  },
  CHR: {
    label: "CHR",
    classes: "bg-sky-100 text-sky-700 ring-sky-300",
  },
  HR: {
    label: "HR",
    classes: "bg-lime-100 text-lime-700 ring-lime-300",
  },
  RRR: {
    label: "RRR",
    classes: "bg-indigo-100 text-indigo-700 ring-indigo-300",
  },
  K: {
    label: "K",
    classes: "bg-stone-100 text-stone-700 ring-stone-300",
  },
  A: {
    label: "A",
    classes: "bg-emerald-100 text-emerald-700 ring-emerald-300",
  },
  PR: {
    label: "PR",
    classes: "bg-pink-100 text-pink-700 ring-pink-300",
  },
  H: {
    label: "H",
    classes: "bg-teal-100 text-teal-700 ring-teal-300",
  },
  TR: {
    label: "TR",
    classes: "bg-violet-100 text-violet-700 ring-violet-300",
  },
  PROMO: {
    label: "PROMO",
    classes: "bg-slate-100 text-slate-700 ring-slate-300",
  },
};

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const style = RARITY_STYLES[rarity];

  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-full ring-2 text-[11px] font-bold tracking-wide shadow-sm",
        style.classes,
        className
      )}
      title={rarity}
      aria-label={`Rarity: ${rarity}`}
    >
      {style.label}
    </span>
  );
}