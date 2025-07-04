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
