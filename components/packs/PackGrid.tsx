import type { Pack } from "@/types/pack";
import { PackEmpty } from "./PackEmpty";
import { PackItem } from "./PackItem";

interface PackGridProps {
  packs: Pack[];
  onClearFilters?: () => void;
}

/** 1 column on mobile, 2–3 on tablet, 4 on desktop — identical breakpoints to CardGrid. */
export function PackGrid({ packs, onClearFilters }: PackGridProps) {
  if (packs.length === 0) {
    return <PackEmpty onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {packs.map((pack) => (
        <PackItem key={pack.id} pack={pack} />
      ))}
    </div>
  );
}