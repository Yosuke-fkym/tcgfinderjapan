export type BusinessDayHours = {
  open: string;   
  close: string;  
  closed: boolean;
};

export type BusinessHours = {
[x:string]: BusinessDayHours ;
};

export type HolidayHours = {
  open: string;
  close: string;
};

export type Shop = {
  reviews?: any;
  shop_id: string;
  created_at: string;
  shop_name: string;
  shop_address: string;
  latitude: number;
  area: string;
  longitude: number;
  shop_icon_url: string,
  language_support: string[];
  description: string;
  website: string;
  business_hours: BusinessHours;
  holiday_hours: HolidayHours;
  productFlags: string[];
  isOpen: boolean
  images: string[]
  shopVideos: ShopVideo[]
  x_account_url: string | null;
  shop_name_in_langs?: Record<string, string>;
  shop_desc_in_langs?: Record<string, string>;
  shop_address_in_langs?: Record<string, string>;
};



export type ShopVideo = {
  id: string,
  shopId: string,
  videoUrl: string,
  platform: string,
  created_at: string
}

export type Filters = {
  query: string;
  area: string[];
  productFlags: string[];
  language: string[];
  openNow: boolean;
  favoritesOnly: boolean;
};

export interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  review_text_in_langs?: Record<string, string>;

  // OLD (fallback)
  rating?: number;

  // NEW
  selection_rating: number;
  price_rating: number;
  overall_rating: number;

  photo_url: string[];
  comment: string;
  is_flagged: boolean;
  posted_at: string;

  user: {
    name?: string;
    email?: string;
  };

  review_likes: {
    user_id: string;
  }[];

  likeCount?: number;
  likedByMe?: boolean;
}


export interface ReviewReport{
  id: string,
  review_id: string,
  user_id: string,
  reason: string,
  status: "pending" | "resolved",
  created_at: string,
  review: Review
}

export type CSVRow = {
  shop_name: string;
  shop_address: string;
  latitude: string;
  longitude: string;
  website: string;
  language_support: string;
  description: string;
  x_account_url: string;

  // 🕒 Business hours (EN keys)
  monday_open: string;
  monday_close: string;

  tuesday_open: string;
  tuesday_close: string;

  wednesday_open?: string;
  wednesday_close?: string;

  thursday_open: string;
  thursday_close: string;

  friday_open: string;
  friday_close: string;

  saturday_open: string;
  saturday_close: string;

  sunday_open: string;
  sunday_close: string;

  // 🎌 Holiday
  holiday_open?: string;
  holiday_close?: string;

  // 🎥 Reels (pipe separated)
  reels?: string;
};
