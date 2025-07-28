import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthContext } from "store/auth.context";
import { ViewTicketTabs } from "components/utils/viewTicketTabs";
import { Button } from "components/utils/button";
import { ArrowLeft, Edit, MessageSquare, Clock, User, Tag } from "lucide-react";
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
  comments?: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  }>;
}

export default function AgentViewTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/tickets/${ticketId}`);
      // const data = await response.json();

      // Mock data for now
      const mockTicket: ITicket = {
        id: parseInt(ticketId || "1"),
        title: "Login Issue",
        description:
          "User cannot login to the system. Getting an error message when trying to access the application.",
        status: "in_progress",
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
        comments: [
          {
            id: 1,
            content:
              "I'm experiencing this issue as well. Can you help me resolve it?",
            createdAt: "2024-01-15T10:35:00Z",
            user: {
              id: 2,
              username: "john_doe",
              email: "john@example.com",
            },
          },
          {
            id: 2,
            content:
              "I'm looking into this issue. Can you provide more details about the error message?",
            createdAt: "2024-01-15T11:00:00Z",
            user: {
              id: user?.id || 1,
              username: user?.username || "Agent",
              email: user?.email || "agent@example.com",
            },
          },
        ],
      };

      setTicket(mockTicket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to load ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/tickets/${ticketId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });

      if (ticket) {
        setTicket({ ...ticket, status: newStatus });
        toast.success("Ticket status updated successfully");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-400 bg-blue-500/20";
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20";
      case "resolved":
        return "text-green-400 bg-green-500/20";
      case "closed":
        return "text-gray-400 bg-gray-500/20";
      default:
        return "text-white/50 bg-white/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-400 bg-green-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "high":
        return "text-orange-400 bg-orange-500/20";
      case "urgent":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-white/50 bg-white/10";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-white/10 rounded"></div>
            <div className="h-32 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Ticket not found
        </h2>
        <p className="text-white/70 mb-4">
          The ticket you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/a/tickets")}>Back to Tickets</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/a/tickets")}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
            <p className="text-white/70">Ticket #{ticket.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status.replace("_", " ").toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
              ticket.priority
            )}`}
          >
            {ticket.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Description
            </h2>
            <p className="text-white/80 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Comments Section */}
          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Comments</h2>
              <Button size="sm">
                <MessageSquare size={16} />
                Add Comment
              </Button>
            </div>

            {ticket.comments && ticket.comments.length > 0 ? (
              <div className="space-y-4">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-white/10 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center">
                        <span className="text-green text-sm font-medium">
                          {comment.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {comment.user.username}
                          </span>
                          <span className="text-xs text-white/50">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-center py-8">No comments yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Update Status
            </h3>
            <div className="space-y-2">
              {["open", "in_progress", "resolved", "closed"].map((status) => (
                <Button
                  key={status}
                  variant={ticket.status === status ? "default" : "ghost"}
                  onClick={() => updateTicketStatus(status)}
                  disabled={isUpdating}
                  className="w-full justify-start"
                >
                  {ticket.status === status && "✓ "}
                  {status.replace("_", " ").toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Ticket Info */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Ticket Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={16} className="text-white/50" />
                <div>
                  <p className="text-sm text-white/50">Created by</p>
                  <p className="text-white">{ticket.createdBy.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={16} className="text-white/50" />
                <div>
                  <p className="text-sm text-white/50">Created</p>
                  <p className="text-white">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Edit size={16} className="text-white/50" />
                <div>
                  <p className="text-sm text-white/50">Last updated</p>
                  <p className="text-white">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
