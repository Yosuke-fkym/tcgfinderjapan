"use client";

import { Shop } from "@/types/types";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import RatingDistribution from "./RatingDistribution";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function ReviewsSection({ shop }: any) {
  const {
    reviews,
    avgSelection,
    avgPrice,
    avgOverall,
    createOrUpdateReview,
    deleteReview,
    isLoading,
    toggleLike
  } = useReviews(shop.shop_id);

  const { locale } = useParams();
  const t = getT(locale as string);

  const [userId, setUserId] = useState<string | undefined>();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [sort, setSort] = useState<"latest" | "high" | "low">("latest");
  const [filter, setFilter] = useState<number | null>(null);

  const myReview = userId ? reviews.find((r) => r.user_id === userId) : null;

  const handleEdit = (review: any) => {
    setEditingReview(review);

    setTimeout(() => {
      document.getElementById("review-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleSubmit = async (
    selection: number,
    price: number,
    comment: string,
    images: string[]
  ) => {
    await createOrUpdateReview(selection, price, comment, images);
    setEditingReview(null);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDelete = async () => {
    setEditingReview(null);
    await deleteReview();
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUserId(data.user?.id);
    };

    getUser();
  }, []);

  const getOverall = (r: any) =>
    r.overall_rating ??
    ((r.selection_rating ?? r.rating ?? 0) +
      (r.price_rating ?? r.rating ?? 0)) / 2;

  const processedReviews = [...reviews]
    .filter((r) => (filter ? Math.round(getOverall(r)) === filter : true))
    .sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
      }
      if (sort === "high") return getOverall(b) - getOverall(a);
      if (sort === "low") return getOverall(a) - getOverall(b);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">
          {t.reviews.section.title}
        </h2>

        {reviews.length > 0 && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Star className="fill-yellow-500 text-yellow-500" size={14} />
            {avgOverall.toFixed(1)} ({reviews.length})
          </p>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex gap-6 items-start">

            <div className="flex flex-col items-center min-w-20">
              <p className="text-3xl font-bold leading-none">
                {avgOverall.toFixed(1)}
              </p>

              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: Math.round(avgOverall) }).map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <div className="text-xs text-muted-foreground flex sm:flex-row flex-col gap-1 items-center mt-1">
                <div>
                {t.reviews.card.productSelection}
                <Star size={12} className="inline mx-0.5 fill-yellow-500 text-yellow-500" />
                {avgSelection.toFixed(1)}
                </div>
                <span className="sm:inline hidden">
                 ・ 
                </span>
                <div>
                {t.reviews.card.price}
                <Star size={12} className="inline mx-0.5 fill-yellow-500 text-yellow-500" />
                {avgPrice.toFixed(1)}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {reviews.length} {t.reviews.section.title}
              </p>
            </div>

            <div className="flex-1">
              <RatingDistribution reviews={reviews} />
            </div>
          </div>
        </div>
      )}

      {!userId ? (
        <div className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <p className="text-sm text-gray-700">
            {t.reviews.section.loginRequired}
          </p>

          <button
            onClick={() => window.location.href = "/auth/login"}
            className="text-sm font-medium text-blue-600"
          >
            {t.auth.login.button}
          </button>
        </div>
      ) : !myReview || editingReview ? (
        <ReviewForm
          onSubmit={handleSubmit}
          initialSelection={editingReview?.selection_rating ?? editingReview?.rating}
          initialPrice={editingReview?.price_rating ?? editingReview?.rating}
          initialComment={editingReview?.comment}
          isEditing={!!editingReview}
          initialImages={editingReview?.photo_url}
          onCancelEdit={handleCancelEdit}
        />
      ) : (
        <div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <p className="text-sm text-gray-700">
            {t.reviews.section.alreadyReviewed}
          </p>

          <button
            onClick={() => handleEdit(myReview)}
            className="text-sm font-medium text-indigo-600"
          >
            {t.reviews.section.editReview}
          </button>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilter(filter === star ? null : star)}
                className={`px-2 py-1 text-xs rounded-full border ${
                  filter === star
                    ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                    : "bg-white text-gray-500"
                }`}
              >
                {star}★
              </button>
            ))}
          </div>

          <Select value={sort} onValueChange={(value) => setSort(value as any)}>
            <SelectTrigger className="w-full max-w-40 text-xs text-white" aria-label={t.reviews.section.sort.placeholder}>
              <SelectValue placeholder={t.reviews.section.sort.placeholder} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="latest">{t.reviews.section.sort.latest}</SelectItem>
              <SelectItem value="high">{t.reviews.section.sort.highest}</SelectItem>
              <SelectItem value="low">{t.reviews.section.sort.lowest}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <ReviewList
        reviews={processedReviews}
        isLoading={isLoading}
        currentUserId={userId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoggedIn={!!userId}
        onLike={toggleLike}
      />
    </div>
  );
}