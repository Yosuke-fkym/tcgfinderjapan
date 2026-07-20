import { Card } from "@/types/card";
import { CardEmpty } from "./CardEmpty";
import { CardItem } from "./CardItem";

interface CardGridProps {
  cards: Card[];
    onClearFilters?: () => void;
    showFavoriteButton?: boolean;
     onRemoved?: (slug: string) => void;
}

/** 1 column on mobile, 2–3 on tablet, 4 on desktop. */
export function CardGrid({ cards, onClearFilters, showFavoriteButton, onRemoved }: CardGridProps) {
  if (cards.length === 0) {
    return <CardEmpty onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card}  onRemoved={onRemoved} showFavoriteButton={showFavoriteButton} />
      ))}
    </div>
  );
}