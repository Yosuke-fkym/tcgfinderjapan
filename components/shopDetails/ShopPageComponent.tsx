"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Shop } from "@/types/types";
import Map from "@/components/map/Map";
import ShopHeader from "@/components/shopDetails/ShopHeader";
import RelatedShops from "@/components/shopDetails/RelatedShops";
const ShopPhotoCarousel = dynamic(() => import('../../components/shopDetails/ShopPhotoCarousel'), {
  ssr: false,
});
import { Heart } from "lucide-react";
import { toast } from "sonner";
import ReviewsSection from "@/components/reviews/ReviewSection";
import { ShopVideosSection } from "@/components/shopDetails/ShopVideoSection";
import { fetchShop } from "@/lib/helpers/getShopById";
import AdBanner from "../ads/AdBanner";
import dynamic from "next/dynamic";
import { checkUser } from "@/lib/helpers/getUser";
import { Spinner } from "../ui/spinner";
import { getT } from "@/lib/getT";
import ShopSocials from "./ShopXAccount";
import TweetEmbed from "./TweetCard";
import { translations } from "@/lib/i18n";

export default function ShopPageComponent() {
  const params = useParams();
  const router = useRouter();
  const id = params.shop_id as string;

  const t = getT(params.locale as string);

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const favorites = isFav && shop ? [shop.shop_id] : [];

  const [relatedShops, setRelatedShops] = useState([]);

useEffect(() => {
  const fetchRelated = async () => {
    const res = await fetch(`/api/shops/${shop?.shop_id}/related`);
    const data = await res.json();
    
    setRelatedShops(data.data || []);
  };

  if (shop?.shop_id) {
    fetchRelated();
  }
}, [shop?.shop_id]);

  useEffect(() => {
    checkUser({setIsLoggedIn})
  }, []);

  useEffect(() => {
    async function getShop(){
      const shop = await fetchShop({ id, setLoading});
      setShop(shop)
    } 
    getShop()
  }, [id]);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error(t.shopDetails.page.loginRequired);
      router.push("/auth/login");
      return;
    }

    try {
      if (isFav) {
        toast.success(t.shopDetails.page.removeFavToast);
        await fetch("/api/favourites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop_id: shop?.shop_id }),
        });
      } else {
        toast.success(t.shopDetails.page.addFavToast);
        await fetch("/api/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop_id: shop?.shop_id }),
        });
      }

      setIsFav(!isFav);
    } catch (err) {
      console.error("Favorite error:", err);
      toast.error(t.common.somethingWrong);
    }
  };

  useEffect(() => {
    if (!shop?.shop_id || !isLoggedIn) return;

    const track = async () => {
      await fetch("/api/shops/viewed_history", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id: shop.shop_id }),
      });
    };

    track();
  }, [shop?.shop_id, isLoggedIn]);

  useEffect(() => {
    if (!shop?.shop_id || !isLoggedIn) return;

    const checkFavorite = async () => {
      const res = await fetch("/api/favourites", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) return;

      const found = data.data.find(
        (f: any) => f.shop_id === shop.shop_id
      );

      setIsFav(!!found);
    };

    checkFavorite();
  }, [shop?.shop_id, isLoggedIn]);

  if (loading || isLoggedIn === null) {
    return (
      <div className="text-sm text-gray-500 min-h-[80vh] flex justify-center items-center">
        {t.common.loading} <Spinner className="inline-flex mx-0.5"/>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-sm text-gray-500">
        {t.shopDetails.page.notFound}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto overflow-x-hidden pb-10">

      {/* Back */}
      <div className="space-y-2">
        <button
          onClick={() => router.push("/map")}
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← {t.common.back}
        </button>

        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span
            onClick={() => router.push("/map")}
            className="cursor-pointer hover:underline"
          >
            {t.shopDetails.page.shopList}
          </span>
          <span>›</span>
          <span className="text-gray-400">
            {
              params.locale === "jp" ?
              shop.shop_name
              :
             shop.shop_name_in_langs && shop.shop_name_in_langs[params.locale as keyof typeof translations]
            }
          </span>
        </div>
      </div>

      {/* IMAGE */}
      {shop.images.length > 0 ? (
        <ShopPhotoCarousel images={shop.images} />
      ) : (
        <div className="w-full h-55 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-sm shadow-sm">
         {t.shopDetails.page.noImage}
        </div>
      )}

      <ShopHeader shop={shop} />

      {shop.description && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between w-full">
            <h2 className="text-base font-semibold mb-2 text-gray-800">
              {t.shopDetails.page.details}
            </h2>
<div className="flex gap-2 items-center">
{/* <ShopSocials xUrl={shop.x_account_url as string} /> */}
            <button
              aria-label={
                favorites.includes(id)
                  ? t.shopDetails.list.removeFromFavorites
                  : t.shopDetails.list.addToFavorites
              }
              onClick={toggleFavorite}
              disabled={!isLoggedIn}
              className={`${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isFav ? (
                <Heart className="fill-red-600 text-red-600" />
              ) : (
                <Heart />
              )}
            </button>
</div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {
              params.locale === "jp" ?
              shop.description
              :
             shop.shop_desc_in_langs && shop.shop_desc_in_langs[params.locale as keyof typeof translations]
            }
          </p>
        </div>
      )}

{shop.x_account_url && (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mt-4">
    <h3 className="text-sm font-semibold text-white mb-2">
      {t.shopDetails.tweetCard.title}
      
    </h3>

    <TweetEmbed url={shop.x_account_url} />
  </div>
)}

      <AdBanner position="center"/>

      <div className="h-70 rounded-2xl overflow-hidden border bg-white shadow-sm">
        <Map
          shops={[shop]}
          selected={shop}
          onSelect={() => {}}
          favorites={favorites}
          isLoggedIn={isLoggedIn}
          toggleFavorite={() => toggleFavorite()}
        />
      </div>

      <ReviewsSection shop={shop} />

      <ShopVideosSection videos={shop.shopVideos}/>

      <RelatedShops shops={relatedShops} />
    </div>
  );
}