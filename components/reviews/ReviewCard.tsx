"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/types/types";
import { Star, MoreVertical, ThumbsUp, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteReviewDialog from "./DeleteReviewDialog";
import ReportReviewModal from "./ReportReviewDialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

interface Props {
  review: Review;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: () => void;
  currentUserId?: string;
  onLike: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  isOwner,
  onEdit,
  currentUserId,
  onDelete,
  onLike,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const likeCount = review.likeCount ?? 0;
  const likedByMe = review.likedByMe ?? false;
  const selection = review.selection_rating ?? review.rating ?? 0;
  const price = review.price_rating ?? review.rating ?? 0;
  const overall = (selection + price) / 2;

  return (
    <>
      <div
        className={`border rounded-2xl p-4 shadow-sm bg-white transition hover:shadow-md ${
          isOwner ? "border-blue-400 bg-blue-50/30" : ""
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {review.user?.name?.slice(0, 2)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium text-sm">
                {isOwner ? t.reviews.card.yourReview : review.user?.name}
              </p>

              <p className="text-xs text-gray-500 flex items-center flex-wrap gap-1">

                {/* Overall */}
                <span className="flex">
                  {Array.from({ length: Math.round(overall) }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </span>

                <span>•</span>

                {/* Breakdown */}
                <span>
                  {t.reviews.card.productSelection} {selection}★
                </span>
                <span>
                  {t.reviews.card.price} {price}★
                </span>

                <span>•</span>

                {new Date(review.posted_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {!isOwner && currentUserId !== review.user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1" aria-label={''}>
                <MoreVertical size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setReportOpen(true)}>
                  {t.reviews.card.report}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1">
                <MoreVertical size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(review)}>
                  {t.reviews.card.edit}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setReportOpen(true)}>
                  {t.reviews.card.report}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setOpen(true)}
                >
                  {t.reviews.card.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* CONTENT */}
        <div className="ml-11">
          {review.is_flagged ? (
            <div className="relative">
              <p className="text-sm text-gray-500 blur-sm select-none">
                   {review.comment}
              </p>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {t.reviews.card.underReview}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700">{
               review.comment
            }</p>
          )}

          {/* IMAGES */}
          {review.photo_url?.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {review.photo_url.map((img: string, i: number) => (
                <div
                  key={i}
                  className="w-20 h-20 overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={t.reviews.card.yourReview}
                    height={80}
                    width={80}
                    onClick={() => setPreviewImg(img)}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LIKE */}
        <div className="flex items-center gap-2 mt-3 ml-11">
          <button
            onClick={() => onLike(review.id)}
            className={`text-xs flex items-center gap-1 transition-all duration-200 ${
              likedByMe
                ? "text-blue-600 scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <ThumbsUp
              size={14}
              className={likedByMe ? "fill-blue-600" : ""}
            />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <VisuallyHidden>
          <DialogTitle>{review.comment}</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="max-w-[none!important] w-fit p-0 bg-transparent border-none shadow-md">
          <div className="relative flex items-center justify-center">
            {previewImg && (
              <Image
                alt={t.reviews.card.yourReview}
                height={300}
                width={500}
                src={previewImg}
                className="rounded-xl shadow-xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteReviewDialog
        open={open}
        setOpen={setOpen}
        onConfirm={onDelete!}
      />

      <ReportReviewModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        reviewId={review.id}
        shopId={review.shop_id}
      />
    </>
  );
}