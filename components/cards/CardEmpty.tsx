import { Button } from "@/components/ui/button";

interface CardEmptyProps {
  onClearFilters?: () => void;
}

/** Shown when the current search/filter combination matches zero dummy cards. */
export function CardEmpty({ onClearFilters }: CardEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-20 text-center">
      <svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        fill="none"
        aria-hidden="true"
        className="text-stone-300"
      >
        <rect x="14" y="10" width="60" height="68" rx="8" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="44" cy="38" r="12" stroke="currentColor" strokeWidth="2.5" />
        <path d="M53 47L61 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 62H62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-stone-800">No cards found.</p>
        <p className="text-sm text-stone-500">
          Try a different search term or adjust your filters.
        </p>
      </div>

      <Button
        onClick={onClearFilters}
        className="rounded-full bg-[#B23A2F] px-6 text-white hover:bg-[#963026]"
      >
        Clear Filters
      </Button>
    </div>
  );
}