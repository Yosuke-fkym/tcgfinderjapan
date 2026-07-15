import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/getT";

interface AffiliateButtonsProps{
    affiliateKeywords:string[];
    cardName?: string;
    locale: string;
}

/**
 * Dummy affiliate links only — these build plain marketplace search URLs from
 * the card name, they do not call any API or backend.
 */
export async function AffiliateButtons({ affiliateKeywords, cardName, locale}: AffiliateButtonsProps) {
  const t = getT(locale);
  const keyword =
  affiliateKeywords.find((k) => k.trim().length > 0)?.trim() || cardName || "";
  const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}`;
  const mercariUrl = `https://jp.mercari.com/search?keyword=${encodeURIComponent(keyword)}`;

  return (
    <section aria-labelledby="buy-heading" className="grid gap-3 sm:grid-cols-2">
      <h2 id="buy-heading" className="sr-only">
       {t.cardPage.affiliateBtns.affiliateSection} {cardName}
      </h2>

      <Button
        asChild
        className="h-14 w-full justify-between rounded-xl bg-stone-900 px-5 text-base font-medium text-white hover:bg-stone-800"
      >
        <a href={ebayUrl} target="_blank" rel="noopener noreferrer">
          {t.cardPage.affiliateBtns.buyOnEbay}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </Button>

      <Button
        asChild
        variant="outline"
        className="h-14 w-full justify-between rounded-xl border-[#B23A2F]/40 bg-white px-5 text-base font-medium text-[#B23A2F] hover:bg-[#FBEAE7]"
      >
        <a href={mercariUrl} target="_blank" rel="noopener noreferrer">
          {t.cardPage.affiliateBtns.buyOnMercari}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </Button>
    </section>
  );
}