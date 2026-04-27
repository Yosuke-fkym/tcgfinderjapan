"use client";
import { Review } from "@/types/types";
import ReviewCard from "./ReviewCard";
import ReviewSkeleton from "./ReviewSkeleton";
import { Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { getT } from "@/lib/getT";

export default function ReviewList({
  reviews,
  isLoading,
  currentUserId,
  onEdit,
  onDelete,
  isLoggedIn,
  onLike,
}: any) {
  const router = useRouter();

  const { locale } = useParams();
  const t = getT(locale as string);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = reviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <ReviewSkeleton />
        <ReviewSkeleton />
      </div>
    );
  }

  if (!reviews.length) return null;

  return (
    <div className="relative">
      {/* Blur layer */}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-[3px] bg-white/60 rounded-2xl">
          <Lock className="text-gray-500 mb-2" size={20} />
          <p className="text-sm text-gray-700">
            {t.reviews.list.loginToView}
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-2 text-sm text-indigo-600 hover:underline"
          >
            {t.auth.login.button}
          </button>
        </div>
      )}

      {/* Reviews */}
      <div className={!isLoggedIn ? "pointer-events-none opacity-60" : ""}>
        <div className="space-y-3">
          {paginatedReviews.map((review: any) => (
            <ReviewCard
              currentUserId={currentUserId}
              key={review.id}
              review={review}
              isOwner={review.user_id === currentUserId}
              onEdit={onEdit}
              onLike={onLike}
              onDelete={onDelete}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    page === pageNumber
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}