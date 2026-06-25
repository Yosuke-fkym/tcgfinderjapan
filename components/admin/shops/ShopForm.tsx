"use client";

import { useEffect, useRef, useState } from "react";
import { Store, MapPin, Globe, Trash2 } from "lucide-react";
import { ImageIcon, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { ShopVideo } from "@/types/types";
import Image from "next/image";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";
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
import { AREA_MATCH, AREA_OPTIONS } from "@/lib/helpers/areas";

export type BusinessHoursType = Record<
  string,
  { open: string; close: string; closed: boolean }
>;

export type HolidayHoursType = {
  open: string;
  close: string;
};

export default function ShopForm({ initialData, mode = "create" }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>(
    initialData?.shop_photos || []
  );
  const [holidayHours, setHolidayHours] = useState<HolidayHoursType>({
    open: "",
    close: "",
  });
  const [reels, setReels] = useState<string[]>(
    initialData?.shopVideos?.map((v: ShopVideo) => v.videoUrl) || [""]
  );
  const [areaOpen, setAreaOpen] = useState(false);
  const [area, setArea] = useState(initialData?.area || "");
  

  // ─── Shop Icon State ────────────────────────────────────────────────────────
  // iconFile   : the File object the user selected (null if none)
  // iconPreview: a blob URL for the newly selected file — NEVER the DB URL
  // existingIcon: the persisted DB URL — never overwritten with a blob URL
  // removeIcon : true when the user wants the current icon deleted on save
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [existingIcon, setExistingIcon] = useState<string | null>(
    initialData?.shop_icon_url || null
  );
  const [removeIcon, setRemoveIcon] = useState(false);

  // Ref to track the current blob URL so we can revoke it when replaced
  // or when the component unmounts — prevents memory leaks.
  const iconPreviewUrlRef = useRef<string | null>(null);

  // Ref to the hidden file input for the icon — needed so we can reset
  // input.value to "" after a removal. Without this, if the user removes
  // the icon and then picks the SAME file again, the browser fires no
  // "change" event because it thinks nothing changed.
  const iconInputRef = useRef<HTMLInputElement>(null);

  const { locale } = useParams();
  const t = getT(locale as string);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const DAY_MAP = {
    月曜日: "monday",
    火曜日: "tuesday",
    水曜日: "wednesday",
    木曜日: "thursday",
    金曜日: "friday",
    土曜日: "saturday",
    日曜日: "sunday",
  };

  const PRODUCT_TAG_KEYS = ["vintage", "psa", "box", "pokémon", "onepiece", "cashonly", "dragonball", "cardsaccepted"];

  const [businessHours, setBusinessHours] = useState<BusinessHoursType>(
    days.reduce((acc: BusinessHoursType, day) => {
      acc[day] = { open: "", close: "", closed: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    if (initialData?.business_hours) {
      const converted: BusinessHoursType = {};
      Object.entries(initialData.business_hours).forEach(([jpDay, value]) => {
        const key = DAY_MAP[jpDay as keyof typeof DAY_MAP] || jpDay;
        converted[key] = value as any;
      });
      setBusinessHours(converted);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.holiday_hours) {
      setHolidayHours(initialData.holiday_hours);
    }
  }, [initialData]);

  // ─── Revoke blob URL on unmount to prevent memory leaks ────────────────────
  useEffect(() => {
    return () => {
      if (iconPreviewUrlRef.current) {
        URL.revokeObjectURL(iconPreviewUrlRef.current);
      }
    };
  }, []);

  const activeFlags =
    initialData?.shop_product_flags?.map((f: any) => f.product_flags.name) ||
    [];

    
  // ─── Reel Handlers ──────────────────────────────────────────────────────────
  const handleReelChange = (index: number, value: string) => {
    setReels((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addReelField = () => {
    if (reels.length >= 5) return;
    setReels((prev) => [...prev, ""]);
  };

  const removeReelField = (index: number) => {
    const updated = reels.filter((_, i) => i !== index);
    setReels(updated.length ? updated : [""]);
  };

  // ─── Shop Icon Handlers ─────────────────────────────────────────────────────

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // FIX 1 & 4: Revoke the previous blob URL before creating a new one
    // to prevent memory leaks from accumulating stale object URLs.
    if (iconPreviewUrlRef.current) {
      URL.revokeObjectURL(iconPreviewUrlRef.current);
    }

    const blobUrl = URL.createObjectURL(file);
    iconPreviewUrlRef.current = blobUrl;

    setIconFile(file);
    // FIX 3: iconPreview holds ONLY the blob URL for the newly selected file.
    setIconPreview(blobUrl);
    // FIX 3: existingIcon is NOT touched here — it stays as the DB URL.

    // FIX 2 & 5: Selecting a new icon implicitly cancels a pending removal,
    // because the user clearly wants an icon now.
    setRemoveIcon(false);
  };

  // FIX 2 & 5: Remove icon clears both the new selection AND marks existing
  // icon for deletion. The preview disappears immediately.
  const handleRemoveIcon = () => {
    // Revoke blob URL if one exists
    if (iconPreviewUrlRef.current) {
      URL.revokeObjectURL(iconPreviewUrlRef.current);
      iconPreviewUrlRef.current = null;
    }
    setIconPreview(null);
    setIconFile(null);
    setRemoveIcon(true);
    if (iconInputRef.current) { iconInputRef.current.value = ""; }
  };

  // FIX 2: Undo restores only the persisted DB icon (existingIcon), not a blob.
  // const handleUndoRemoveIcon = () => {
  //   setRemoveIcon(false);
  //   // iconPreview and iconFile remain null — the user is restoring the DB icon,
  //   // not re-selecting a new file.
  // };

  // ─── Image Handlers ─────────────────────────────────────────────────────────
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!);
    setImages((prev) => [...prev, ...files]);
  };

  const deleteExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setRemovedImages((prev) => [...prev, id]);
  };

  // ─── Upload Helpers ─────────────────────────────────────────────────────────
  const uploadImages = async (shopId: string) => {
    const formData = new FormData();
    images.forEach((file) => formData.append("files", file));
    formData.append("shopId", shopId);

    const res = await fetch("/api/admin/shops/photos/upload-to-bucket", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Photo upload failed");
    }
  };

  // FIX 5 & 6: Validate the icon upload response and throw on failure so the
  // success toast is never shown when the upload actually failed.
  const uploadIcon = async (shopId: string) => {
    if (!iconFile) return;

    const iconFormData = new FormData();
    iconFormData.append("files", iconFile);
    iconFormData.append("shopId", shopId);

    const res = await fetch("/api/admin/shops/icon/upload-to-bucket", {
      method: "POST",
      body: iconFormData,
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Icon upload failed");
    }
  };

  // ─── Reset icon state (used after a successful create) ──────────────────────
  // FIX 8: Reset all icon-related state alongside the form reset in create mode.
  const resetIconState = () => {
    if (iconPreviewUrlRef.current) {
      URL.revokeObjectURL(iconPreviewUrlRef.current);
      iconPreviewUrlRef.current = null;
    }
    setIconFile(null);
    setIconPreview(null);
    setExistingIcon(null);
    setRemoveIcon(false);
    if (iconInputRef.current) { iconInputRef.current.value = ""; }
  };

  // ─── Form Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const body = {
      ...Object.fromEntries(formData),
      business_hours: businessHours,
      holiday_hours: holidayHours,
      videos: reels.filter((url) => url.trim() !== ""),
      shop_id: initialData?.shop_id,
      area: area,
      // FIX 2: removeIcon is always included so the backend can act on it.
      // It is true only when the user explicitly removed the icon and did
      // NOT subsequently select a replacement file.
      removeIcon,
    };

    setLoading(true);

    const endpoint =
      mode === "edit"
        ? `/api/admin/shops/${initialData.shop_id}`
        : "/api/admin/shops";

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

      const shopId = result.shop?.shop_id || initialData?.shop_id;

      // Delete removed photos
      if (removedImages.length) {
        await Promise.all(
          removedImages.map((id) =>
            fetch(`/api/admin/shops/photos/${id}`, { method: "DELETE" })
          )
        );
      }

      // Upload new photos
      if (images.length) {
        await uploadImages(shopId);
      }

      // FIX 5 & 6 & 7: Upload icon BEFORE showing the success toast.
      // If this throws, the catch block handles it and no success toast appears.
      if (iconFile) {
        await uploadIcon(shopId);
      }

      // ── Success ──────────────────────────────────────────────────────────────
      toast.success(
        mode === "edit"
          ? "ショップの更新が完了しました"
          : "ショップの作成に成功しました"
      );

      // FIX 8: Reset ALL transient state after a successful create.
      if (mode === "create") {
        e.target.reset();
        setReels([""]);
        resetIconState();
      }
    } catch (err: any) {
      toast.error(err.message || "ショップの保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const areas = AREA_OPTIONS.map((a) => ({
    value: a.value,
    label:
      AREA_MATCH[a.key as keyof typeof AREA_MATCH][locale === "en" ? 1 : 0] ||
      a.value,
    group: a.group,
  }));

  // ─── Derived display values ──────────────────────────────────────────────────
  // FIX 2 & 3: The image shown in the preview circle is determined by a clear
  // priority order:
  //   1. A newly selected file  →  iconPreview  (blob URL)
  //   2. The persisted DB icon  →  existingIcon (only when NOT marked for removal)
  //   3. Nothing                →  show placeholder
  // removeIcon hides BOTH so the preview disappears immediately on remove.
  const iconDisplaySrc =
    !removeIcon && (iconPreview || existingIcon)
      ? iconPreview ?? existingIcon
      : null;

  // Show "Remove icon" button whenever there is something to remove and the
  // user hasn't already clicked remove.
  const showRemoveButton = !removeIcon && (!!iconPreview || !!existingIcon);

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Store size={20} />
            {mode === "edit"
              ? t.admin.shopForm.editTitle
              : t.admin.shopForm.createTitle}
          </CardTitle>

          <CardDescription>
            {mode === "edit"
              ? t.admin.shopForm.editDesc
              : t.admin.shopForm.createDesc}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* SHOP INFO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.shopInfo}
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.name}</Label>
                  <Input
                    name="shop_name"
                    defaultValue={initialData?.shop_name}
                    placeholder={t.admin.shopForm.fields.namePlaceholder}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.address}</Label>
                  <Input
                    name="shop_address"
                    defaultValue={initialData?.shop_address}
                    placeholder={t.admin.shopForm.fields.addressPlaceholder}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.website}</Label>
                  <Input
                    name="website"
                    defaultValue={initialData?.website}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.x_account_username}</Label>
                  <Input
                    name="x_account_username"
                    defaultValue={initialData?.x_account_username}
                    placeholder="@yourshop"
                  />
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin size={16} />
                {t.admin.shopForm.sections.location}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.latitude}</Label>
                  <Input
                    name="latitude"
                    defaultValue={initialData?.latitude}
                    placeholder="35.6595"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.longitude}</Label>
                  <Input
                    name="longitude"
                    defaultValue={initialData?.longitude}
                    placeholder="139.7005"
                  />
                </div>
              </div>
            </div>

            {/* AREA */}
            <div className="grid gap-2">
              <Label>{t.admin.shopForm.fields.area || "Area"}</Label>

              <Popover open={areaOpen} onOpenChange={setAreaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between"
                  >
                    {area
                      ? areas.find((a) => a.value === area)?.label
                      : "Select area"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search area..." />
                    <CommandEmpty>No area found</CommandEmpty>

                    <CommandList>
                      <CommandGroup heading="Tokyo Area">
                        {areas
                          .filter((a) => a.group === "tokyo")
                          .map((item) => (
                            <CommandItem
                              key={item.value}
                              onSelect={() => {
                                setArea(item.value);
                                setAreaOpen(false);
                              }}
                            >
                              {item.label}
                              {area === item.value && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                      </CommandGroup>

                      <CommandGroup heading="Prefectures">
                        {areas
                          .filter((a) => a.group === "prefecture")
                          .map((item) => (
                            <CommandItem
                              key={item.value}
                              onSelect={() => {
                                setArea(item.value);
                                setAreaOpen(false);
                              }}
                            >
                              {item.label}
                              {area === item.value && (
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

            {/* BUSINESS HOURS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.businessHours}
              </h3>

              <div className="space-y-4">
                {days.map((day) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <div className="w-full sm:w-28 text-sm">
                      {
                        t.admin.shopForm.sections.businessDays[
                          day as keyof typeof t.admin.shopForm.sections.businessDays
                        ]
                      }
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="w-fit"
                        value={businessHours[day].open || ""}
                        disabled={businessHours[day].closed}
                        onChange={(e) =>
                          setBusinessHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], open: e.target.value },
                          }))
                        }
                      />
                      <span>-</span>
                      <Input
                        type="time"
                        className="w-fit"
                        value={businessHours[day].close || ""}
                        disabled={businessHours[day].closed}
                        onChange={(e) =>
                          setBusinessHours((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], close: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={businessHours[day].closed || false}
                        onCheckedChange={(checked) =>
                          setBusinessHours((prev) => ({
                            ...prev,
                            [day]: {
                              ...prev[day],
                              closed: checked === true,
                            },
                          }))
                        }
                      />
                      <Label>Closed</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOLIDAY HOURS */}
            <div className="space-y-2">
              <h4 className="font-medium">
                {t.admin.shopForm.sections.holidayHours}
              </h4>

              <div className="flex items-center gap-4">
                <Input
                  type="time"
                  className="w-fit"
                  value={holidayHours.open}
                  onChange={(e) =>
                    setHolidayHours((prev) => ({
                      ...prev,
                      open: e.target.value,
                    }))
                  }
                />
                <span>-</span>
                <Input
                  type="time"
                  className="w-fit"
                  value={holidayHours.close}
                  onChange={(e) =>
                    setHolidayHours((prev) => ({
                      ...prev,
                      close: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-2">
              <Label>{t.admin.shopForm.fields.description}</Label>
              <Textarea
                name="description"
                defaultValue={initialData?.description}
                placeholder={t.admin.shopForm.fields.descriptionPlaceholder}
              />
            </div>

            {/* SHOP ICON */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.admin.shopForm.fields.shopIcon}</h3>

              <div className="flex items-center gap-6">
                {/* Preview circle */}
                <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-muted/30 shrink-0">
                  {/*
                   * FIX 2 & 3: Use the derived `iconDisplaySrc` which is null
                   * when removeIcon is true, making the preview disappear
                   * immediately when the user clicks "Remove icon".
                   */}
                  {iconDisplaySrc ? (
                    <Image
                      src={iconDisplaySrc}
                      alt={t.admin.shopForm.fields.shopIcon}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <Store size={28} className="text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted transition">
                      <ImageIcon size={14} />
                      {iconDisplaySrc ? t.admin.shopForm.fields.changeIcon : t.admin.shopForm.fields.uploadIcon}
                    </span>
                    <input ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconChange}
                    />
                  </label>

                  <p className="text-xs text-muted-foreground">
                   {t.admin.shopForm.fields.iconHint}
                  </p>

                  {/*
                   * FIX 2: Show "Remove icon" whenever there is an icon to
                   * remove (new preview OR existing DB icon) and it hasn't been
                   * removed yet.
                   */}
                  {showRemoveButton && (
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline w-fit"
                    >
                      <Trash size={12} />
                     {t.admin.shopForm.fields.removeIcon}
                    </button>
                  )}

                  {/*
                   * FIX 2: "Undo remove" only shows when removeIcon is true
                   * AND there was a persisted icon to restore. Without an
                   * existingIcon there is nothing to undo.
                   */}
                  {/* {removeIcon && existingIcon && (
                    <button
                      type="button"
                      onClick={handleUndoRemoveIcon}
                      className="text-xs text-muted-foreground hover:underline w-fit"
                    >
                      Undo remove
                    </button>
                  )} */}
                </div>
              </div>
            </div>

            {/* SHOP PHOTOS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.photos}
              </h3>

              <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition">
                <ImageIcon className="mb-2 text-gray-500" />
                <p className="font-medium">{t.admin.shopForm.upload.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.admin.shopForm.upload.hint}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <p className="text-sm text-gray-600">
                  {images.length} {t.admin.shopForm.upload.filesSelected}
                </p>
              )}
            </div>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {existingImages.map((img: any) => (
                  <div key={img.id} className="relative w-full aspect-[4/3]">
                    <Image
                      alt="preview image"
                      fill
                      src={img.image_url}
                      className="rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => deleteExistingImage(img.id)}
                      className="absolute cursor-pointer top-1 right-1 bg-white rounded p-1"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* INSTAGRAM REELS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.reels}
              </h3>

              <div className="space-y-2">
                {reels.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://www.instagram.com/reel/..."
                      value={url}
                      onChange={(e) => handleReelChange(index, e.target.value)}
                    />
                    {reels.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeReelField(index)}
                      >
                        {t.admin.shopForm.actions.delete}
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addReelField}
                  disabled={reels.length >= 5}
                >
                  {t.admin.shopForm.actions.addReel}
                </Button>
              </div>
            </div>

            {/* PRODUCT FLAGS */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.productTags}
              </h3>

              <div className="flex gap-6 flex-wrap">
                {PRODUCT_TAG_KEYS.map((key) => {
                  const label = t.admin.shopForm.extras.productTags[
                    key as keyof typeof t.admin.shopForm.extras.productTags
                  ] as keyof typeof t.admin.shopForm.extras.productTags;

                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        name={key}
                        defaultChecked={activeFlags.includes(
                          translations["en"].admin.shopForm.extras.productTags[
                            key as keyof typeof t.admin.shopForm.extras.productTags
                          ]
                        )}
                      />
                      <Label>{label}</Label>
                    </div>
                  );
                })}
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
                    ? t.admin.shopForm.actions.updating
                    : t.admin.shopForm.actions.creating
                  : mode === "edit"
                  ? t.admin.shopForm.actions.update
                  : t.admin.shopForm.actions.create}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}