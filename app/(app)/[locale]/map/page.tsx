'use client'
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../../components/map/MapPageComponent"), {
  ssr: false, // 🔥 MOST IMPORTANT
});

export default function MapPage() {
  return <Map />;
}