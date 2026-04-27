export function RankBadge({ index }: { index: number }) {

  return (
    <span className="text-sm font-semibold w-6 text-center">
      #{index + 1}
    </span>
  );
}