import { useState, useEffect } from "react";
import { useAuthContext } from "store/auth.context";
import { TicketsTable } from "components/table/ticketsTable";
import { TableSkeletons } from "components/utils/tableSkeletons";
import { Button } from "components/utils/button";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

interface ITicket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: number;
    username: string;
    email: string;
  };
  createdBy: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AgentTicketsPage() {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  const fetchAgentTickets = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call to fetch tickets assigned to the agent
      // const response = await fetch(`/api/tickets/agent/${user?.id}`);
      // const data = await response.json();

      // Mock data for now
      const mockTickets: ITicket[] = [
        {
          id: 1,
          title: "Login Issue",
          description: "User cannot login to the system",
          status: "open",
          priority: "high",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T14:20:00Z",
          assignedTo: {
            id: user?.id || 1,
            username: user?.username || "Agent",
            email: user?.email || "agent@example.com",
          },
          createdBy: {
            id: 2,
            username: "john_doe",
            email: "john@example.com",
          },
        },
        {
          id: 2,
          title: "Password Reset",
          description: "Need help resetting password",
          status: "in_progress",
          priority: "medium",
          createdAt: "2024-01-14T09:15:00Z",
          updatedAt: "2024-01-15T11:45:00Z",
          assignedTo: {
            id: user?.id || 1,
            username: user?.username || "Agent",
            email: user?.email || "agent@example.com",
          },
          createdBy: {
            id: 3,
            username: "jane_smith",
            email: "jane@example.com",
          },
        },
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return <TableSkeletons />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tickets</h1>
          <p className="text-white/70 mt-1">Manage tickets assigned to you</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green/50"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green/50"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Tickets Table */}
      {filteredTickets.length > 0 ? (
        <TicketsTable tickets={filteredTickets} />
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No tickets found
          </h3>
          <p className="text-white/50">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You don't have any tickets assigned yet"}
          </p>
        </div>
      )}
    </div>
  );
}
