import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/getT";

interface AffiliateButtonsProps {
  ebayRawUrl?: string | null;
  ebaySlabUrl?: string | null;
  mercariRawUrl?: string | null;
  mercariSlabUrl?: string | null;
  cardName?: string;
  locale: string;
}

/**
 * Renders the card's stored affiliate URLs directly — no URL generation,
 * no backend calls. A button is omitted entirely if its URL is empty.
 */
export function AffiliateButtons({
  ebayRawUrl,
  ebaySlabUrl,
  mercariRawUrl,
  mercariSlabUrl,
  cardName,
  locale,
}: AffiliateButtonsProps) {
  const t = getT(locale);

  const hasAnyLink =
    !!ebayRawUrl || !!ebaySlabUrl || !!mercariRawUrl || !!mercariSlabUrl;

  if (!hasAnyLink) return null;

  return (
    <section aria-labelledby="buy-heading" className="grid gap-3 sm:grid-cols-2">
      <h2 id="buy-heading" className="sr-only">
        {t.cardPage.affiliateBtns.affiliateSection} {cardName}
      </h2>

      {ebayRawUrl && (
        <Button
          asChild
          className="h-14 w-full justify-between rounded-xl bg-stone-900 px-5 text-base font-medium text-white hover:bg-stone-800"
        >
          <a href={ebayRawUrl} target="_blank" rel="noopener noreferrer">
            {t.cardPage.affiliateBtns.buyOnEbayRaw}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      )}

      {ebaySlabUrl && (
        <Button
          asChild
          className="h-14 w-full justify-between rounded-xl bg-stone-900 px-5 text-base font-medium text-white hover:bg-stone-800"
        >
          <a href={ebaySlabUrl} target="_blank" rel="noopener noreferrer">
            {t.cardPage.affiliateBtns.buyOnEbaySlab}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      )}

      {mercariRawUrl && (
        <Button
          asChild
          variant="outline"
          className="h-14 w-full justify-between rounded-xl border-[#B23A2F]/40 bg-white px-5 text-base font-medium text-[#B23A2F] hover:bg-[#FBEAE7]"
        >
          <a href={mercariRawUrl} target="_blank" rel="noopener noreferrer">
            {t.cardPage.affiliateBtns.buyOnMercariRaw}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      )}

      {mercariSlabUrl && (
        <Button
          asChild
          variant="outline"
          className="h-14 w-full justify-between rounded-xl border-[#B23A2F]/40 bg-white px-5 text-base font-medium text-[#B23A2F] hover:bg-[#FBEAE7]"
        >
          <a href={mercariSlabUrl} target="_blank" rel="noopener noreferrer">
            {t.cardPage.affiliateBtns.buyOnMercariSlab}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      )}
    </section>
  );
}