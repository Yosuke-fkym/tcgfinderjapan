import { PackageSearch } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface PackEmptyProps {
  onClearFilters?: () => void;
}

/** Mirrors CardEmpty's empty-state layout: centered icon, message, optional reset action. */
export function PackEmpty({ onClearFilters }: PackEmptyProps) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
        <PackageSearch className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-stone-800">
        {t.packPage.packEmpty.title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">
        {t.packPage.packEmpty.description}
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          {t.packPage.packEmpty.clearFilters}
        </button>
      )}
    </div>
  );
}