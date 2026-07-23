import { Card } from "@/types/card";

export function transformCard(card: any): Card {
  return {
    id: card.id,
    card_name: card.card_name || "",
    card_name_in_langs: card.card_name_in_langs || undefined,
    productFlags:
      card.card_product_flags?.map((item: any) => item.product_flags?.name) || [],
    created_at: card.created_at,
    card_image: card.card_images || [],
    pack_name: card.pack_name || "",
    pack_name_in_langs: card.pack_name_in_langs || undefined,
    card_number: card.card_number || undefined,
    illustrator_name: card.illustrator_name || undefined,
    slug: card.slug || "",
    article_id: card.article_id || undefined,
    affiliate_keywords: card.affiliate_keywords || undefined,
  };
}
