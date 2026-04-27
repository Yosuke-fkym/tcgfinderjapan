export function SkeletonList() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
      ))}
    </>
  );
}
