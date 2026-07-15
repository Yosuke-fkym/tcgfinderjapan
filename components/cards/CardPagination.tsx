import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function CardPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: CardPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Card list pagination"
      className="flex items-center justify-center gap-4 pt-2"
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="gap-1.5 rounded-full border-stone-300"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-stone-500" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="gap-1.5 rounded-full border-stone-300"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}