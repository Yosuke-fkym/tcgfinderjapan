"use client";

import { Shop } from "@/types/types";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { isShopOpen } from "@/lib/helpers/getShopStatus";
import { useRouter, useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { getT } from "@/lib/getT";
import { translations } from "@/lib/i18n";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 35.6762, lng: 139.6503 };

const libraries: ("places")[] = ["places"];

interface MapProps {
  shops: Shop[];
  selected: Shop | null;
  onSelect: (shop: Shop | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isLoggedIn: boolean | null;
}

export default function Map({
  shops,
  selected,
  onSelect,
  favorites,
  toggleFavorite,
  isLoggedIn,
}: MapProps) {
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  if (!apiKey) {
    return <div>{t.map.loading}</div>;
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (!selected || !mapRef.current) return;

    const lat = Number(selected.latitude);
    const lng = Number(selected.longitude);

    if (!lat || !lng) return;

    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, [selected]);

  const validShops = useMemo(() => {
    return shops.filter((shop) => shop.latitude && shop.longitude);
  }, [shops]);

  if (loadError) return <div>{t.common.somethingWrong}</div>;
  if (!isLoaded) return <div>{t.map.loading}</div>;

  return (
    <GoogleMap
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
      }}
    >
      {validShops.map((shop) => {
        const lat = Number(shop.latitude);
        const lng = Number(shop.longitude);

        const isSelected = selected?.shop_id === shop.shop_id;
        const isOpen = shop.isOpen ?? isShopOpen(shop);

        return (
          <Marker
            aria-label={t.buttons.viewDetails}
            key={shop.shop_id}
            position={{ lat, lng }}
            onClick={() => onSelect(shop)}
            icon={
              isSelected
                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : isOpen
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
          />
        );
      })}

      {selected && (
        <InfoWindow
          position={{
            lat: Number(selected.latitude),
            lng: Number(selected.longitude),
          }}
          onCloseClick={() => onSelect(null)}
          aria-label={t.common.cancel}
        >
          <div
            className="min-w-35 space-y-1"
            role="dialog"
            aria-labelledby="shop-dialog-title"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium" id="shop-dialog-title">
                {
                  locale === "jp" ?
                  selected.shop_name
                  :
                 selected.shop_name_in_langs && selected.shop_name_in_langs[locale as keyof typeof translations]
                }
              </p>

              <button
                aria-label={
                  favorites.includes(selected.shop_id)
                    ? t.shopDetails.list.removeFromFavorites
                    : t.shopDetails.list.addToFavorites
                }
                className={`${!isLoggedIn && "cursor-not-allowed"} ml-1`}
                disabled={!isLoggedIn}
                onClick={() => toggleFavorite(selected.shop_id)}
              >
                {isLoggedIn &&
                favorites.includes(selected.shop_id) ? (
                  <Heart
                    size={15}
                    fill="currentColor"
                    className="fill-red-600 text-red-600"
                  />
                ) : (
                  <Heart size={15} />
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              {
                locale === "jp" ?
                selected.shop_address
                :
                selected.shop_address_in_langs && selected.shop_address_in_langs[locale as keyof typeof translations]
              }
            </p>

            <p
              className={`text-xs font-medium ${
                selected.isOpen ? "text-green-600" : "text-red-500"
              }`}
            >
              {selected.isOpen
                ? t.shopDetails.header.open
                : t.shopDetails.header.closed}
            </p>

            <p
              className="text-xs text-blue-600 cursor-pointer mt-1"
              onClick={() => router.push(`/shop/${selected.shop_id}`)}
            >
              {t.buttons.viewDetails} →
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}