"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MapPin, Navigation, Store } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

interface RelatedShopsProps {
  shops: any[];
}

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function RelatedShops({ shops }: RelatedShopsProps) {
    const { locale } = useParams();
  const t = getT(locale as string);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  if (!shops?.length) return null;

  const sortedShops = useMemo(() => {
    if (!userLocation) return shops;

    return [...shops]
      .map((shop) => ({
        ...shop,
        distance: getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          Number(shop.latitude),
          Number(shop.longitude)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [shops, userLocation]);

  function findNearby() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }

    setLoadingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        setLocationError(t.cardPage.relatedShops.locationAccessError);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  return (
    <section className="mb-12" aria-labelledby="related-shops-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="related-shops-heading"
            className="font-serif text-xl font-semibold text-stone-900"
          >
            {t.cardPage.relatedShops.title}
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            {t.cardPage.relatedShops.subtitle}
          </p>
        </div>

        <button
          onClick={findNearby}
          disabled={loadingLocation}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-stone-100 disabled:opacity-60"
        >
          {loadingLocation ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
             {t.cardPage.relatedShops.locating}
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              {t.cardPage.relatedShops.sortByDistance}
            </>
          )}
        </button>
      </div>

      {locationError && (
        <p className="mb-4 text-sm text-red-600">{locationError}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedShops.map((shop) => {
          const icon = shop.shop_icon_url;
          const id = shop.shop_id;

          return (
            <div
              key={id}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-50">
                  {icon ? (
                    <Image
                      src={icon}
                      alt={shop.shop_name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-5 w-5 text-stone-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base font-semibold text-stone-900">
                    {shop.shop_name}
                  </p>

                  {shop.shop_address && (
                    <p className="truncate text-xs text-stone-500">
                      {shop.shop_address}
                    </p>
                  )}

                  {userLocation && shop.distance != null && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <MapPin className="h-3 w-3" />
                      {shop.distance.toFixed(1)} {t.cardPage.relatedShops.kmAway}
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/shop/${id}`}
                target="_blank"
                className="mt-auto inline-flex items-center justify-center rounded-lg border border-red-700 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-700 hover:text-white"
              >
               {t.cardPage.relatedShops.viewShop}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}