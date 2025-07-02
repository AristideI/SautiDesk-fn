import { useNavigate } from "react-router";
import Button from "components/utils/button";
import { X, Shield, Building, MapPin, Globe, Calendar } from "lucide-react";
import dayjs from "dayjs";
import type { IUser } from "types/user.type";
import type { ITicket } from "types/ticket.types";

interface AgentModalProps {
  agent: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  tickets: ITicket[] | null;
}

export default function AgentModal({
  agent,
  isOpen,
  onClose,
  tickets,
}: AgentModalProps) {
  const navigate = useNavigate();

  if (!agent) return null;

  // Calculate stats
  const allTickets =
    tickets?.filter(
      (ticket) => ticket.assignedTo?.documentId === agent.documentId
    ) || [];
  const unresolvedTickets = allTickets.filter(
    (ticket) => ticket.state !== "RESOLVED"
  );
  const responseTime = "2.5h"; // This would be calculated from actual data

  // Get first 2 tickets (prioritize unresolved)
  const displayTickets =
    unresolvedTickets.length > 0
      ? unresolvedTickets.slice(0, 2)
      : allTickets.slice(0, 2);

  const handleViewFullDetails = () => {
    onClose();
    navigate(`${agent.documentId}`);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-black border-l border-white/20 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Agent Preview</h2>
          <div className="flex gap-2">
            <Button
              buttonText="View Full Details"
              variant="secondary"
              onPress={handleViewFullDetails}
              className="text-sm"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center gap-4 mb-6">
          {agent.profile?.url ? (
            <img
              src={agent.profile.url}
              alt={agent.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
              <Shield size={24} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{agent.username}</h3>
            <p className="text-white/60">{agent.email}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Building size={16} />
              <span>Organisation</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {allTickets.length}
            </div>
            <div className="text-sm text-white/60">All Tickets</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {unresolvedTickets.length}
            </div>
            <div className="text-sm text-white/60">Unsolved</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {responseTime}
            </div>
            <div className="text-sm text-white/60">Response Time</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">4.8</div>
            <div className="text-sm text-white/60">Rating</div>
          </div>
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-white/60 mb-1 block">
                Full Name
              </label>
              <p className="font-medium">{agent.username}</p>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-white/60 mb-1 block">Email</label>
              <p className="font-medium">{agent.email}</p>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-white/60 mb-1 block">Phone</label>
              <p className="font-medium">{agent.phone || "Not provided"}</p>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-white/60 mb-1 block">
                Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-white/60" />
                <span>Not specified</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-white/60 mb-1 block">
                Languages
              </label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-white/60" />
                <span>English</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">
                Organisation
              </label>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-white/60" />
                <span>Organisation Name</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">
                Description
              </label>
              <p className="text-sm">
                Experienced support agent with expertise in customer service and
                technical support.
              </p>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">
                Created At
              </label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-white/60" />
                <span>{dayjs(agent.createdAt).format("DD/MM/YYYY HH:mm")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
          {displayTickets.length > 0 ? (
            <div className="space-y-3">
              {displayTickets.map((ticket, index) => (
                <div key={ticket.documentId} className="flex gap-4">
                  <div className="flex-1 bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.type === "TICKET"
                            ? "bg-blue-500/20 text-blue-400"
                            : ticket.type === "INCIDENT"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.type === "REQUEST"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {ticket.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ticket.priority === "HIGH"
                            ? "bg-red-500/20 text-red-400"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">{ticket.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar size={14} />
                      <span>
                        {dayjs(ticket.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  {index < displayTickets.length - 1 && (
                    <div className="w-px bg-white/20"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              No tickets assigned to this agent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
