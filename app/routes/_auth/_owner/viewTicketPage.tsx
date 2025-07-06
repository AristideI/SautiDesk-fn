import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "components/utils/button";
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  User,
  CheckSquare,
  X,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  UserCheck,
  Building,
  Paperclip,
  Pin,
  Activity,
  TrendingUp,
  GitBranch,
} from "lucide-react";
import { useAuthContext } from "store/auth.context";
import { API } from "api";
import { toast } from "react-hot-toast";
import type { IComment } from "types/comment.type";
import { TicketState } from "types/ticket.types";
import { ticketTypeIcons } from "constants/typeIcons";
import dayjs from "dayjs";
import { useOrganisationContext } from "store/organisation.context";
import { getPriorityColor, getStateColor } from "utils/getColors";
import { usePinsContext } from "store/pins.context";
import { TicketLoadingSkeleton } from "components/utils/orgSkeleton";

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
  const [newComment, setNewComment] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const { pinnedStore, pinTicket, unpinTicket } = usePinsContext();

  console.log(ticket?.activities);

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
      await API.ticketHandler.updateState(
        ticket.documentId,
        TicketState.CLOSED
      );
      toast.success("Ticket closed successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close ticket");
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !user || !ticketId) return;

    try {
      const commentData = {
        content: newComment,
        author: user.documentId!,
        ticket: ticketId,
      };

      await API.commentHandler.create(commentData);
      setNewComment("");
      toast.success("Comment sent");

      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error("Error sending comment:", error);
      toast.error("Failed to send comment");
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

  const TypeIcon = ticketTypeIcons[ticket.type] || ticketTypeIcons.OTHER;

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
      <div className="flex-1 overflow-hidden">
        {activeTab === "tasks" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Basic Information */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Title
                    </label>
                    <p className="text-white/80">{ticket.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Type
                    </label>
                    <div className="flex items-center gap-2">
                      <TypeIcon size={16} className="text-white/60" />
                      <span className="text-white/80">{ticket.type}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Priority
                    </label>
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        size={16}
                        className={getPriorityColor(ticket.priority)}
                      />
                      <span className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      State
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className={getStateColor(ticket.state)}
                      />
                      <span className={getStateColor(ticket.state)}>
                        {ticket.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-white/80 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Assignment Information */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Owned By
                    </label>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-white/60" />
                      <span className="text-white/80">
                        {ticket.ownedBy?.username || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Assigned To
                    </label>
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-white/60" />
                      <span className="text-white/80">
                        {ticket.assignedTo?.username || "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Organisation
                    </label>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-white/60" />
                      <span className="text-white/80">
                        {organisation?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Created At
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      <span className="text-white/80">
                        {dayjs(ticket.createdAt).format("MMM DD, YYYY HH:mm")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">
                      Updated At
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      <span className="text-white/80">
                        {dayjs(ticket.updatedAt).format("MMM DD, YYYY HH:mm")}
                      </span>
                    </div>
                  </div>
                  {ticket.tags && (
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">
                        Tags
                      </label>
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-white/60" />
                        <span className="text-white/80">{ticket.tags}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "conversation" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingComments ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-white/60">Loading comments. ..</div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-white/60">No comments yet</div>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green/20 rounded-full flex items-center justify-center">
                      {comment.author?.profile?.profile ? (
                        <img
                          src={comment.author?.profile?.url}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={25} className="text-green" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white/80">
                            {comment.author?.username || "Unknown User"}
                          </span>
                          <span className="text-xs text-white/40">
                            {dayjs(comment.createdAt).format("MMM DD, HH:mm")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {comment.attachments &&
                            comment.attachments.length > 0 && (
                              <div className="flex items-center gap-1 text-white/60 text-xs">
                                <Paperclip size={12} />
                                <span>{comment.attachments.length}</span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/80">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
                />
                <Button buttonText="Send" onPress={handleSendComment} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <Button
                buttonText="Add Note"
                onPress={() => setShowNoteModal(true)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {notes.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-white/60">No notes yet</div>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white/80">
                        {note.author}
                      </span>
                      <span className="text-xs text-white/40">
                        {dayjs(note.createdAt).format("MMM DD, HH:mm")}
                      </span>
                    </div>
                    <p className="text-white/60">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Ticket Activities */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={20} className="text-green" />
                  <h3 className="text-lg font-semibold">Ticket Activities</h3>
                </div>
                <div className="space-y-4">
                  {ticket?.activities && ticket.activities.length > 0 ? (
                    ticket.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-green/20 rounded-full flex items-center justify-center">
                          {activity.user?.profile?.url ? (
                            <img
                              src={activity.user.profile.url}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-green" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white/80">
                              {activity.user?.username || "Unknown User"}
                            </span>
                            <span className="text-xs text-white/40">
                              {dayjs(activity.createdAt).format(
                                "MMM DD, HH:mm"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                activity.type === "ticket"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : activity.type === "comment"
                                  ? "bg-green-500/20 text-green-400"
                                  : activity.type === "reply"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {activity.type}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm">
                            {activity.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      No activities recorded for this ticket yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Tickets */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch size={20} className="text-green" />
                  <h3 className="text-lg font-semibold">Similar Tickets</h3>
                </div>
                <div className="space-y-4">
                  {ticket?.similarTickets &&
                  ticket.similarTickets.length > 0 ? (
                    ticket.similarTickets.map((similarTicket) => (
                      <div
                        key={similarTicket.id}
                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/o/organisations/${organisation?.documentId}/tickets/${similarTicket.documentId}`
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white/80">
                              #{similarTicket.documentId}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                similarTicket.state === "OPEN"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : similarTicket.state === "IN_PROGRESS"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : similarTicket.state === "RESOLVED"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {similarTicket.state}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              similarTicket.priority === "HIGH"
                                ? "bg-red-500/20 text-red-400"
                                : similarTicket.priority === "MEDIUM"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {similarTicket.priority}
                          </span>
                        </div>
                        <h4 className="font-medium text-white/80 mb-2">
                          {similarTicket.title}
                        </h4>
                        <p className="text-white/60 text-sm mb-2 line-clamp-2">
                          {similarTicket.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>
                            Created:{" "}
                            {dayjs(similarTicket.createdAt).format(
                              "MMM DD, YYYY"
                            )}
                          </span>
                          <span>Type: {similarTicket.type}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      No similar tickets found for this ticket.
                    </div>
                  )}
                </div>
              </div>

              {/* Insights Summary */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-green" />
                  <h3 className="text-lg font-semibold">Insights Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green mb-1">
                      {ticket?.activities?.length || 0}
                    </div>
                    <div className="text-sm text-white/60">
                      Total Activities
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {ticket?.similarTickets?.length || 0}
                    </div>
                    <div className="text-sm text-white/60">Similar Tickets</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {dayjs(ticket?.createdAt).diff(dayjs(), "days") * -1}
                    </div>
                    <div className="text-sm text-white/60">
                      Days Since Created
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-black border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          showNoteModal ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add Note</h2>
            <button
              onClick={() => setShowNoteModal(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              className="w-full h-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              buttonText="Add Note"
              onPress={handleAddNote}
              className="flex-1"
            />
            <Button
              buttonText="Cancel"
              onPress={() => setShowNoteModal(false)}
              variant="secondary"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
