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

export function TicketLoadingSkeleton() {
  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Header Skeleton */}
      <div className="bg-black/50 border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-white/20 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
          </div>
          <div className="w-48 h-6 bg-white/20 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            <div className="w-32 h-10 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-black/20 border-b border-white/20">
        <div className="flex justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 px-6 py-3">
              <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Basic Information Skeleton */}
            <div className="bg-white/5 rounded-lg p-6">
              <div className="w-32 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="w-16 h-3 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-white/5 rounded-lg p-6">
              <div className="w-24 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="w-1/2 h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Assignment Information Skeleton */}
            <div className="bg-white/5 rounded-lg p-6">
              <div className="w-28 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="w-20 h-3 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Skeleton */}
            <div className="bg-white/5 rounded-lg p-6">
              <div className="w-20 h-6 bg-white/20 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="w-24 h-3 bg-white/20 rounded animate-pulse mb-2"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                      <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AgentLoadingSkeleton() {
  return (
    <main className="h-screen flex flex-col">
      {/* Header Skeleton */}
      <header className="flex justify-between items-center border-b border-white/40 py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          <div className="w-32 h-8 bg-white/20 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
          <div className="w-36 h-10 bg-white/20 rounded-lg animate-pulse"></div>
        </div>
      </header>

      {/* Agent Info Row Skeleton */}
      <div className="flex items-center gap-4 p-6 border-b border-white/40">
        <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="w-48 h-6 bg-white/20 rounded animate-pulse mb-2"></div>
          <div className="flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agent Information Skeleton */}
        <div className="w-1/4 bg-white/5 border-r border-white/20 p-6 overflow-y-auto">
          <div className="w-40 h-6 bg-white/20 rounded animate-pulse mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div className="w-24 h-3 bg-white/20 rounded animate-pulse mb-2"></div>
                <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Tabs Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Headers Skeleton */}
          <div className="flex border-b border-white/20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Content Skeleton */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Search and Filter Skeleton */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-64 h-10 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="w-20 h-10 bg-white/20 rounded-lg animate-pulse"></div>
              </div>

              {/* Table Skeleton */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/40">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <th key={i} className="text-left py-3 px-4">
                          <div className="w-20 h-4 bg-white/20 rounded animate-pulse"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((row) => (
                      <tr key={row} className="border-b border-white/20">
                        {[1, 2, 3, 4, 5].map((cell) => (
                          <td key={cell} className="py-3 px-4">
                            <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
