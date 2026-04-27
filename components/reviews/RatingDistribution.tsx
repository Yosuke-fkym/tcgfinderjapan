import { Review } from "@/types/types";
import { Star } from "lucide-react";

interface Props {
  reviews: Review[];
}

export default function RatingDistribution({ reviews }: Props) {
  if (!reviews.length) return null;

  const total = reviews.length;

  // 🔥 FIX: use overall rating
  const getOverall = (r: Review) => {
    const selection = r.selection_rating ?? r.rating ?? 0;
    const price = r.price_rating ?? r.rating ?? 0;
    return Math.round((selection + price) / 2);
  };

  const ratingCounts = reviews.reduce((acc, r) => {
    const overall = getOverall(r);
    acc[overall] = (acc[overall] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratingCounts[star] || 0,
  }));

  return (
    <div className="space-y-1">
      {distribution.map(({ star, count }) => {
        const percent = (count / total) * 100;

        return (
          <div key={star} className="flex items-center gap-2 text-xs text-gray-600">
            
            {/* Star */}
            <div className="flex items-center gap-1 w-10">
              <span>{star}</span>
              <Star size={12} className="fill-yellow-500 text-yellow-500 shrink-0" />
            </div>

            {/* Bar */}
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Count */}
            <span className="w-6 text-right text-gray-500">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}