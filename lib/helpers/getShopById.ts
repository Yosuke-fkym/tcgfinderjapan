import React, { SetStateAction } from "react";

type ShopFetchingParams = {
    setLoading?: React.Dispatch<SetStateAction<boolean>>,
    id: string
}

export const fetchShop = async ({id, setLoading}: ShopFetchingParams) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shops/${id}`);
        const data = await res.json();
        return data.data
      } catch (err) {
        console.error("Error fetching shop:", err);
      } finally {
        if(setLoading != null){
            setLoading(false);
        }
      }
    };