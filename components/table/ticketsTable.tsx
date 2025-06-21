import { LoadingSection } from "components/utils/loadings";
import type { ITicket } from "types/ticket.types";
import { TicketType } from "types/ticket.types";
import { ticketTypeIcons } from "constants/typeIcons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";

interface TicketsTableProps {
  tickets: ITicket[];
  isLoading?: boolean;
  filteredTickets?: ITicket[];
  getActiveFiltersCount?: () => number;
}

export default function TicketsTable({
  tickets,
  isLoading = false,
  filteredTickets,
  getActiveFiltersCount = () => 0,
}: TicketsTableProps) {
  const displayTickets = filteredTickets || tickets;
  const navigate = useNavigate();
  const { organisationId } = useParams();

  return (
    <article className="flex-1 p-6">
      {isLoading ? (
        <LoadingSection />
      ) : displayTickets && displayTickets?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="font-semibold">
              <tr className="border-b border-white/40">
                <th className="text-left py-3 px-4 text-white/60">Ticket ID</th>
                <th className="text-left py-3 px-4 text-white/60">Title</th>
                <th className="text-left py-3 px-4 text-white/60">Type</th>
                <th className="text-left py-3 px-4 text-white/60">Status</th>
                <th className="text-left py-3 px-4 text-white/60">Priority</th>
                <th className="text-left py-3 px-4 text-white/60">
                  Assigned To
                </th>
                <th className="text-left py-3 px-4 text-white/60">
                  Request Date
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {displayTickets.map((ticket: ITicket) => {
                const TypeIcon =
                  ticketTypeIcons[ticket.type] ||
                  ticketTypeIcons[TicketType.OTHER];
                return (
                  <tr
                    key={ticket.id}
                    className="border-b border-white/20 hover:bg-white/5"
                    onClick={() => navigate(`${ticket.documentId}`)}
                  >
                    <td className="py-3 px-4">{ticket.documentId}</td>
                    <td className="py-3 px-4">{ticket.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon size={16} className="text-white/60" />
                        <span className="text-white/80">{ticket.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.state === "OPEN"
                            ? "bg-blue-500/20 text-blue-400"
                            : ticket.state === "IN_PROGRESS"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : ticket.state === "RESOLVED"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {ticket.state}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs ${
                          ticket.priority === "HIGH"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 flex items-center gap-2 cursor-pointer"
                      onClick={(e) => {
                        console.log("clicked");
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(
                          `/o/organisations/${organisationId}/agents/${ticket.assignedTo?.documentId}`
                        );
                      }}
                    >
                      {ticket.assignedTo?.profile?.url ? (
                        <img
                          src={ticket.assignedTo.profile.url}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-xs text-white/60">?</span>
                        </div>
                      )}
                      {ticket.assignedTo
                        ? ticket.assignedTo.username
                        : "Unassigned"}
                    </td>
                    <td className="py-3 px-4">
                      {dayjs(ticket.createdAt).format("DD/MM/YYYY, HH:mm")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-white/60">
          {getActiveFiltersCount() > 0
            ? "No tickets match your filters"
            : "No tickets found"}
        </div>
      )}
    </article>
  );
}
