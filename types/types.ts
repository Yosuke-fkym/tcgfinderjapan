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
  longitude: number;
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
  shop_name: string
  shop_address: string
  latitude: string
  longitude: string
  website: string
  language_support: string
  description: string
  x_account_url: string

  月曜日_open: string
  月曜日_close: string
  月曜日_closed?: string

  火曜日_open: string
  火曜日_close: string

  水曜日_open?: string
  水曜日_close?: string
  水曜日_closed?: string

  木曜日_open: string
  木曜日_close: string

  金曜日_open: string
  金曜日_close: string

  土曜日_open: string
  土曜日_close: string

  日曜日_open: string
  日曜日_close: string

  祝日_open?: string
  祝日_close?: string
}

