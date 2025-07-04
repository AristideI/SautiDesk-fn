export default function LoadingSkeleton() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-6 border border-white/10 animate-pulse flex flex-col gap-4 min-h-[140px]"
          >
            <div className="h-8 w-1/2 bg-white/10 rounded mb-2" />
            <div className="h-4 w-1/3 bg-white/10 rounded mb-2" />
          </div>
        ))}
      </div>
    </section>
  );
}
