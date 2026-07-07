export function LoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-10 md:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="glass-panel h-36 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}
