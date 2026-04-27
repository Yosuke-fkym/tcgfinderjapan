"use client";

import { useEffect, useState } from "react";
import { Review } from "@/types/types";

export function useReviews(shopId: string) {
  
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likingIds, setLikingIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 🔐 get user
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setCurrentUserId(data.user?.id || null);
      } catch {
        setCurrentUserId(null);
      }
    };
    getUser();
  }, []);

  // 📥 fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/shops/${shopId}/review`);
      const json = await res.json();

// 🔥 handle both cases safely
const reviewsArray = Array.isArray(json)
  ? json
  : Array.isArray(json?.data)
  ? json.data
  : [];

const formatted = reviewsArray.map((r: any) => {
        const selection = r.selection_rating ?? r.rating ?? 0;
        const price = r.price_rating ?? r.rating ?? 0;

        return {
          ...r,
          overall_rating: (selection + price) / 2,
          likeCount: r.review_likes?.length || 0,
          likedByMe:
            r.review_likes?.some(
              (l: any) => l.user_id === currentUserId
            ) || false,
        };
      });

      setReviews(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✍️ create/update
  const createOrUpdateReview = async (
    selection: number,
    price: number,
    comment: string,
    images: string[]
  ) => {
    await fetch(`/api/shops/${shopId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selection_rating: selection,
        price_rating: price,
        comment,
        photo_url: images,
      }),
    });

    await fetchReviews();
  };

  // 🗑 delete
  const deleteReview = async () => {
    await fetch(`/api/shops/${shopId}/review`, {
      method: "DELETE",
    });
    await fetchReviews();
  };

  // 👍 like
  const toggleLike = async (reviewId: string) => {
    if (likingIds.includes(reviewId)) return;

    setLikingIds((prev) => [...prev, reviewId]);

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const liked = !r.likedByMe;
        return {
          ...r,
          likedByMe: liked,
          likeCount: liked
            ? (r.likeCount || 0) + 1
            : Math.max((r.likeCount || 1) - 1, 0),
        };
      })
    );

    try {
      await fetch(`/api/shops/${shopId}/review/${reviewId}/like`, {
        method: "POST",
      });
    } catch {
      fetchReviews(); // rollback safe
    } finally {
      setLikingIds((prev) =>
        prev.filter((id) => id !== reviewId)
      );
    }
  };

  // 🔥 AVG CALCULATIONS
  const avgSelection =
    reviews.reduce(
      (acc, r) => acc + (r.selection_rating ?? r.rating ?? 0),
      0
    ) / (reviews.length || 1);

  const avgPrice =
    reviews.reduce(
      (acc, r) => acc + (r.price_rating ?? r.rating ?? 0),
      0
    ) / (reviews.length || 1);

  const avgOverall = (avgSelection + avgPrice) / 2;

  useEffect(() => {
    if (shopId && currentUserId !== null) {
      fetchReviews();
    }
  }, [shopId, currentUserId]);

  return {
    reviews,
    isLoading,
    fetchReviews,
    createOrUpdateReview,
    deleteReview,
    toggleLike,
    currentUserId,
    likingIds,

    // 🔥 NEW
    avgSelection,
    avgPrice,
    avgOverall,
  };
}