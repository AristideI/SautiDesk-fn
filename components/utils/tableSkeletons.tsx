export function TicketLoadingSkeleton() {
  return (
    <article className="flex-1 p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="font-semibold">
            <tr className="border-b border-white/40">
              <th className="text-left py-3 px-4 text-white/60">Ticket ID</th>
              <th className="text-left py-3 px-4 text-white/60">Title</th>
              <th className="text-left py-3 px-4 text-white/60">Type</th>
              <th className="text-left py-3 px-4 text-white/60">Status</th>
              <th className="text-left py-3 px-4 text-white/60">Priority</th>
              <th className="text-left py-3 px-4 text-white/60">Assigned To</th>
              <th className="text-left py-3 px-4 text-white/60">
                Request Date
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="border-b border-white/20">
                <td className="py-3 px-4">
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function UsersLoadingSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/40">
            <th className="text-left py-3 px-4 text-white/60">Name</th>
            <th className="text-left py-3 px-4 text-white/60">Email</th>
            <th className="text-left py-3 px-4 text-white/60">Phone</th>
            <th className="text-left py-3 px-4 text-white/60">Type</th>
            <th className="text-left py-3 px-4 text-white/60">Tickets</th>
            <th className="text-left py-3 px-4 text-white/60">Joined</th>
            <th className="text-left py-3 px-4 text-white/60">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, index) => (
            <tr key={index} className="border-b border-white/20">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-white/10 rounded animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InboxLoadingSkeleton() {
  return (
    <main className="h-screen flex">
      {/* Left Section - Conversations List Skeleton */}
      <div className="w-1/4 border-r border-white/20 flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="h-6 w-16 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-10 w-full bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Section - Messages Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
            <div>
              <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse flex-shrink-0" />
              <div className="max-w-[70%] p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/20">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="h-20 w-full bg-white/10 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded animate-pulse" />
              <div className="w-10 h-10 bg-white/10 rounded animate-pulse" />
              <div className="w-10 h-10 bg-green-500/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Participant Info Skeleton */}
      <div className="w-1/4 border-l border-white/20 flex flex-col">
        <div className="p-4 border-b border-white/20">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-24 bg-white/10 rounded animate-pulse mx-auto mb-1" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse mx-auto" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-4 h-4 bg-white/10 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-12 bg-white/10 rounded animate-pulse mb-1" />
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <div className="h-5 w-24 bg-white/10 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
