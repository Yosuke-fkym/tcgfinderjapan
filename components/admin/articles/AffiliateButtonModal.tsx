"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface AffiliateButtonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const BUTTON_CLASSES = [
  "inline-flex",
  "items-center",
  "justify-center",
  "rounded-lg",
  "bg-primary",
  "px-5",
  "py-2.5",
  "text-sm",
  "font-medium",
  "text-[white!important]",
  "no-underline",
  "transition-opacity",
  "hover:opacity-90",
  "affiliate-button",
].join(" ");

export function AffiliateButtonModal({
  open,
  onOpenChange,
  editor,
}: AffiliateButtonModalProps) {
    const params = useParams();
  const locale = (params?.locale as string) ?? "";

const t = getT(locale as string);

  const [buttonText, setButtonText] = useState("");
  const [url, setUrl] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);

  const urlError = urlTouched && url.trim() !== "" && !isValidUrl(url.trim());
  const canInsert = buttonText.trim() !== "" && isValidUrl(url.trim());

  const handleInsert = () => {
    if (!canInsert) return;

    const html = `<a href="${url.trim()}" target="_blank" rel="nofollow" class="${BUTTON_CLASSES}">${buttonText.trim()}</a>`;
    editor.chain().focus().insertContent(html).run();

    setButtonText("");
    setUrl("");
    setUrlTouched(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setButtonText("");
    setUrl("");
    setUrlTouched(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> {t.articleForm.contentEditorAffiliateButton.insertAffiliateButton}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {/* Button Text */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="affiliate-button-text">
               {t.articleForm.contentEditorAffiliateButton.buttonText} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="affiliate-button-text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder= {t.articleForm.contentEditorAffiliateButton.buttonTextPlaceholder}
              autoFocus
            />
          </div>

          {/* Destination URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="affiliate-button-url">
               {t.articleForm.contentEditorAffiliateButton.destinationUrl} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="affiliate-button-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder="https://h.accesstrade.net/..."
              className={urlError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {urlError && (
              <p className="text-xs text-destructive"> {t.articleForm.contentEditorAffiliateButton.invalidUrl}</p>
            )}
          </div>

          {/* Preview */}
          {canInsert && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-muted-foreground"> {t.articleForm.contentEditorAffiliateButton.preview}</Label>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-center">
                <span
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white select-none"
                >
                  {buttonText.trim()}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
             {t.articleForm.contentEditorAffiliateButton.cancel}
          </Button>
          <Button onClick={handleInsert} disabled={!canInsert}>
             {t.articleForm.contentEditorAffiliateButton.insert}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}