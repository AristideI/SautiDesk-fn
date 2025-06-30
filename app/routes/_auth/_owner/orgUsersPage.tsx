import React, { useState, useRef, useEffect } from "react";
import Button from "components/utils/button";
import {
  Search,
  UserPlus,
  Users,
  Shield,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  UserX,
  Calendar,
  Ticket,
  X,
  MapPin,
  Globe,
  Building,
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import type { IUser } from "types/user.type";
import type { ITicket } from "types/ticket.types";

interface AgentModalProps {
  agent: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  tickets: ITicket[] | null;
}

function AgentPreviewModal({
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
                <span>N/A</span>
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

export default function OrgUsersPage() {
  const { agents, tickets } = useOrganisationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  console.log(agents);

  // Count tickets assigned to each agent
  const getTicketCount = (agentId: string) => {
    if (!tickets) return 0;
    return tickets.filter((ticket) => ticket.assignedTo?.documentId === agentId)
      .length;
  };

  // Filter agents based on search query
  const filteredAgents =
    agents?.filter(
      (agent) =>
        agent.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Close actions menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionsMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewDetails = (agentId: string) => {
    setOpenActionsMenu(null);
    navigate(`agents/${agentId}`);
  };

  const handleDisableAgent = (agentId: string) => {
    setOpenActionsMenu(null);
    // TODO: Implement disable agent functionality
    console.log("Disable agent:", agentId);
  };

  const handleAgentClick = (agent: IUser) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  return (
    <main>
      <article className="flex justify-between items-center border-b border-white/40 py-4 px-6">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <section className="flex gap-4">
          <Button
            buttonText="Invite Agent"
            variant="secondary"
            icon={<UserPlus size={20} />}
            onPress={() => {}}
            className="border-white/50 hover:bg-white/10 text-white/50"
          />
          <Button
            buttonText="Add Agent"
            icon={<Users size={20} />}
            onPress={() => {}}
          />
        </section>
      </article>

      <article className="flex w-full py-4 border-b border-white/40 px-6 gap-4">
        <label className="w-1/5 relative mr-12">
          <input
            type="text"
            className="border border-white/30 rounded-lg w-full px-4 pl-8 py-1 outline-none"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute top-1/5 left-2"
            color="#ffffff60"
            size={20}
          />
        </label>
      </article>

      <article className="flex-1 p-6">
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
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.documentId}
                  className="border-b border-white/20 hover:bg-white/5 cursor-pointer"
                  onClick={() => handleAgentClick(agent)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {agent.profile?.url ? (
                        <img
                          src={agent.profile.url}
                          alt={agent.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                      )}
                      <span className="font-medium">{agent.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-white/60" />
                      <span>{agent.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {agent.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-white/60" />
                        <span>{agent.phone}</span>
                      </div>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        agent.userRole === "ADMIN"
                          ? "bg-purple-500/20 text-purple-400"
                          : agent.userRole === "AGENT"
                          ? "bg-blue-500/20 text-blue-400"
                          : agent.userRole === "SUPER_ADMIN"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {agent.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-white/60" />
                      <span className="font-medium">
                        {getTicketCount(agent.documentId)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-white/60" />
                      <span>N/A</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionsMenu(
                            openActionsMenu === agent.documentId
                              ? null
                              : agent.documentId
                          );
                        }}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openActionsMenu === agent.documentId && (
                        <div
                          ref={actionsMenuRef}
                          className="absolute right-0 top-full mt-1 bg-black border border-white/20 rounded-lg z-10 min-w-[160px]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(agent.documentId);
                            }}
                            className="w-full px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-sm"
                          >
                            <Eye size={16} />
                            View Full Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisableAgent(agent.documentId);
                            }}
                            className="w-full px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-sm text-red-400"
                          >
                            <UserX size={16} />
                            Disable Agent
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAgents.length === 0 && (
            <div className="text-center py-8 text-white/60">
              {searchQuery
                ? "No agents found matching your search."
                : "No agents found."}
            </div>
          )}
        </div>
      </article>

      {/* Agent Preview Modal */}
      <AgentPreviewModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tickets={tickets}
      />
    </main>
  );
}
