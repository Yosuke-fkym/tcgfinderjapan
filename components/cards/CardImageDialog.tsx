"use client";

import { Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CardImageDialogProps {
  src: string;
  name: string;
}

/** Large card image on the detail page; click (or Enter/Space) opens an enlarged view. */
export function CardImageDialog({ src, name }: CardImageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B23A2F]/50"
          aria-label={`Enlarge image of ${name}`}
        >
          <div className="aspect-5/7 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${name} card art`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-sm transition-colors group-hover:bg-[#B23A2F] group-hover:text-white">
            <Expand className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-stone-200 bg-white p-4">
        <DialogTitle className="font-serif text-lg text-stone-900">
          {name} <span className="text-stone-400"></span>
        </DialogTitle>
        <div className="mt-2 max-h-[75vh] w-full overflow-hidden rounded-xl bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${name} card art, enlarged`}
            className="h-full w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}