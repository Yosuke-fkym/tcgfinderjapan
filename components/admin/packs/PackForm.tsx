"use client";

import { useEffect, useRef, useState } from "react";
import { Package, ImageIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getT } from "@/lib/getT";

// NOTE: mirrors CardForm's generateSlug helper 1:1 so slug behaviour
// (auto-generate until manually edited) stays consistent across admin forms.
function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type PackInitialData = {
  id: string;
  slug?: string;
  name_en?: string;
  name_jp?: string;
  image_url?: string | null;
  ebay_url: string;
  mercari_url: string;
  release_date?: string | null;
};

type PackFormProps = {
  initialData?: PackInitialData;
  mode?: "create" | "edit";
};

export default function PackForm({ initialData, mode = "create" }: PackFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ─── Pack Fields ────────────────────────────────────────────────────────────
  const [nameJp, setNameJp] = useState(initialData?.name_jp ?? "");
  const [nameEn, setNameEn] = useState(initialData?.name_en ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [ebayUrl, setEbayUrl] = useState(initialData?.ebay_url ?? "");
  const [mercariUrl, setMercariUrl] = useState(initialData?.mercari_url ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [releaseDate, setReleaseDate] = useState(initialData?.release_date ?? "");

  // ─── Pack Image State (identical pattern to CardForm's image state) ───────
  // imageFile    : the File object the user selected (null if none)
  // imagePreview : a blob URL for the newly selected file — NEVER the DB URL
  // existingImage: the persisted DB URL — never overwritten with a blob URL
  // removeImage  : true when the user wants the current image deleted on save
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(
    initialData?.image_url || null
  );
  const [removeImage, setRemoveImage] = useState(false);

  const imagePreviewUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  // ─── Fetch existing pack in edit mode if only an id was provided ───────────
  // (Mirrors the admin dashboard's usual pattern: the parent page normally
  // fetches via GET /api/admin/packs/[id] and passes the result down as
  // `initialData`. This fallback keeps PackForm self-sufficient if a caller
  // only passes { id, ...} = the id.)
  useEffect(() => {
    if (mode !== "edit" || !initialData?.id) return;
    const alreadyHydrated = initialData.name_en || initialData.name_jp;
    if (alreadyHydrated) return;

    (async () => {
      try {
        const res = await fetch(`/api/admin/packs/${initialData.id}`);
        if (!res.ok) throw new Error();
        const result = await res.json();
        const pack = result.data || result.pack || result;

        setNameJp(pack?.name_jp ?? "");
        setNameEn(pack?.name_en ?? "");
        setSlug(pack?.slug ?? "");
        setReleaseDate(pack?.release_date ?? "");
        setExistingImage(pack?.image_url || null);
        setEbayUrl(pack?.ebay_url ?? "");
        setMercariUrl(pack?.mercari_url ?? "");
      } catch {
        toast.error("パック情報の取得に失敗しました");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData?.id]);

  // ─── Revoke blob URL on unmount to prevent memory leaks ────────────────────
  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  // ─── Auto-generate slug from English name unless manually edited ──────────
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(generateSlug(nameEn));
    }
  }, [nameEn, slugManuallyEdited]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  };

  // ─── Image Handlers (mirrors CardForm's image handlers 1:1) ───────────────
  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    const blobUrl = URL.createObjectURL(file);
    imagePreviewUrlRef.current = blobUrl;
    
    const IMAGE_OPTIONS = {
      maxSizeMB: 1,
      useWebWorker: true
    }
    const compressedFile = await imageCompression(file, IMAGE_OPTIONS)
    setImageFile(compressedFile);
    setImagePreview(blobUrl);

    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }
    setImagePreview(null);
    setImageFile(null);
    setRemoveImage(true);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const resetImageState = () => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
    setRemoveImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // ─── Upload Helper (mirrors CardForm's uploadImage; uploads to the
  // pack-images bucket and the API route writes the public URL onto
  // packs.image_url) ──────────────────────────────────────────────────────
  const uploadImage = async (packId: string) => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("files", imageFile);
    formData.append("packId", packId);

    const res = await fetch("/api/admin/packs/image/upload-to-bucket", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Image upload failed");
    }
  };

// ─── Validation ─────────────────────────────────────────────────────────
  // All fields (name_jp, name_en, slug, release_date, image) are required.
  // A single, user-friendly toast is shown if anything is missing — no
  // per-field toasts, per the spec.
  const validate = () => {
    const missing: string[] = [];

    if (!nameJp.trim()) missing.push("name_jp");
    if (!nameEn.trim()) missing.push("name_en");
    if (!slug.trim()) missing.push("slug");
    if (!releaseDate) missing.push("release_date");
    if(!ebayUrl) missing.push("ebay_url")
    if(!mercariUrl) missing.push("mercari_url")

    // Image is "present" if there's a newly selected file OR an existing
    // DB image that hasn't been marked for removal.
    const hasImage = !removeImage && (!!imageFile || !!existingImage);
    if (!hasImage) missing.push("image");

    if (missing.length > 0) {
      toast.error(t.admin.packForm.toast.validationErrorTitle, {
        description: t.admin.packForm.toast.validationErrorDescription,
      });
      return false;
    }

    return true;
  };

  // ─── Form Submit (mirrors CardForm's handleSubmit ordering: create/update
  // → then dependent uploads → success toast only after everything succeeds) ─
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Guard against double-submits (e.g. rapid double-click) while a save
    // is already in flight.
    if (loading) return;

    if (!validate()) return;

    const body = {
      name_jp: nameJp.trim(),
      name_en: nameEn.trim(),
      slug: slug.trim(),
      release_date: releaseDate || null,
      removeImage,
      mercari_url: mercariUrl,
      ebay_url: ebayUrl

    };

    setLoading(true);

    const endpoint =
      mode === "edit"
        ? `/api/admin/packs/${initialData?.id}`
        : "/api/admin/packs";

    const method = mode === "edit" ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error?.message || t.admin.packForm.toast.saveError);
      }

      const packId = result.pack?.id || result.data?.id || initialData?.id;

      if (imageFile && packId) {
        await uploadImage(packId);
      }

      toast.success(
        mode === "edit"
          ? t.admin.packForm.toast.updateSuccess
          : t.admin.packForm.toast.createSuccess
      );

      if (mode === "create") {
        e.currentTarget.reset();
        setNameJp("");
        setNameEn("");
        setSlug("");
        setEbayUrl("")
        setMercariUrl("")
        setSlugManuallyEdited(false);
        setReleaseDate("");
        resetImageState();
      }
    } catch (err: any) {
      toast.error(err.message || t.admin.packForm.toast.saveError);
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived display values (identical priority order to CardForm's image) ─
  const imageDisplaySrc =
    !removeImage && (imagePreview || existingImage)
      ? imagePreview ?? existingImage
      : null;

  const showRemoveButton = !removeImage && (!!imagePreview || !!existingImage);

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package size={20} />
            {mode === "edit"
              ? t.admin.packForm?.editTitle || "Edit Pack"
              : t.admin.packForm?.createTitle || "Create Pack"}
          </CardTitle>

          <CardDescription>
            {mode === "edit"
              ? t.admin.packForm?.editDesc || "Update this pack's details."
              : t.admin.packForm?.createDesc || "Add a new pack to the database."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* PACK INFO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.admin.packForm.packInfo}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.nameJp || "Japanese Name"}</Label>
                  <Input
                    name="name_jp"
                    value={nameJp}
                    onChange={(e) => setNameJp(e.target.value)}
                    placeholder={
                      t.admin.packForm?.placeholders?.nameJp || "例: スカーレット&バイオレット"
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.nameEn || "English Name"}</Label>
                  <Input
                    name="name_en"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder={t.admin.packForm?.placeholders?.nameEn || "e.g. Scarlet & Violet"}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.slug || "Slug"}</Label>
                  <Input
                    name="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t.admin.packForm?.placeholders?.slug || "scarlet-violet"}
                  />
                  <small>
                    {t.admin.packForm?.slugHelper ||
                      "Auto-generated from the English name until edited manually."}
                  </small>
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.releaseDate || "Release Date"}</Label>
                  <Input
                    type="date"
                    name="release_date"
                    value={releaseDate ?? ""}
                    onChange={(e) => setReleaseDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.ebayUrl || "Ebay URL"}</Label>
                  <Input
                    type="text"
                    name="ebay_url"
                    value={ebayUrl ?? ""}
                    onChange={(e) => setEbayUrl(e.target.value)}
                     placeholder={t.admin.packForm?.placeholders?.ebayUrl || "Ebay URL"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t.admin.packForm?.fields?.mercariUrl || "Mercari URL"}</Label>
                  <Input
                    type="text"
                    name="mercari_url"
                    value={mercariUrl ?? ""}
                    onChange={(e) => setMercariUrl(e.target.value)}
                     placeholder={t.admin.packForm?.placeholders?.mercariUrl || "Mercari URL"}
                  />
                </div>
              </div>
            </div>

            {/* PACK IMAGE */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.packForm?.image?.upload || "Pack Image"}
              </h3>

              <div className="flex items-center gap-6">
                {/* Preview */}
                <div className="relative w-20 h-28 rounded-md border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-muted/30 shrink-0">
                  {imageDisplaySrc ? (
                    <Image
                      src={imageDisplaySrc}
                      alt={t.admin.packForm?.image?.alt || "Pack image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Package size={24} className="text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted transition">
                      <ImageIcon size={14} />
                      {imageDisplaySrc
                        ? t.admin.packForm?.image?.change || "Change Image"
                        : t.admin.packForm?.image?.upload || "Upload Image"}
                    </span>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  <p className="text-xs text-muted-foreground">
                    {t.admin.packForm?.image?.hint || "PNG or JPG, up to a few MB."}
                  </p>

                  {showRemoveButton && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline w-fit"
                    >
                      <Trash size={12} />
                      {t.admin.packForm?.image?.remove || "Remove Image"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t.common.cancel}
              </Button>

              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === "edit"
                    ? t.admin.packForm?.actions?.updating || "Updating..."
                    : t.admin.packForm?.actions?.creating || "Creating..."
                  : mode === "edit"
                  ? t.admin.packForm?.actions?.update || "Update Pack"
                  : t.admin.packForm?.actions?.create || "Create Pack"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}