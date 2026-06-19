// components/admin/ArticleForm.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Tag, BookOpen, ImageIcon, Trash2, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { getT } from "@/lib/getT";
import TiptapEditor from "./TipTapEditor";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = { id: string; name: string; slug: string };
type Tag      = { id: string; name: string; slug: string };

type ArticleStatus = "draft" | "published";

type FormErrors = Partial<
  Record<"title" | "slug" | "excerpt" | "content" | "category_id" | "password_hash", string>
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
    is_featured?: boolean,
    is_protected?: boolean;
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
  is_protected: boolean;
  password_hash: string;
  is_featured: boolean;
  mode: "create" | "edit";
}): FormErrors {
  const errors: FormErrors = {};
  if (!fields.title.trim())     errors.title       = "Title is required.";
  if (!fields.slug.trim())      errors.slug        = "Slug is required.";
  if (!fields.excerpt.trim())   errors.excerpt     = "Excerpt is required.";
  if (!fields.content.replace(/<[^>]*>/g, "").trim()) errors.content = "...";
  if (!fields.category_id)      errors.category_id = "Category is required.";

  // Password required when protection is enabled on create,
  // or when protection is being newly enabled on edit.
  if (fields.is_protected && fields.mode === "create" && !fields.password_hash.trim()) {
    errors.password_hash = "Password is required for protected articles.";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArticleForm({ mode = "create", initialData }: ArticleFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "";

const t = getT(locale as string);

  // Form state
  const [title,      setTitle]      = useState(initialData?.title      ?? "");
  const [slug,       setSlug]       = useState(initialData?.slug       ?? "");
  const [excerpt,    setExcerpt]    = useState(initialData?.excerpt    ?? "");
  const [content,    setContent]    = useState(initialData?.content    ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tag_ids ?? []);

  // Protection state
  const [isProtected,    setIsProtected]    = useState(initialData?.is_protected ?? false);
  const [password,       setPassword]       = useState("");
  const [showPassword,   setShowPassword]   = useState(false);
  // In edit mode: track whether the admin wants to change the password
  const [changePassword, setChangePassword] = useState(false);

  // Slug — only auto-generate in create mode until user edits manually
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  // Thumbnail
  const [newFile,           setNewFile]           = useState<File | null>(null);
  const [preview,           setPreview]           = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<ExistingThumbnail>(
    initialData?.thumbnail_url ? { url: initialData.thumbnail_url } : null
  );

  // Remote data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags,       setTags]       = useState<Tag[]>([]);

  // UI
  const [submitting,   setSubmitting]   = useState<ArticleStatus | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tagOpen,      setTagOpen]      = useState(false);
  const [errors,       setErrors]       = useState<FormErrors>({});

  // ---------------------------------------------------------------------------
  // Load categories + tags
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
  // Protection toggle
  // ---------------------------------------------------------------------------

  const handleProtectionToggle = (checked: boolean) => {
    setIsProtected(checked);
    if (!checked) {
      // Disabling protection — clear password fields
      setPassword("");
      setChangePassword(false);
    }
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
    if (!res.ok || result.error) throw new Error(result.error || t.articleForm.toast.thumbnailUploadError);
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

  const handleFeaturedArticle = (checked: boolean)=> {
    setIsFeatured(checked)
    
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (submitStatus: ArticleStatus) => {
    const currentErrors = validate({
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId,
      is_protected: isProtected,
      password_hash: password,
      mode,
      is_featured: isFeatured
    });

    
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
            is_featured: isFeatured,
            is_protected: isProtected,
            // Only send password if protection is enabled
            ...(isProtected && password.trim() && { password_hash: password.trim() }),
          }),
        });

        const result = await res.json();
        if (!res.ok || result.error) throw new Error(result.error || "Something went wrong.");

        const articleId: string = result.article.id;
        if (newFile) await uploadThumbnail(articleId);

        toast.success(
          submitStatus === "published" ? t.articleForm.toast.publishSuccess : t.articleForm.toast.draftSuccess
        );

        router.push(`/${locale}/admin/articles`);
      }

      // ── EDIT ─────────────────────────────────────────────────────────────────
      if (mode === "edit" && initialData?.id) {
        
        let thumbnailUrl: string | null | undefined = undefined;
        if (newFile) {
          thumbnailUrl = await uploadThumbnail(initialData.id);
        } else if (!existingThumbnail) {
          thumbnailUrl = null;
        }
        

      
    
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
            is_featured: isFeatured,
            status: submitStatus,
            tag_ids: selectedTagIds,
            is_protected: isProtected,
            // Send password only when: protection on AND (create-like or admin chose to change it)
            ...(isProtected && password.trim().length > 1 && { password_hash: password.trim() }),
            // Signal to clear the hash if protection was disabled
            ...(!isProtected && { clear_password: true }),
          }),
        });

        const result = await res.json();
        if (!res.ok || result.error) throw new Error(result.error || t.articleForm.toast.genericError);

        toast.success(t.articleForm.toast.updateSuccess);
        router.push(`/${locale}/admin/articles`);
      }
    } catch (err: any) {
      toast.error(err?.message || t.articleForm.toast.saveError);
    } finally {
      setSubmitting(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedTags     = tags.filter((t) => selectedTagIds.includes(t.id));
  const isLoading        = submitting !== null;
  const thumbnailToShow  = preview ?? existingThumbnail?.url ?? null;

  // In edit mode, password is required only when admin clicks "Change Password"
// ✅ NAYA — sahi
const showPasswordInput =
  isProtected && (mode === "create" || changePassword || !initialData?.is_protected);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText size={20} />
            {mode === "edit" ? t.articleForm.title.edit : t.articleForm.title.create}
          </CardTitle>
          <CardDescription>
            {mode === "edit"
              ? t.articleForm.description.edit
              : t.articleForm.description.create}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-8">

            {/* BASIC INFORMATION */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.articleForm.sections.basicInformation}</h3>
              <div className="grid gap-4">

                <div className="grid gap-2">
                  <Label htmlFor="title">{t.articleForm.labels.title} <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.articleForm.placeholders.title}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">{t.articleForm.labels.slug} <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t.articleForm.placeholders.slug}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.articleForm.messages.slugHelper}
                  </p>
                  {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">{t.articleForm.labels.excerpt} <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder={t.articleForm.placeholders.excerpt}
                    rows={3}
                  />
                  {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                </div>

              </div>
            </div>

            {/* THUMBNAIL */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.articleForm.sections.thumbnail}</h3>

              {!thumbnailToShow && (
                <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition">
                  <ImageIcon className="mb-2 text-gray-500" />
                  <p className="font-medium">{t.articleForm.messages.thumbnailUpload}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.articleForm.messages.thumbnailFormats}</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              {thumbnailToShow && (
                <div className="relative w-full max-w-sm aspect-video rounded-xl border overflow-hidden bg-muted group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailToShow} alt={t.articleForm.thumbnail.previewAlt} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={preview ? removeNewFile : removeExistingThumbnail}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                    aria-label={t.articleForm.thumbnail.remove}
                  >
                    <Trash2 size={15} />
                  </button>
                  <label className="absolute bottom-2 right-2 cursor-pointer">
                    <span className="bg-white text-xs font-medium px-2 py-1 rounded shadow hover:bg-gray-50 transition">
                      {t.articleForm.thumbnail.replace}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {preview && (
                    <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                      {t.articleForm.thumbnail.notSaved}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={16} /> {t.articleForm.sections.content}
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="content">{t.articleForm.labels.articleBody} <span className="text-red-500">*</span></Label>
              <TiptapEditor
              value={content}
              onChange={setContent}
              uploadEndpoint="/api/admin/articles/media/upload"
              placeholder={t.articleForm.placeholders.content}
              minHeight={420}
/>
                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.articleForm.sections.category}</h3>
              <div className="grid gap-2">
                <Label>{t.articleForm.labels.category} <span className="text-red-500">*</span></Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between">
                      {selectedCategory ? selectedCategory.name : t.articleForm.categorySelector.select}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                    <Command>
                      <CommandInput placeholder={t.articleForm.placeholders.searchCategories} />
                      <CommandEmpty>{t.articleForm.messages.noCategories}</CommandEmpty>
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
                <Tag size={16} /> {t.articleForm.sections.tags}
              </h3>
              <div className="grid gap-2">
                <Label>{t.articleForm.labels.tags}</Label>
                <Popover open={tagOpen} onOpenChange={setTagOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between">
                      {selectedTagIds.length > 0
                        ? (t.articleForm.dynamic.tagsSelected(selectedTagIds.length))
                        : t.articleForm.tagsSelector.select}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                    <Command>
                      <CommandInput placeholder={t.articleForm.placeholders.searchTags} />
                      <CommandEmpty>{t.articleForm.messages.noTags}</CommandEmpty>
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
                          aria-label={`${t.articleForm.tagsSelector.remove} ${tag.name}`}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
 <div className="border rounded-xl p-5 space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is-protected" className="font-medium cursor-pointer">
                      Pin this Article as Featured one
                    </Label>
                  </div>
                  <Switch
                    id="is-featured"
                    checked={isFeatured}
                    onCheckedChange={handleFeaturedArticle}
                  />
                </div>
                    </div>

            {/* ── ACCESS PROTECTION ── */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Lock size={16} /> {t.articleForm.sections.accessProtection}
              </h3>

              <div className="border rounded-xl p-5 space-y-4 bg-muted/30">

                {/* Toggle row */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is-protected" className="font-medium cursor-pointer">
                      {t.articleForm.labels.protectedArticle}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.articleForm.messages.passwordProtected}
                    </p>
                  </div>
                  <Switch
                    id="is-protected"
                    checked={isProtected}
                    onCheckedChange={handleProtectionToggle}
                  />
                </div>

                {/* Password fields — only when protection is ON */}
                {isProtected && (
                  <div className="space-y-3 pt-2 border-t border-border">

                    {/* Edit mode: show "change password" option when article already has a password */}
                    {mode === "edit" && initialData?.is_protected && !changePassword && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {t.articleForm.messages.passwordAlreadySet}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setChangePassword(true)}
                        >
                          {t.articleForm.protection.changePassword}
                        </Button>
                      </div>
                    )}

                    {/* Password input: always in create mode, or when changing in edit mode */}
                    {showPasswordInput && (
                      <div className="grid gap-2">
                        <Label htmlFor="article-password">
                          {mode === "edit" ? (t.articleForm.labels.newPassword) : (t.articleForm.labels.password)}
                          <span className="text-red-500"> *</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="article-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.articleForm.placeholders.password}
                            className="pr-10"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword ? (t.articleForm.protection.hidePassword) : (t.articleForm.protection.showPassword)}
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {errors.password_hash && (
                          <p className="text-sm text-red-500">{errors.password_hash}</p>
                        )}
                        {mode === "edit" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-fit text-muted-foreground"
                            onClick={() => { setChangePassword(false); setPassword(""); }}
                          >
                            {t.articleForm.protection.cancelPasswordChange}
                          </Button>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {t.articleForm.messages.passwordStorage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                {t.articleForm.actions.cancel}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isLoading}
              >
                {submitting === "draft" ? (t.articleForm.actions.savingDraft) : (t.articleForm.actions.saveDraft)}
              </Button>

              <Button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={isLoading}
              >
                {submitting === "published"
                  ? (mode === "edit" ? (t.articleForm.actions.updating) : (t.articleForm.actions.publishing))
                  : (mode === "edit" ? (t.articleForm.actions.update) : (t.articleForm.actions.publish))}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}