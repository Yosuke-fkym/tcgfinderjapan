export interface Pack {
  id: string;
  slug: string;
  name_en: string;
  name_jp: string;
  ebay_url: string;
  mercari_url: string;
  image_url: string | null;
  release_date: string | null;
}