'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';

interface ShopPhotoCarouselProp {
  images: string[];
}

export default function ShopPhotoCarousel({ images }: ShopPhotoCarouselProp) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="w-full space-y-3">

      {/* 🔥 MAIN SLIDER */}
      <Swiper
        spaceBetween={10}
        navigation
       thumbs={{
  swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
}}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-2xl overflow-hidden"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[500px] bg-gray-100 flex items-center justify-center">
              <Image
              fill
                src={img}
                 priority={i === 0}
        fetchPriority={i === 0 ? "high" : "auto"}
                alt="shop"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔥 THUMBNAILS */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Thumbs]}
        className="h-[70px]"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[70px] cursor-pointer overflow-hidden rounded-md border">
              <Image
              fill
                src={img}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}