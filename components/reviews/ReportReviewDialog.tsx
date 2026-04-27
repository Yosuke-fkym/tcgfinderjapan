"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface Props {
  open: boolean;
  shopId: string;
  onOpenChange: (open: boolean) => void;
  reviewId: string;
}

export default function ReportReviewModal({
  open,
  onOpenChange,
  reviewId,
  shopId,
}: Props) {
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { locale } = useParams();
  const t = getT(locale as string);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error(t.reviews.reportModal.selectReason);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/shops/${shopId}/review/${reviewId}/report`, {
        method: "POST",
        body: JSON.stringify({
          review_id: reviewId,
          reason: reason === "other" ? customReason : reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.common.somethingWrong);
      }

      toast.success(t.reviews.reportModal.success);
      onOpenChange(false);

      setReason("");
      setCustomReason("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t.reviews.reportModal.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reason Select */}
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="w-full" aria-label={t.reviews.reportModal.title}>
              <SelectValue placeholder={t.reviews.reportModal.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spam">{t.reviews.reportModal.spam}</SelectItem>
              <SelectItem value="abuse">{t.reviews.reportModal.abuse}</SelectItem>
              <SelectItem value="fake">{t.reviews.reportModal.fake}</SelectItem>
              <SelectItem value="other">{t.reviews.reportModal.other}</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom reason */}
          {reason === "other" && (
            <Textarea
              placeholder={t.reviews.reportModal.other}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {t.common.cancel}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? t.reviews.reportModal.submitting : t.reviews.reportModal.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}