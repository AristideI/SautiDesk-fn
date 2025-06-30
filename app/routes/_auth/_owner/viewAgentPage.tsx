import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "components/utils/button";
import { LoadingSection } from "components/utils/loadings";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Building,
  Shield,
  Calendar,
  Ticket,
  Paperclip,
  Activity,
  MessageSquare,
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { IUser } from "types/user.type";
import CreateTicketModal from "components/modals/createTicketModal";

type TabType = "tickets" | "activity" | "notes" | "attachments";

export default function ViewAgentPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { organisation, tickets } = useOrganisationContext();
  const [agent, setAgent] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);

  useEffect(() => {
    if (agentId && organisation?.agents) {
      const foundAgent = organisation.agents.find(
        (a) => a.documentId === agentId
      );
      if (foundAgent) {
        setAgent(foundAgent);
      } else {
        toast.error("Agent not found");
        navigate(-1);
      }
      setLoading(false);
    }
  }, [agentId, organisation, navigate]);

  // Filter tickets for this agent
  const agentTickets =
    tickets?.filter((ticket) => ticket.assignedTo?.documentId === agentId) ||
    [];
  const filteredTickets = agentTickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.documentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = () => {
    setIsCreateTicketModalOpen(true);
  };

  const handleCloseCreateTicketModal = () => {
    setIsCreateTicketModalOpen(false);
  };

  const getTicketTypeColor = (type: string) => {
    switch (type) {
      case "TICKET":
        return "bg-blue-500/20 text-blue-400";
      case "INCIDENT":
        return "bg-red-500/20 text-red-400";
      case "REQUEST":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-400";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";
      case "LOW":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return <LoadingSection />;
  }

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-white/40 py-4 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">Agent Details</h1>
        </div>
        <Button
          buttonText="Add New Ticket"
          icon={<Plus size={20} />}
          onPress={handleCreateTicket}
        />
      </header>

      {/* Agent Info Row */}
      <div className="flex items-center gap-4 p-6 border-b border-white/40">
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
          <h2 className="text-xl font-semibold">{agent.username}</h2>
          <div className="flex items-center gap-6 mt-2 text-white/60">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{agent.email}</span>
            </div>
            {agent.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{agent.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Location</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agent Information */}
        <div className="w-1/4 bg-white/5 border-r border-white/20 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6">Agent Information</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-white/60 block mb-1">
                Phone Number
              </label>
              <p className="text-blue-400 font-medium">
                {agent.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">Email</label>
              <p className="text-blue-400 font-medium">{agent.email}</p>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">
                User Role
              </label>
              <p className="text-blue-400 font-medium">{agent.userRole}</p>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">
                Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-white/60" />
                <span>Not specified</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">
                Languages
              </label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-white/60" />
                <span>English</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">
                Response Time
              </label>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white/60" />
                <span>2.5 hours</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">
                Organisation
              </label>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-white/60" />
                <span>{organisation?.name || "Unknown"}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">About</label>
              <p className="text-sm text-white/80">
                Experienced support agent with expertise in customer service and
                technical support. Dedicated to providing excellent customer
                experience and resolving issues efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === "tickets"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-white/60 hover:text-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Ticket size={16} />
                <span>Tickets</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-white/60 hover:text-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <span>Activity</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === "notes"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-white/60 hover:text-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Notes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`px-6 py-3 border-b-2 transition-colors ${
                activeTab === "attachments"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-white/60 hover:text-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Paperclip size={16} />
                <span>Attachments</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "tickets" && (
              <div className="p-6">
                {/* Tickets Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                      size={16}
                    />
                  </div>
                  <Button
                    buttonText="Filter"
                    icon={<Filter size={16} />}
                    variant="secondary"
                    onPress={() => {}}
                  />
                </div>

                {/* Tickets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/40">
                        <th className="text-left py-3 px-4 text-white/60">
                          Ticket ID
                        </th>
                        <th className="text-left py-3 px-4 text-white/60">
                          Title
                        </th>
                        <th className="text-left py-3 px-4 text-white/60">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 text-white/60">
                          Priority
                        </th>
                        <th className="text-left py-3 px-4 text-white/60">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.documentId}
                          className="border-b border-white/20 hover:bg-white/5 cursor-pointer"
                          onClick={() =>
                            navigate(`../tickets/${ticket.documentId}`)
                          }
                        >
                          <td className="py-3 px-4 font-mono text-sm">
                            {ticket.documentId}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {ticket.title}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getTicketTypeColor(
                                ticket.type
                              )}`}
                            >
                              {ticket.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-white/60" />
                              <span className="text-sm">
                                {dayjs(ticket.createdAt).format("DD/MM/YYYY")}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredTickets.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                      {searchQuery
                        ? "No tickets found matching your search."
                        : "No tickets assigned to this agent."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="p-6">
                <div className="text-center py-8 text-white/60">
                  Activity feature coming soon...
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="p-6">
                <div className="text-center py-8 text-white/60">
                  Notes feature coming soon...
                </div>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="p-6">
                <div className="text-center py-8 text-white/60">
                  Attachments feature coming soon...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isModalOpen={isCreateTicketModalOpen}
        isAIModalOpen={false}
        onCloseModal={handleCloseCreateTicketModal}
        onCloseAIModal={() => {}}
        onOpenModal={() => {}}
      />
    </main>
  );
}
