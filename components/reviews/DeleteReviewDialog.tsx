"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteReviewDialog({
  open,
  setOpen,
  onConfirm,
}: Props) {
  const { locale } = useParams();
  const t = getT(locale as string);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t.reviews.deleteDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.reviews.deleteDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {t.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              toast.success(t.reviews.deleteDialog.success);
              setOpen(false);
            }}
          >
            {t.reviews.deleteDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}