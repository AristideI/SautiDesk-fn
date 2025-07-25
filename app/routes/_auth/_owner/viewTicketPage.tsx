import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "components/utils/button";
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  CheckSquare,
  Pin,
  TrendingUp,
} from "lucide-react";
import { useAuthContext } from "store/auth.context";
import { API } from "api";
import { toast } from "react-hot-toast";
import type { IComment } from "types/comment.type";
import { TicketState } from "types/ticket.types";
import { useOrganisationContext } from "store/organisation.context";
import { usePinsContext } from "store/pins.context";
import { TicketLoadingSkeleton } from "components/utils/orgSkeleton";
import TicketModals from "components/modals/ticketModals";
import ViewTicketTabs from "components/utils/viewTicketTabs";

type TabType = "tasks" | "conversation" | "notes" | "insights";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export default function ViewTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tickets, loading, organisation } = useOrganisationContext();
  const ticket = tickets?.find((t) => t.documentId === ticketId);

  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [comments, setComments] = useState<IComment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showEditSimilarTicketsModal, setShowEditSimilarTicketsModal] =
    useState(false);
  const [selectedSimilarTickets, setSelectedSimilarTickets] = useState<
    string[]
  >([]);
  const [isSimilarTicketsDropdownOpen, setIsSimilarTicketsDropdownOpen] =
    useState(false);

  const { pinnedStore, pinTicket, unpinTicket } = usePinsContext();
  const similarTicketsRef = useRef<HTMLDivElement>(null);

  // Initialize selected similar tickets when modal opens
  useEffect(() => {
    if (showEditSimilarTicketsModal && ticket?.similarTickets) {
      setSelectedSimilarTickets(ticket.similarTickets.map((t) => t.documentId));
    }
  }, [showEditSimilarTicketsModal, ticket?.similarTickets]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        similarTicketsRef.current &&
        !similarTicketsRef.current.contains(event.target as Node)
      ) {
        setIsSimilarTicketsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePinTicket = async () => {
    if (!ticket) return;

    try {
      await pinTicket(ticket);
      toast.success("Ticket pinned successfully");
    } catch (error) {
      console.error("Error pinning ticket:", error);
      toast.error("Failed to pin ticket");
    }
  };

  const handleUnpinTicket = async () => {
    if (!ticket) return;

    try {
      await unpinTicket(ticket);
      toast.success("Ticket unpinned successfully");
    } catch (error) {
      console.error("Error unpinning ticket:", error);
      toast.error("Failed to unpin ticket");
    }
  };

  const isTicketPinned = () => {
    if (!ticket) return false;
    return (
      pinnedStore.tickets?.some((t) => t.documentId === ticket.documentId) ||
      false
    );
  };

  // Fetch comments for this ticket
  useEffect(() => {
    if (ticketId && activeTab === "conversation") {
      fetchComments();
    }
  }, [ticketId, activeTab]);

  const fetchComments = async () => {
    if (!ticketId) return;

    setIsLoadingComments(true);
    try {
      const response = await API.commentHandler.findByTicketId(
        ticket?.id || ""
      );
      setComments(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;

    try {
      await API.ticketHandler.update(ticket.documentId, {
        state: TicketState.CLOSED,
      });
      toast.success("Ticket closed successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close ticket");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !user) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: user.documentId,
      createdAt: new Date(),
    };

    setNotes((prev) => [...prev, note]);
    setNewNote("");
    setShowNoteModal(false);
    toast.success("Note added");
  };

  const handleSimilarTicketToggle = (ticketId: string) => {
    setSelectedSimilarTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSaveSimilarTickets = async () => {
    if (!ticket) return;

    try {
      await API.ticketHandler.update(ticket.documentId, {
        similarTickets: selectedSimilarTickets,
      });

      // Refresh the page to show updated data
      window.location.reload();
      toast.success("Similar tickets updated successfully!");
    } catch (error) {
      console.error("Error updating similar tickets:", error);
      toast.error("Failed to update similar tickets");
    }
  };

  if (loading) {
    return <TicketLoadingSkeleton />;
  }

  if (!ticket) {
    return (
      <main className="flex-1 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Ticket not found</h2>
          <Button buttonText="Go Back" onPress={() => navigate(-1)} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-black/50 border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Ticket List</span>
            </button>
          </div>
          <div>
            <h1 className="text-xl font-semibold">{ticket.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={isTicketPinned() ? handleUnpinTicket : handlePinTicket}
              className={`p-2 rounded-full transition-colors ${
                isTicketPinned()
                  ? "text-green hover:text-green/80 hover:bg-green/10"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title={isTicketPinned() ? "Unpin ticket" : "Pin ticket"}
            >
              <Pin size={20} />
            </button>
            <Button
              buttonText="Submit as Closed"
              onPress={handleCloseTicket}
              variant="secondary"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/20 border-b border-white/20">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "tasks"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <FileText size={16} />
            <span>Ticket Info</span>
          </button>
          <button
            onClick={() => setActiveTab("conversation")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "conversation"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <MessageCircle size={16} />
            <span>Comments</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "notes"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <CheckSquare size={16} />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "insights"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <TrendingUp size={16} />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <ViewTicketTabs
        activeTab={activeTab}
        ticket={ticket}
        organisation={organisation ?? undefined}
        comments={comments}
        notes={notes}
        isLoadingComments={isLoadingComments}
        showNoteModal={showNoteModal}
        showEditSimilarTicketsModal={showEditSimilarTicketsModal}
        setShowNoteModal={setShowNoteModal}
        setShowEditSimilarTicketsModal={setShowEditSimilarTicketsModal}
      />

      <TicketModals
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showEditSimilarTicketsModal={showEditSimilarTicketsModal}
        setShowEditSimilarTicketsModal={setShowEditSimilarTicketsModal}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
        isSimilarTicketsDropdownOpen={isSimilarTicketsDropdownOpen}
        setIsSimilarTicketsDropdownOpen={setIsSimilarTicketsDropdownOpen}
        selectedSimilarTickets={selectedSimilarTickets}
        tickets={tickets || []}
        handleSimilarTicketToggle={handleSimilarTicketToggle}
        handleSaveSimilarTickets={handleSaveSimilarTickets}
      />
    </main>
  );
}
