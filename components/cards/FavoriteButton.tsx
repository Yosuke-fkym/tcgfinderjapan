"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  slug: string;
   onRemoved?: () => void;
}

export function FavoriteButton({ slug, onRemoved }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [slug]);

  async function fetchFavoriteStatus() {
    try {
      const res = await fetch(`/api/cards/${slug}/favorite`);

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    if (pending) return;

    const previous = isFavorite;

    if (previous) {
  onRemoved?.();
}

    // optimistic update
    setIsFavorite(!previous);
    setPending(true);

    try {
      const res = await fetch(`/api/cards/${slug}/favorite`, {
        method: previous ? "DELETE" : "POST",
      });

      if (!res.ok) {
        // rollback
        setIsFavorite(previous);

        if (res.status === 401) {
          alert("Please login first.");
          return;
        }

        const error = await res.json();
        alert(error.error ?? "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setIsFavorite(previous);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={loading || pending}
      onClick={toggleFavorite}
      className="h-11 w-11 rounded-full border-stone-300"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 transition-all ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-stone-500 hover:text-red-500"
          }`}
        />
      )}
    </Button>
  );
}