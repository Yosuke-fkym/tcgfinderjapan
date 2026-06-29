"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link as LinkIcon,
  Link2Off,
  ImagePlus,
  Undo2,
  Redo2,
  AlertCircle,
  Loader2,
  Upload,
  FileCode,
  MousePointerClick,
} from "lucide-react";
import { AffiliateButtonModal } from "./AffiliateButtonModal";
import { AffiliateHtmlModal } from "./AffiliateHTMLModal";


interface ToolbarToggleProps {
  onClick: (pressed: boolean) => void;
  pressed?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

interface ToolbarActionProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  active?: boolean;
}

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  uploadEndpoint?: string;
  minHeight?: number;
  className?: string;
}

// ─── Toolbar Toggle Button ────────────────────────────────────────────────────
function ToolbarToggle({ onClick, pressed, disabled, tooltip, children }: ToolbarToggleProps) {
    
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={pressed}
            onPressedChange={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 p-0 rounded-md",
              "data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
              "hover:bg-muted hover:text-foreground",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Action Button (non-toggle) ───────────────────────────────────────────────
function ToolbarAction({ onClick, disabled, tooltip, children, active }:ToolbarActionProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 p-0 rounded-md",
              active && "bg-primary/10 text-primary",
              "hover:bg-muted hover:text-foreground",
              "disabled:opacity-40"
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Main Editor Component ────────────────────────────────────────────────────
export default function TiptapEditor({
  value = "",
  onChange,
  placeholder,
  uploadEndpoint = "/api/upload-image",
  minHeight = 320,
  className,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAffiliateDialog, setShowAffiliateDialog] = useState(false);
  const [showAffiliateButtonDialog, setShowAffiliateButtonDialog] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-lg max-w-full h-auto my-3 shadow-sm border border-border block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 cursor-pointer",
          rel: "noopener noreferrer",
        },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: cn(
          "outline-none prose prose-sm max-w-none px-5 py-4",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:leading-relaxed prose-p:text-foreground",
          "prose-blockquote:border-l-primary prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-md prose-blockquote:py-1",
          "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
          "prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-hr:border-border"
        ),
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  // ── Image Upload Handler ──────────────────────────────────────────────────
  const handleImageUpload = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setUploadError("Only Image files can be uploaded.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Max Image size should be less than 5MB.");
        return;
      }

      setUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(uploadEndpoint, { method: "POST", body: formData });
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } catch {
        setUploadError("Could not upload image, please try again.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor, uploadEndpoint]
  );

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  // ── Link ──────────────────────────────────────────────────────────────────
  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run();
    } else {
      const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor?.chain().focus().setLink({ href }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  if (!editor) return null;

  const charCount = editor.getText().length;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background shadow-sm overflow-hidden",
        className
      )}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 sticky top-0 z-10">

        {/* Text formatting */}
        <ToolbarToggle
          pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          tooltip="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          tooltip="Inline Code"
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarToggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarToggle
          pressed={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          tooltip="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          tooltip="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          tooltip="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarToggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarToggle
          pressed={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          tooltip="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          tooltip="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          tooltip="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarToggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarToggle
          pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltip="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltip="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarToggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Blocks */}
        <ToolbarToggle
          pressed={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          tooltip="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarToggle
          pressed={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          tooltip="Code Block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolbarToggle>
        <ToolbarAction
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarAction>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link */}
        <ToolbarAction
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkInput((v) => !v);
            }
          }}
          active={editor.isActive("link") || showLinkInput}
          tooltip={editor.isActive("link") ? "Remove Link" : "Add Link"}
        >
          {editor.isActive("link") ? (
            <Link2Off className="h-3.5 w-3.5" />
          ) : (
            <LinkIcon className="h-3.5 w-3.5" />
          )}
        </ToolbarAction>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Image */}
        <ToolbarAction
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          tooltip="Upload Images"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
        </ToolbarAction>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Affiliate HTML + Affiliate Button — grouped together */}
        <ToolbarAction
          onClick={() => setShowAffiliateDialog(true)}
          tooltip="Insert Affiliate HTML"
        >
          <FileCode className="h-3.5 w-3.5" />
        </ToolbarAction>
        <ToolbarAction
          onClick={() => setShowAffiliateButtonDialog(true)}
          tooltip="Insert Affiliate Button"
        >
          <MousePointerClick className="h-3.5 w-3.5" />
        </ToolbarAction>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo / Redo */}
        <ToolbarAction
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarAction>
        <ToolbarAction
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarAction>
      </div>

      {/* ── Link Input Bar ── */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-blue-50 dark:bg-blue-950/30">
          <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <Input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink();
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            className="h-7 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 flex-1"
            autoFocus
          />
          <Button size="sm" className="h-7 px-3 text-xs" onClick={applyLink}>
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* ── Upload Error ── */}
      {uploadError && (
        <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 py-2 px-4">
          <AlertCircle className="h-3.5 w-3.5" />
          <AlertDescription className="text-xs flex items-center justify-between w-full ml-2">
            {uploadError}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs hover:bg-destructive/20"
              onClick={() => setUploadError(null)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Editor Area ── */}
      <div
        className={cn(
          "relative cursor-text transition-colors",
          isDragOver && "bg-primary/5 ring-2 ring-inset ring-primary/30"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => editor.commands.focus()}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-primary/5 pointer-events-none">
            <Upload className="h-8 w-8 text-primary animate-bounce" />
            <p className="text-sm font-medium text-primary">Drop Your Images here</p>
          </div>
        )}

        {/* Upload spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-[2px]">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[11px] h-5 px-1.5 font-normal">
            {charCount} characters
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Drop your images here or{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:underline"
          >
            browse 
          </button>
        </p>
      </div>

      {/* ── Affiliate HTML Dialog ── */}
      <AffiliateHtmlModal
        open={showAffiliateDialog}
        onOpenChange={setShowAffiliateDialog}
        editor={editor}
      />

      {/* ── Affiliate Button Dialog ── */}
      <AffiliateButtonModal
        open={showAffiliateButtonDialog}
        onOpenChange={setShowAffiliateButtonDialog}
        editor={editor}
      />
    </div>
  );
}