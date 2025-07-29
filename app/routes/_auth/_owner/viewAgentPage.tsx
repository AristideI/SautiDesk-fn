import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "components/utils/button";
import { AgentLoadingSkeleton } from "components/utils/orgSkeleton";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building,
  Shield,
  Calendar,
  Ticket,
  Paperclip,
  Activity,
  MessageSquare,
  Pin,
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import { usePinsContext } from "store/pins.context";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import type { IUser } from "types/user.type";
import CreateTicketModal from "components/modals/createTicketModal";
import type { ITicket } from "types/ticket.types";

type TabType = "information" | "tickets" | "activity" | "notes" | "attachments";

export default function ViewAgentPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { organisation, tickets } = useOrganisationContext();
  const { pinnedStore, pinTicket, unpinTicket, pinAgent, unpinAgent } =
    usePinsContext();
  const [agent, setAgent] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);

  console.log(agent);

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

  // Get agent-specific data
  const agentData = agent?.agent;

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

  const handlePinTicket = async (ticket: ITicket) => {
    try {
      await pinTicket(ticket);
      toast.success("Ticket pinned successfully");
    } catch (error) {
      console.error("Error pinning ticket:", error);
      toast.error("Failed to pin ticket");
    }
  };

  const handleUnpinTicket = async (ticket: ITicket) => {
    try {
      await unpinTicket(ticket);
      toast.success("Ticket unpinned successfully");
    } catch (error) {
      console.error("Error unpinning ticket:", error);
      toast.error("Failed to unpin ticket");
    }
  };

  const isTicketPinned = (ticketId: string) => {
    return (
      pinnedStore.tickets?.some((ticket) => ticket.documentId === ticketId) ||
      false
    );
  };

  const handlePinAgent = async () => {
    if (!agent) return;

    try {
      await pinAgent(agent);
      toast.success("Agent pinned successfully");
    } catch (error) {
      console.error("Error pinning agent:", error);
      toast.error("Failed to pin agent");
    }
  };

  const handleUnpinAgent = async () => {
    if (!agent) return;

    try {
      await unpinAgent(agent);
      toast.success("Agent unpinned successfully");
    } catch (error) {
      console.error("Error unpinning agent:", error);
      toast.error("Failed to unpin agent");
    }
  };

  const isAgentPinned = () => {
    if (!agent) return false;
    return (
      pinnedStore.agents?.some((a) => a.documentId === agent.documentId) ||
      false
    );
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
    return <AgentLoadingSkeleton />;
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
        <div className="flex items-center gap-4">
          <button
            onClick={isAgentPinned() ? handleUnpinAgent : handlePinAgent}
            className={`p-2 rounded-full transition-colors ${
              isAgentPinned()
                ? "text-green hover:text-green/80 hover:bg-green/10"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            title={isAgentPinned() ? "Unpin agent" : "Pin agent"}
          >
            <Pin size={20} />
          </button>
          <Button
            buttonText="Add New Ticket"
            icon={<Plus size={20} />}
            onPress={handleCreateTicket}
          />
        </div>
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
          <p className="text-white/60 text-sm mt-1">
            {agentData?.title || "Support Agent"}
          </p>
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
              <span>{agentData?.languages || "English"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-white/20">
          <button
            onClick={() => setActiveTab("information")}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === "information"
                ? "border-green-500 text-green-400"
                : "border-transparent text-white/60 hover:text-white/80"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Information</span>
            </div>
          </button>
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
          {activeTab === "information" && (
            <div className="p-6 space-y-6">
              {/* About Section - Moved to Top */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-green-400" />
                  About
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  {agentData?.about ||
                    "Experienced support agent with expertise in customer service and technical support. Dedicated to providing excellent customer experience and resolving issues efficiently."}
                </p>
              </div>

              {/* Main Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-blue-400" />
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-white/60" />
                        <span className="text-sm text-white/60">
                          Phone Number
                        </span>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {agent.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-white/60" />
                        <span className="text-sm text-white/60">Email</span>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {agent.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield size={16} className="text-white/60" />
                        <span className="text-sm text-white/60">User Role</span>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {agent.userRole}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-white/60" />
                        <span className="text-sm text-white/60">Languages</span>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {agentData?.languages || "English"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building size={16} className="text-white/60" />
                        <span className="text-sm text-white/60">
                          Organisation
                        </span>
                      </div>
                      <span className="text-blue-400 font-medium">
                        {organisation?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            agentData?.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-white/60">Status</span>
                      </div>
                      <span
                        className={`font-medium ${
                          agentData?.isActive
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {agentData?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-green-400" />
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    {agentData?.areaOfExpertise && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/60 block mb-2">
                          Area of Expertise
                        </label>
                        <div className="space-y-2">
                          <p className="text-blue-400 font-medium">
                            {agentData.areaOfExpertise.category}
                          </p>
                          {agentData.areaOfExpertise.skills &&
                            agentData.areaOfExpertise.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {agentData.areaOfExpertise.skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                    {agentData?.qualification && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/60 block mb-2">
                          Certifications
                        </label>
                        <div className="space-y-1">
                          {agentData.qualification.certifications.map(
                            (cert, index) => (
                              <p
                                key={index}
                                className="text-blue-400 font-medium"
                              >
                                {cert}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {agentData?.education && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/60 block mb-2">
                          Education
                        </label>
                        <div className="space-y-1">
                          <p className="text-blue-400 font-medium">
                            {agentData.education.degree}
                          </p>
                          <p className="text-white/80 text-sm">
                            {agentData.education.institution}
                          </p>
                          <p className="text-white/60 text-sm">
                            {agentData.education.yearGraduated}
                          </p>
                        </div>
                      </div>
                    )}
                    {agentData?.experience && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-white/60" />
                          <span className="text-sm text-white/60">
                            Experience
                          </span>
                        </div>
                        <span className="text-blue-400 font-medium">
                          {agentData.experience} years
                        </span>
                      </div>
                    )}
                    {agentData?.rating && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${
                                  i < Math.floor(agentData.rating!)
                                    ? "bg-yellow-400"
                                    : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-white/60">Rating</span>
                        </div>
                        <span className="text-blue-400 font-medium">
                          {agentData.rating}/5
                        </span>
                      </div>
                    )}
                    {agentData?.specializations && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="text-sm text-white/60 block mb-2">
                          Specializations
                        </label>
                        <p className="text-blue-400 font-medium">
                          {agentData.specializations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              {agentData?.interests && agentData.interests.length > 0 && (
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-purple-400" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {agentData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                        className="border-b border-white/20 hover:bg-white/5"
                      >
                        <td className="py-3 px-4 font-mono text-sm">
                          {ticket.documentId}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <span
                              className="cursor-pointer hover:text-green transition-colors"
                              onClick={() =>
                                navigate(`../tickets/${ticket.documentId}`)
                              }
                            >
                              {ticket.title}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isTicketPinned(ticket.documentId)) {
                                  handleUnpinTicket(ticket);
                                } else {
                                  handlePinTicket(ticket);
                                }
                              }}
                              className={`p-1 rounded-full transition-colors ${
                                isTicketPinned(ticket.documentId)
                                  ? "text-green hover:text-green/80"
                                  : "text-white/40 hover:text-white/60"
                              }`}
                              title={
                                isTicketPinned(ticket.documentId)
                                  ? "Unpin ticket"
                                  : "Pin ticket"
                              }
                            >
                              <Pin size={16} />
                            </button>
                          </div>
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-green-400" />
                  Agent Activities
                </h3>
                <p className="text-sm text-white/60">
                  Recent activities and actions performed by this agent
                </p>
              </div>

              {agent?.activities && agent.activities.length > 0 ? (
                <div className="space-y-4">
                  {agent.activities.map((activity) => (
                    <div
                      key={activity.documentId}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-sm text-white/60">
                            {dayjs(activity.createdAt).format(
                              "MMM DD, YYYY HH:mm"
                            )}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {activity.content}
                      </p>
                      {activity.ticket && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Ticket size={14} className="text-white/60" />
                            <span className="text-xs text-white/60">
                              Related Ticket:
                            </span>
                            <span
                              className="text-xs text-blue-400 cursor-pointer hover:underline"
                              onClick={() =>
                                navigate(
                                  `../tickets/${activity.ticket?.documentId}`
                                )
                              }
                            >
                              {activity.ticket.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity size={48} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">
                    No activities found for this agent
                  </p>
                  <p className="text-sm text-white/40 mt-2">
                    Activities will appear here when the agent performs actions
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-green-400" />
                  Agent Notes
                </h3>
                <p className="text-sm text-white/60">
                  Notes and comments created by this agent
                </p>
              </div>

              {agent?.notes && agent.notes.length > 0 ? (
                <div className="space-y-4">
                  {agent.notes.map((note) => (
                    <div
                      key={note.documentId}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-sm text-white/60">
                            {dayjs(note.createdAt).format("MMM DD, YYYY HH:mm")}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            note.type === "INTERNAL"
                              ? "bg-blue-500/20 text-blue-400"
                              : note.type === "PRIVATE"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {note.type}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed mb-3">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Ticket size={14} />
                        <span>Ticket:</span>
                        <span
                          className="text-blue-400 cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(`../tickets/${note.ticket.documentId}`)
                          }
                        >
                          {note.ticket.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare
                    size={48}
                    className="text-white/20 mx-auto mb-4"
                  />
                  <p className="text-white/60">No notes found for this agent</p>
                  <p className="text-sm text-white/40 mt-2">
                    Notes will appear here when the agent creates comments
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Paperclip size={20} className="text-green-400" />
                  Agent Attachments
                </h3>
                <p className="text-sm text-white/60">
                  Files and documents associated with this agent
                </p>
              </div>

              <div className="text-center py-12">
                <Paperclip size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/60">
                  No attachments found for this agent
                </p>
                <p className="text-sm text-white/40 mt-2">
                  Attachments will appear here when files are uploaded or linked
                  to this agent
                </p>
              </div>
            </div>
          )}
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
