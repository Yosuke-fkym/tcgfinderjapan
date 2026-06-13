"use client";

// app/[locale]/blog/CategoryFilter.tsx
// Client component: renders the shadcn Select and pushes ?category= into the URL.

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export type CategoryOption = {
  slug: string;
  name: string;
};

type Props = {
  categories: CategoryOption[];
  /** The slug currently active, or undefined / "" for "all". */
  selectedSlug?: string;
  /** Localised label strings so the component stays locale-agnostic. */
  labels: {
    all: string;       // e.g. "All Categories" / "全カテゴリー"
    placeholder: string; // e.g. "Category" / "カテゴリー"
  };
};

export function CategoryFilter({ categories, selectedSlug, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    const params = new URLSearchParams();
    if (value && value !== "__all__") {
      params.set("category", value);
    }
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  const currentValue = selectedSlug || "__all__";

  return (
    <div className="flex items-center gap-3">
      {/* Subtle label — matches the eyebrow typography used in the hero */}
      <span
        className="hidden sm:block text-[0.68rem] font-semibold tracking-[0.1em]
                   uppercase text-stone-400 whitespace-nowrap"
        aria-hidden="true"
      >
        {labels.placeholder}
      </span>

      <Select value={currentValue} onValueChange={handleChange} disabled={isPending}>
        {/*
          Trigger: matches the existing stone palette.
          h-9 keeps it compact so it doesn't compete with the article grid.
        */}
        <SelectTrigger
          className="
            h-9 min-w-[200px] max-w-[260px]
            bg-white border border-stone-200 text-stone-700
            text-sm font-medium rounded-md shadow-none
            hover:border-stone-400 hover:bg-stone-50
            focus:ring-1 focus:ring-amber-500 focus:border-amber-500
            data-[placeholder]:text-stone-400
            transition-colors
          "
          aria-label={labels.placeholder}
        >
          <SelectValue placeholder={labels.all} />
        </SelectTrigger>

        <SelectContent
          className="
            bg-white border border-stone-200 shadow-md rounded-md
            text-sm text-stone-700
          "
        >
          {/* "All" sentinel value */}
          <SelectItem
            value="__all__"
            className="
              cursor-pointer
              focus:bg-amber-50 focus:text-stone-900
              data-[state=checked]:font-semibold data-[state=checked]:text-amber-700
            "
          >
            {labels.all}
          </SelectItem>

          {categories.map((cat) => (
            <SelectItem
              key={cat.slug}
              value={cat.slug}
              className="
                cursor-pointer
                focus:bg-amber-50 focus:text-stone-900
                data-[state=checked]:font-semibold data-[state=checked]:text-amber-700
              "
            >
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Spinner-free pending state: subtle opacity shift on the trigger covers it */}
      {isPending && (
        <span className="sr-only" role="status" aria-live="polite">
          Loading articles…
        </span>
      )}
    </div>
  );
}