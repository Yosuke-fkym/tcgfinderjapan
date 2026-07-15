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
  C: {
    label: "C",
    classes: "bg-stone-100 text-stone-600 ring-stone-300",
  },

  U: {
    label: "U",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  },

  R: {
    label: "R",
    classes: "bg-sky-50 text-sky-700 ring-sky-300",
  },

  RR: {
    label: "RR",
    classes: "bg-indigo-50 text-indigo-700 ring-indigo-300",
  },

  AR: {
    label: "AR",
    classes: "bg-violet-50 text-violet-700 ring-violet-300",
  },

  SR: {
    label: "SR",
    classes: "bg-amber-50 text-amber-800 ring-amber-400",
  },

  SAR: {
    label: "SAR",
    classes: "bg-[#FBEAE7] text-[#B23A2F] ring-[#B23A2F]/50",
  },

  UR: {
    label: "UR",
    classes: "bg-yellow-50 text-yellow-700 ring-yellow-400",
  },

  "ACE SPEC": {
    label: "ACE",
    classes: "bg-cyan-50 text-cyan-700 ring-cyan-300",
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