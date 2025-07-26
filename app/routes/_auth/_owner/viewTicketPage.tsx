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
  X,
  Loader2,
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
import type { INote, INoteCreate } from "types/note.type";

type TabType = "tasks" | "conversation" | "notes" | "insights";

export default function ViewTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tickets, loading, organisation } = useOrganisationContext();
  const ticket = tickets?.find((t) => t.documentId === ticketId);

  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const [comments, setComments] = useState<IComment[]>([]);
  const [notes, setNotes] = useState<INote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"INTERNAL" | "PRIVATE" | "SYSTEM">(
    "INTERNAL"
  );
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showEditSimilarTicketsModal, setShowEditSimilarTicketsModal] =
    useState(false);
  const [selectedSimilarTickets, setSelectedSimilarTickets] = useState<
    string[]
  >([]);
  const [isSimilarTicketsDropdownOpen, setIsSimilarTicketsDropdownOpen] =
    useState(false);
  const [showStateUpdateModal, setShowStateUpdateModal] = useState(false);
  const [selectedState, setSelectedState] = useState<TicketState>(
    TicketState.CLOSED
  );
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const { pinnedStore, pinTicket, unpinTicket } = usePinsContext();
  const similarTicketsRef = useRef<HTMLDivElement>(null);

  // Initialize selected similar tickets when modal opens
  useEffect(() => {
    if (showEditSimilarTicketsModal && ticket?.similarTickets) {
      setSelectedSimilarTickets(ticket.similarTickets.map((t) => t.documentId));
    }
  }, [showEditSimilarTicketsModal, ticket?.similarTickets]);

  useEffect(() => {
    if (ticket?.notes) {
      setNotes(ticket.notes);
    }
  }, [ticket]);

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

    setIsUpdatingState(true);
    try {
      await API.ticketHandler.update(ticket.documentId, {
        state: selectedState,
      });
      toast.success(`Ticket updated to ${selectedState} successfully`);
      setShowStateUpdateModal(false);
      navigate(-1);
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    } finally {
      setIsUpdatingState(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user || !ticket) return;

    try {
      const noteData: INoteCreate = {
        content: newNote.trim(),
        author: user.id.toString(),
        ticket: ticket.id,
        type: noteType,
      };

      const resultNote = await API.noteHandler.createNote(noteData);

      // Reset form
      setNewNote("");
      setNoteType("INTERNAL");
      setShowNoteModal(false);
      toast.success("Note added successfully");

      setNotes((prev) => [...prev, resultNote.data]);
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
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
              buttonText="Update Ticket State"
              onPress={() => setShowStateUpdateModal(true)}
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

      {/* State Update Modal */}
      {showStateUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Ticket State</h3>
              <button
                onClick={() => setShowStateUpdateModal(false)}
                className="text-white/60 hover:text-white"
                disabled={isUpdatingState}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select New State
              </label>
              <select
                value={selectedState}
                onChange={(e) =>
                  setSelectedState(e.target.value as TicketState)
                }
                className="w-full bg-gray-800 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-green"
                disabled={isUpdatingState}
              >
                {Object.values(TicketState).map((state) => (
                  <option key={state} value={state}>
                    {state.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onPress={() => setShowStateUpdateModal(false)}
                variant="secondary"
                className="flex-1"
                disabled={isUpdatingState}
              />
              <Button
                buttonText={isUpdatingState ? "Updating..." : "Update State"}
                onPress={handleCloseTicket}
                className="flex-1"
                disabled={isUpdatingState}
                icon={
                  isUpdatingState ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : undefined
                }
              />
            </div>
          </div>
        </div>
      )}

      <TicketModals
        showNoteModal={showNoteModal}
        setShowNoteModal={setShowNoteModal}
        showEditSimilarTicketsModal={showEditSimilarTicketsModal}
        setShowEditSimilarTicketsModal={setShowEditSimilarTicketsModal}
        newNote={newNote}
        setNewNote={setNewNote}
        noteType={noteType}
        setNoteType={setNoteType}
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
