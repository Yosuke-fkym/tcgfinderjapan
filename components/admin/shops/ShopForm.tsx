"use client";

import { useEffect, useState } from "react";
import { Store, MapPin, Globe } from "lucide-react";
import { ImageIcon, Trash } from "lucide-react";
// import { supabase } from "@/lib/supabase/supabase";
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
  const [existingImages, setExistingImages] = useState<any[]>(initialData?.shop_photos || [],);
  const [holidayHours, setHolidayHours] = useState<HolidayHoursType>({ open: "", close: "" });
  const [reels, setReels] = useState<string[]>(
  initialData?.shopVideos?.map((v: ShopVideo) => v.videoUrl) || [""]
);

 const { locale } = useParams();
  const t = getT(locale as string);

  const days = [
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
    "日曜日",
  ];

  const [businessHours, setBusinessHours] = useState<BusinessHoursType>(
    days.reduce((acc: BusinessHoursType, day) => {
      acc[day] = { open: "", close: "", closed: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    if (initialData?.business_hours) {
      setBusinessHours(initialData.business_hours);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.holiday_hours) {
      setHolidayHours(initialData.holiday_hours);
    }
  }, [initialData]);

  const activeFlags =
    initialData?.shop_product_flags?.map((f: any) => f.product_flags.name) ||
    [];

  // ✅ reel handlers
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

  // ✅ FIXED: always keep 1 input
  const removeReelField = (index: number) => {
    const updated = reels.filter((_, i) => i !== index);
    setReels(updated.length ? updated : [""]);
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!);
    setImages((prev) => [...prev, ...files]);
  };

  const deleteExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setRemovedImages((prev) => [...prev, id]);
  };

  const uploadImages = async (shopId: string) => {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("shopId", shopId);

    const res = await fetch("/api/admin/shops/photos/upload-to-bucket", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Upload failed");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // ✅ FIXED: clean reels + add shop_id
    const body = {
      ...Object.fromEntries(formData),
      business_hours: businessHours,
      holiday_hours: holidayHours,
      videos: reels.filter((url) => url.trim() !== ""),
      shop_id: initialData?.shop_id,
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

      const shopId = result.shop?.shop_id || initialData?.shop_id;

      if (removedImages.length) {
        await Promise.all(
          removedImages.map((id) =>
            fetch(`/api/admin/shops/photos/${id}`, {
              method: "DELETE",
            })
          )
        );
      }

      if (images.length) {
        await uploadImages(shopId);
      }

      if (!res.ok || result.error) {
        throw new Error(result.error?.message || "何か問題が発生しました");
      }

      toast.success(
        mode === "edit"
          ? "ショップの更新が完了しました"
          : "ショップの作成に成功しました"
      );

      // ✅ FIXED: reset reels
      if (mode === "create") {
        e.target.reset();
        setReels([""]);
      }
    } catch (err: any) {
      toast.error(err.message || "ショップの保存に失敗しました");
    }

    setLoading(false);
  };

  return (
    <div className="2xl:max-w-4xl 2xl:mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Store size={20} />
            {mode === "edit" ? t.admin.shopForm.editTitle : t.admin.shopForm.createTitle}
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
              <h3 className="font-semibold text-gray-800"> {t.admin.shopForm.sections.shopInfo}</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.name}</Label>
                  <Input
                    name="shop_name"
                    defaultValue={initialData?.shop_name}
                    placeholder="Tokyo Card Haven"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.address}</Label>
                  <Input
                    name="shop_address"
                    defaultValue={initialData?.shop_address}
                    placeholder="Shibuya, Tokyo"
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
  <Label>{t.admin.shopForm.fields.x_account_url}</Label>
  <Input
    name="x_account_url"
    defaultValue={initialData?.x_account_url}
    placeholder="https://x.com/yourshop"
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

            {/* DETAILS */}

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Globe size={16} />
                {t.admin.shopForm.sections.details}
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>{t.admin.shopForm.fields.language}</Label>
                  <Input
                    name="language_support"
                    defaultValue={initialData?.language_support}
                    placeholder="Japanese, English"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                {t.admin.shopForm.sections.businessHours}
              </h3>

              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
  
  <div className="w-full sm:w-28 text-sm">{day}</div>

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
          [day]: { ...prev[day], closed: checked === true },
        }))
      }
    />
    <Label>Closed</Label>
  </div>
</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
  <h4 className="font-medium">{t.admin.shopForm.sections.holidayHours}</h4>

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

            {/* SHOP PHOTOS */}

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">{t.admin.shopForm.sections.photos}</h3>

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
                    <Image alt="preview image" fill  src={img.image_url} className="rounded border object-cover" />

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
                      onChange={(e) =>
                        handleReelChange(index, e.target.value)
                      }
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
              <h3 className="font-semibold text-gray-800">{t.admin.shopForm.sections.productTags}</h3>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    name="vintage"
                    defaultChecked={activeFlags.includes("Vintage")}
                  />
                  <Label>{t.admin.shopForm.extras.productTags.vintage}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    name="psa"
                    defaultChecked={activeFlags.includes("PSA")}
                  />
                  <Label>{t.admin.shopForm.extras.productTags.psa}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    name="box"
                    defaultChecked={activeFlags.includes("BOX")}
                  />
                  <Label>{t.admin.shopForm.extras.productTags.box}</Label>
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
