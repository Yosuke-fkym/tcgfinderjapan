import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface PackPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

/** Mirrors CardPagination's simple prev/next + page-indicator layout. */
export function PackPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PackPaginationProps) {
  const { locale } = useParams();
  const t = getT(locale as string);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        {t.cardPage.pagination.previous}
      </button>

      <span className="text-sm text-stone-500">
        {t.cardPage.pagination.page} {currentPage} {t.cardPage.pagination.of} {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.cardPage.pagination.next}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}