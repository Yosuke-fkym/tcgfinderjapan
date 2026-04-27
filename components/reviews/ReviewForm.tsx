"use client";

import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

export default function ReviewForm({
  onSubmit,
  initialSelection = 0,
  initialPrice = 0,
  initialComment = "",
  isEditing,
  initialImages = [],
  onCancelEdit,
}: any) {

  const { locale } = useParams();
  const t = getT(locale as string);

  const [selectionRating, setSelectionRating] = useState(initialSelection);
  const [priceRating, setPriceRating] = useState(initialPrice);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (!isEditing) return;

    setSelectionRating(initialSelection);
    setPriceRating(initialPrice);
    setComment(initialComment);
    setExistingImages(initialImages || []);
    setNewImages([]);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const uploadImages = async () => {
    if (!newImages.length) return [];

    const formData = new FormData();
    newImages.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/admin/shops/review-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || t.common.uploadFailed);
    }

    return data.data;
  };

  const handleSubmit = async () => {
    if (!selectionRating || !priceRating) {
      toast.error(t.reviews.form.errors.ratingRequired);
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = await uploadImages();
      const finalImages = [...existingImages, ...uploadedUrls];

      await onSubmit(selectionRating, priceRating, comment, finalImages);

      toast.success(
        isEditing
          ? t.reviews.form.success.update
          : t.reviews.form.success.create
      );

      if (!isEditing) {
        setSelectionRating(0);
        setPriceRating(0);
        setComment("");
        setExistingImages([]);
        setNewImages([]);
      }
    } catch (err) {
      toast.error(t.reviews.form.errors.uploadFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="review-form"
      className="bg-white rounded-2xl p-4 shadow-sm border space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {isEditing
            ? t.reviews.form.edit
            : t.reviews.form.write}
        </h3>
      </div>

      {/* Selection Rating */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          {t.reviews.form.selectionLabel}
        </p>
        <StarRating value={selectionRating} onChange={setSelectionRating} />
      </div>

      {/* Price Rating */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          {t.reviews.form.priceLabel}
        </p>
        <StarRating value={priceRating} onChange={setPriceRating} />
      </div>

      {/* EXISTING IMAGES */}
      {existingImages.length > 0 && (
        <div className="inline-flex gap-2 flex-wrap">
          {existingImages.map((img, i) => (
            <div key={i} className="relative group">
              <Image
                alt={t.reviews.card.yourReview}
                width={64}
                height={64}
                src={img}
                onClick={() => setPreviewImg(img)}
                className="w-16 h-16 rounded-lg object-cover cursor-pointer"
              />
              <button
                onClick={() =>
                  setExistingImages((prev) =>
                    prev.filter((_, index) => index !== i)
                  )
                }
                className="absolute -top-2 -right-2 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* NEW IMAGES */}
      {newImages.length > 0 && (
        <div className="inline-flex gap-2 ml-2 flex-wrap">
          {newImages.map((file, i) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={i} className="relative group">
                <Image
                  alt={t.reviews.card.yourReview}
                  height={64}
                  width={64}
                  src={url}
                  onClick={() => setPreviewImg(url)}
                  className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                />
                <button
                  onClick={() =>
                    setNewImages((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute -top-2 -right-2 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
        <VisuallyHidden>
          <DialogTitle>{initialComment}</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="w-fit p-0 bg-transparent border-none">
          {previewImg && (
            <Image
              width={500}
              height={400}
              alt={t.reviews.card.yourReview}
              src={previewImg}
              className="max-h-[80vh] rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Comment */}
      <Textarea
        ref={textareaRef}
        placeholder={t.reviews.form.placeholder}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Upload */}
      <div>
        <label className="cursor-pointer flex items-center gap-1 text-sm text-gray-500">
          <Paperclip size={16} />
          {t.reviews.form.addImages}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setNewImages(files);
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex w-full justify-end mt-4 gap-2">
        {isEditing && (
          <Button onClick={onCancelEdit} variant="outline">
            {t.common.cancel}
          </Button>
        )}

        <Button
          className="bg-indigo-600 cursor-pointer hover:bg-indigo-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? isEditing
              ? t.reviews.form.updating
              : t.reviews.form.submitting
            : isEditing
            ? t.reviews.form.update
            : t.reviews.form.submit}
        </Button>
      </div>
    </div>
  );
}