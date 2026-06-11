// components/admin/ArticleForm.tsx
// Shared form used by both Create (/admin/articles/create) and
// Edit (/admin/articles/edit/[slug]) pages. Pass mode="edit" + initialData
// to prefill all fields and switch submission to PATCH.

"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Tag, BookOpen, ImageIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = { id: string; name: string; slug: string };
type Tag      = { id: string; name: string; slug: string };

type ArticleStatus = "draft" | "published";

type FormErrors = Partial<
  Record<"title" | "slug" | "excerpt" | "content" | "category_id", string>
>;

type ExistingThumbnail = { url: string } | null;

type ArticleFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail_url?: string | null;
    category_id: string;
    status: ArticleStatus;
    tag_ids?: string[];
  };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validate(fields: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (!fields.title.trim())     errors.title       = "Title is required.";
  if (!fields.slug.trim())      errors.slug        = "Slug is required.";
  if (!fields.excerpt.trim())   errors.excerpt     = "Excerpt is required.";
  if (!fields.content.trim())   errors.content     = "Content is required.";
  if (!fields.category_id)      errors.category_id = "Category is required.";
  return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArticleForm({ mode = "create", initialData }: ArticleFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "";

  // Form state
  const [title,    setTitle]    = useState(initialData?.title    ?? "");
  const [slug,     setSlug]     = useState(initialData?.slug     ?? "");
  const [excerpt,  setExcerpt]  = useState(initialData?.excerpt  ?? "");
  const [content,  setContent]  = useState(initialData?.content  ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tag_ids ?? []);

  // Slug — only auto-generate in create mode until user edits manually
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  // Thumbnail
  const [newFile,            setNewFile]            = useState<File | null>(null);
  const [preview,            setPreview]            = useState<string | null>(null);
  const [existingThumbnail,  setExistingThumbnail]  = useState<ExistingThumbnail>(
    initialData?.thumbnail_url ? { url: initialData.thumbnail_url } : null
  );

  // Remote data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags,       setTags]       = useState<Tag[]>([]);

  // UI
  const [submitting,    setSubmitting]    = useState<ArticleStatus | null>(null);
  const [categoryOpen,  setCategoryOpen]  = useState(false);
  const [tagOpen,       setTagOpen]       = useState(false);
  const [errors,        setErrors]        = useState<FormErrors>({});

  // ---------------------------------------------------------------------------
  // Load categories + tags (public read — client supabase is fine)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function loadData() {
      const [{ data: catData }, { data: tagData }] = await Promise.all([
        supabase.from("blog_categories").select("id, name, slug").order("name"),
        supabase.from("general_blog_tags").select("id, name, slug").order("name"),
      ]);
      if (catData) setCategories(catData);
      if (tagData) setTags(tagData);
    }
    loadData();
  }, []);

  // Cleanup object URL on unmount
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // ---------------------------------------------------------------------------
  // Slug auto-generation
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!slugManuallyEdited) setSlug(generateSlug(title));
  }, [title, slugManuallyEdited]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  };

  // ---------------------------------------------------------------------------
  // Thumbnail handlers
  // ---------------------------------------------------------------------------

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setNewFile(file);
    setPreview(URL.createObjectURL(file));
    setExistingThumbnail(null);
    e.target.value = "";
  };

  const removeNewFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setNewFile(null);
    setPreview(null);
  };

  const removeExistingThumbnail = () => setExistingThumbnail(null);

  const uploadThumbnail = async (articleId: string): Promise<string | null> => {
    if (!newFile) return null;
    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("articleId", articleId);
    const res = await fetch("/api/admin/articles/thumbnails/upload", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Thumbnail upload failed.");
    return result.url as string;
  };

  // ---------------------------------------------------------------------------
  // Tag toggle
  // ---------------------------------------------------------------------------

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  }, []);

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (submitStatus: ArticleStatus) => {
    const currentErrors = validate({ title, slug, excerpt, content, category_id: categoryId });
    if (Object.keys(currentErrors).length > 0) { setErrors(currentErrors); return; }

    setErrors({});
    setSubmitting(submitStatus);

    try {
      // ── CREATE ──────────────────────────────────────────────────────────────
      if (mode === "create") {
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            thumbnail_url: null,
            category_id: categoryId,
            status: submitStatus,
            tag_ids: selectedTagIds,
          }),
        });

        const result = await res.json();
        if (!res.ok || result.error) throw new Error(result.error || "Something went wrong.");

        const articleId: string = result.article.id;
        if (newFile) await uploadThumbnail(articleId);

        toast.success(
          submitStatus === "published" ? "Article published successfully." : "Article saved as draft."
        );

        router.push(`/${locale}/admin/articles`);
      }

      // ── EDIT ─────────────────────────────────────────────────────────────────
      if (mode === "edit" && initialData?.id) {
        // Determine thumbnail change
        let thumbnailUrl: string | null | undefined = undefined;
        if (newFile) {
          thumbnailUrl = await uploadThumbnail(initialData.id);
        } else if (!existingThumbnail) {
          thumbnailUrl = null; // user removed it
        }
        // undefined = untouched, don't send

        const res = await fetch(`/api/admin/articles/edit/${initialData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: initialData.id,
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
            category_id: categoryId,
            status: submitStatus,
            tag_ids: selectedTagIds,
          }),
        });

        const result = await res.json();
        if (!res.ok || result.error) throw new Error(result.error || "Something went wrong.");

        toast.success("Article updated successfully.");
        router.push(`/${locale}/admin/articles`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save article. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const selectedCategory  = categories.find((c) => c.id === categoryId);
  const selectedTags      = tags.filter((t) => selectedTagIds.includes(t.id));
  const isLoading         = submitting !== null;
  const thumbnailToShow   = preview ?? existingThumbnail?.url ?? null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText size={20} />
            {mode === "edit" ? "Edit Article" : "Create Article"}
          </CardTitle>
          <CardDescription>
            {mode === "edit"
              ? "Update the article details below."
              : "Write and publish a new blog or column article."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-8">

            {/* BASIC INFORMATION */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Basic Information</h3>
              <div className="grid gap-4">

                <div className="grid gap-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pokemon Card Investment Guide"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="pokemon-card-investment-guide"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from the title. You can edit it manually.
                  </p>
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A short summary of the article shown in listings..."
                    rows={3}
                  />
                  {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                </div>

              </div>
            </div>

            {/* THUMBNAIL */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Thumbnail</h3>

              {!thumbnailToShow && (
                <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition">
                  <ImageIcon className="mb-2 text-gray-500" />
                  <p className="font-medium">Click to upload thumbnail</p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP supported</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              {thumbnailToShow && (
                <div className="relative w-full max-w-sm aspect-video rounded-xl border overflow-hidden bg-muted group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailToShow} alt="Thumbnail preview" className="w-full h-full object-cover" />

                  <button
                    type="button"
                    onClick={preview ? removeNewFile : removeExistingThumbnail}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                    aria-label="Remove thumbnail"
                  >
                    <Trash2 size={15} />
                  </button>

                  <label className="absolute bottom-2 right-2 cursor-pointer">
                    <span className="bg-white text-xs font-medium px-2 py-1 rounded shadow hover:bg-gray-50 transition">
                      Replace
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>

                  {preview && (
                    <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                      Not yet saved
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={16} /> Content
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="content">Article Body <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article content here..."
                  rows={16}
                  className="resize-y font-mono text-sm"
                />
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Category</h3>
              <div className="grid gap-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between">
                      {selectedCategory ? selectedCategory.name : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No categories found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categories.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              onSelect={() => { setCategoryId(cat.id); setCategoryOpen(false); }}
                            >
                              {cat.name}
                              {categoryId === cat.id && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
              </div>
            </div>

            {/* TAGS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Tag size={16} /> Tags
              </h3>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <Popover open={tagOpen} onOpenChange={setTagOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between">
                      {selectedTagIds.length > 0
                        ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? "s" : ""} selected`
                        : "Select tags"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {tags.map((tag) => (
                            <CommandItem key={tag.id} onSelect={() => toggleTag(tag.id)}>
                              {tag.name}
                              {selectedTagIds.includes(tag.id) && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(tag.id)}
                          className="ml-1 hover:text-destructive transition-colors"
                          aria-label={`Remove ${tag.name}`}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isLoading}
              >
                {submitting === "draft" ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={isLoading}
              >
                {submitting === "published"
                  ? (mode === "edit" ? "Updating..." : "Publishing...")
                  : (mode === "edit" ? "Update" : "Publish")}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}