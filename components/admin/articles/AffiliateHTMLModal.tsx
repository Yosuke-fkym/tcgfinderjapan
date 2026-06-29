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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface AffiliateHtmlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor;
}

export function AffiliateHtmlModal({
  open,
  onOpenChange,
  editor,
}: AffiliateHtmlModalProps) {
  const [html, setHtml] = useState("");
  const params = useParams();
    const locale = (params?.locale as string) ?? "";
  
  const t = getT(locale as string);
  
  const handleInsert = () => {
    if (!html.trim()) return;
    editor.chain().focus().insertContent(html).run();
    setHtml("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setHtml("");
    onOpenChange(false);
  };

  const isEmpty = !html.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.articleForm.contentEditorAffiliateHTML.insertAffiliateHtml}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-1">
          <Label htmlFor="affiliate-html" className="text-sm text-muted-foreground">
            {t.articleForm.contentEditorAffiliateHTML.affiliateHtmlDescription}
          </Label>
          <Textarea
            id="affiliate-html"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder={`<a href="https://...">\n  <img src="https://..." width="1" height="1" border="0" alt="" />\n</a>`}
            className="font-mono text-xs min-h-[160px] resize-y"
            autoFocus
            spellCheck={false}
          />
          {isEmpty && html !== "" && (
            <p className="text-xs text-destructive">{t.articleForm.contentEditorAffiliateHTML.affiliateHtmlRequired}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            {t.articleForm.contentEditorAffiliateButton.cancel}
                      </Button>
          <Button onClick={handleInsert} disabled={isEmpty}>
             {t.articleForm.contentEditorAffiliateButton.insert}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}