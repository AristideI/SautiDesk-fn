import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import { useNavigate } from "react-router";
import type { IUser } from "types/user.type";
import AgentModal from "components/modals/agentModal";
import { getTicketCount } from "helpers/getTicketCount";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CreateAgentModal } from "components/modals/createAgentModal";

dayjs.extend(relativeTime);

export default function OrgUsersPage() {
  const { agents, tickets } = useOrganisationContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
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
            onPress={handleOpenCreateModal}
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
                        {getTicketCount(tickets, agent.documentId)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-white/60" />
                      <span>{dayjs(agent.createdAt).fromNow(true)}</span>
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
      <AgentModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tickets={tickets}
      />

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </main>
  );
}
