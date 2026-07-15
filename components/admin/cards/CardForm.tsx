"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, ImageIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { translations } from "@/lib/i18n";

// NOTE: Replace with the real tag source once shared (likely a DB-backed
// list, similar to how Shop's PRODUCT_TAG_KEYS map to translation keys).
// Kept as a flat string list for now so the multi-select works end to end.
const TAG_OPTIONS = [
  "vintage",
  "psa10",
  "holo",
  "reverse-holo",
  "promo",
  "first-edition",
  "japanese-exclusive",
  "graded",
];

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Article = {
  id: string | number;
  title: string;
};

export default function CardForm({ initialData, mode = "create" }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ─── Card Image State (mirrors Shop's single-icon-upload pattern) ──────────
  // imageFile    : the File object the user selected (null if none)
  // imagePreview : a blob URL for the newly selected file — NEVER the DB URL
  // existingImage: the persisted DB URL — never overwritten with a blob URL
  // removeImage  : true when the user wants the current image deleted on save

  const [cardName, setCardName] = useState(initialData?.card_name ?? "");
const [slug, setSlug] = useState(initialData?.slug ?? "");
const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(
    initialData?.card_image || null
  );
  const [removeImage, setRemoveImage] = useState(false);

  const imagePreviewUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ─── Tags (multi-select, Popover/Command like Shop's Area select) ─────────
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const existing = initialData?.card_product_flags?.map(
      (f: any) => f.product_flags?.name
    ) || [];
    return existing.filter(Boolean);
  });

  // ─── Related Blog (single-select from existing Articles) ──────────────────
  const [articleOpen, setArticleOpen] = useState(false);
  const [articleId, setArticleId] = useState<string>(
    initialData?.article_id ? String(initialData.article_id) : ""
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // ─── Affiliate search keywords (fixed 5 slots) ─────────────────────────────
  const [keywords, setKeywords] = useState<string[]>(() => {
    const existing: string[] = initialData?.affiliate_keywords || [];
    return Array.from({ length: 5 }, (_, i) => existing[i] || "");
  });

  const { locale } = useParams();
  const t = getT(locale as string);
   const PRODUCT_TAG_KEYS = ["vintage", "psa", "box", "pokémon", "onepiece", "cashonly", "dragonball", "cardsaccepted"];
  const activeFlags = selectedTags;

  // ─── Fetch Related Blog options ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/articles`);
        if (!res.ok) throw new Error();
        const result = await res.json();
        setArticles(result.data || result.articles || []);
      } catch {
        // Non-fatal — the related blog field just stays empty if this fails.
      } finally {
        setArticlesLoading(false);
      }
    })();
  }, []);

  // ─── Revoke blob URL on unmount to prevent memory leaks ────────────────────
  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

//   ─── Auto-generate slug from card name unless the user manually edits it ───
  useEffect(() => {
    if (!slugManuallyEdited) {
        setSlug(generateSlug(cardName));
    }
}, [cardName, slugManuallyEdited]);

 const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  };

  // ─── Image Handlers (mirrors Shop's icon handlers 1:1) ─────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    const blobUrl = URL.createObjectURL(file);
    imagePreviewUrlRef.current = blobUrl;

    setImageFile(file);
    setImagePreview(blobUrl);
    // existingImage is NOT touched here — it stays as the DB URL.

    // Selecting a new image implicitly cancels a pending removal.
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

  // ─── Upload Helper (mirrors Shop's uploadIcon; uploads to the card-images
  // bucket and the API route writes the public URL onto cards.card_image) ───
  const uploadImage = async (cardId: string) => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("files", imageFile);
    formData.append("cardId", cardId);

    const res = await fetch("/api/admin/cards/image/upload-to-bucket", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Image upload failed");
    }
  };


  // ─── Keyword Handlers ───────────────────────────────────────────────────────
  const handleKeywordChange = (index: number, value: string) => {
    setKeywords((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // ─── Form Submit (mirrors Shop's handleSubmit ordering: create/update →
  // then dependent uploads → success toast only after everything succeeds) ───
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // const body = {
    //   ...Object.fromEntries(
    //     Array.from(formData.entries()).map(([key, value]) => [key, value])
    //   ),
    //   slug: slug.trim(),
    //   card_number: raw.card_number,
    //   rarity: raw.rarity,
    //   illustrator_name: raw.illustrator_name,
    //   pack_code: raw.pack_code,
    //   article_id: articleId || null,
    //   affiliate_keywords: keywords.filter((k) => k.trim() !== ""),
    //   // removeImage is always included so the backend can act on it. It is
    //   // true only when the user explicitly removed the image and did NOT
    //   // subsequently select a replacement file.
    //   removeImage,
    // };
    const body = {
    ...Object.fromEntries(formData),
    article_id: articleId || null,
    affiliate_keywords: keywords.filter((k) => k.trim() !== ""),
    removeImage
}

    setLoading(true);

    const endpoint =
      mode === "edit"
        ? `/api/admin/cards/${initialData.id}`
        : "/api/admin/cards";

    const method = mode === "edit" ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error?.message || "何か問題が発生しました");
      }

      const cardId = result.card?.id || initialData?.id;

      // Upload image BEFORE showing the success toast — if this throws,
      // the catch block handles it and no success toast appears.
      if (imageFile) {
        await uploadImage(cardId);
      }

      toast.success(
        mode === "edit"
          ? "カードの更新が完了しました"
          : "カードの作成に成功しました"
      );

      if (mode === "create") {
        e.target.reset();
        setSlug("");
        setSlugManuallyEdited(false);
        setSelectedTags([]);
        setArticleId("");
        setKeywords(["", "", "", "", ""]);
        resetImageState();
      }
    } catch (err: any) {
      toast.error(err.message || "カードの保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived display values (identical priority order to Shop's icon) ─────
  const imageDisplaySrc =
    !removeImage && (imagePreview || existingImage)
      ? imagePreview ?? existingImage
      : null;

  const showRemoveButton = !removeImage && (!!imagePreview || !!existingImage);

  const selectedArticle = articles.find((a) => String(a.id) === articleId);

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCard size={20} />
            {mode === "edit"
              ? t.admin.cardForm?.editTitle || "Edit Card"
              : t.admin.cardForm?.createTitle || "Create Card"}
          </CardTitle>

          <CardDescription>
            {mode === "edit"
              ? t.admin.cardForm?.editDesc || "Update this card's details."
              : t.admin.cardForm?.createDesc || "Add a new card to the database."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* CARD INFO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Card Info</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.cardName}</Label>
                 <Input
    name="card_name"
    value={cardName}
    onChange={(e)=>setCardName(e.target.value)}
    placeholder={t.admin.cardForm.placeholders.cardName}
/>
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.slug} </Label>
                  <Input
                    name="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder={t.admin.cardForm.placeholders.slug}
                  />
                  <small>{t.admin.cardForm.slugHelper}</small>
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.cardNumber}</Label>
                  <Input
                    name="card_number"
                    defaultValue={initialData?.card_number}
                    placeholder={t.admin.cardForm.placeholders.cardNumber}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.rarity}</Label>
                  <Input
                    name="rarity"
                    defaultValue={initialData?.rarity}
                    placeholder={t.admin.cardForm.placeholders.rarity}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.illustratorName}</Label>
                  <Input
                    name="illustrator_name"
                    defaultValue={initialData?.illustrator_name}
                    placeholder={t.admin.cardForm.placeholders.illustratorName}
                  />
                </div>
              </div>
            </div>

            {/* PACK INFO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.admin.cardForm.fields.packCode}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.packName}</Label>
                  <Input
                    name="pack_name"
                    defaultValue={initialData?.pack_name}
                    placeholder={t.admin.cardForm.placeholders.packName}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.cardForm.fields.packCode}</Label>
                  <Input
                    name="pack_code"
                    defaultValue={initialData?.pack_code}
                    placeholder={t.admin.cardForm.placeholders.packCode}
                  />
                </div>
              </div>
            </div>

            {/* CARD IMAGE */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.admin.cardForm.image.upload}</h3>

              <div className="flex items-center gap-6">
                {/* Preview */}
                <div className="relative w-20 h-28 rounded-md border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-muted/30 shrink-0">
                  {imageDisplaySrc ? (
                    <Image
                      src={imageDisplaySrc}
                      alt={t.admin.cardForm.image.alt}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <CreditCard size={24} className="text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted transition">
                      <ImageIcon size={14} />
                      {imageDisplaySrc ? t.admin.cardForm.image.change : t.admin.cardForm.image.remove}
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
                    {t.admin.cardForm.image.hint}
                  </p>

                  {showRemoveButton && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline w-fit"
                    >
                      <Trash size={12} />
                      {t.admin.cardForm.image.remove}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TAGS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.productTags}
              </h3>

              <div className="flex gap-6 flex-wrap">
                {PRODUCT_TAG_KEYS.map((key) => {
                  const label = t.admin.shopForm.extras.productTags[
                    key as keyof typeof t.admin.shopForm.extras.productTags
                  ] as keyof typeof t.admin.shopForm.extras.productTags;
                  const englishLabel =
                    translations["en"].admin.shopForm.extras.productTags[
                      key as keyof typeof t.admin.shopForm.extras.productTags
                    ];

                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        name={key}
                        checked={activeFlags.includes(englishLabel)}
                        onCheckedChange={(checked) => {
                          setSelectedTags((prev) => {
                            const next = checked
                              ? [...prev, englishLabel]
                              : prev.filter((item) => item !== englishLabel);
                            return next;
                          });
                        }}
                      />
                      <Label>{label}</Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RELATED BLOG */}
            <div className="grid gap-2">
              <Label>{t.admin.cardForm.sections.relatedBlog}</Label>

              <Popover open={articleOpen} onOpenChange={setArticleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="justify-between"
                  >
                    {articlesLoading
                      ? "Loading articles..."
                      : selectedArticle?.title || "Select an article"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search articles..." />
                    <CommandEmpty>{t.admin.cardForm.relatedBlog.empty}</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {articleId && (
                          <CommandItem onSelect={() => setArticleId("")}>
                            {t.admin.cardForm.relatedBlog.clear}
                          </CommandItem>
                        )}
                        {articles.map((article) => (
                          <CommandItem
                            key={article.id}
                            onSelect={() => {
                              setArticleId(String(article.id));
                              setArticleOpen(false);
                            }}
                          >
                            {article.title}
                            {articleId === String(article.id) && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* AFFILIATE SEARCH KEYWORDS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
               {t.admin.cardForm.sections.affiliateKeywords}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {keywords.map((kw, index) => (
                  <div key={index} className="grid gap-2">
                    <Label>{t.admin.cardForm.fields.keyword} {index + 1}</Label>
                    <Input
                      value={kw}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder={`${t.admin.cardForm.fields.keyword} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t.common.cancel}
              </Button>

              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === "edit"
                    ? t.admin.cardForm.actions.updating
                    : t.admin.cardForm.actions.creating
                  : mode === "edit"
                  ? t.admin.cardForm.actions.update
                  : t.admin.cardForm.actions.create}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}