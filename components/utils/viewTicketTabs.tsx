import { useNavigate } from "react-router";
import Button from "components/utils/button";
import {
  User,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  UserCheck,
  Building,
  Paperclip,
  Activity,
  TrendingUp,
  GitBranch,
  Edit,
} from "lucide-react";
import type { IComment, ICommentCreate } from "types/comment.type";
import type { ITicket } from "types/ticket.types";
import type { IOrganisation } from "types/organisation.type";
import { ticketTypeIcons } from "constants/typeIcons";
import dayjs from "dayjs";
import { getPriorityColor, getStateColor } from "utils/getColors";
import { useState } from "react";
import { useAuthContext } from "store/auth.context";
import { API } from "api";
import type { INote } from "types/note.type";

type TabType = "tasks" | "conversation" | "notes" | "insights";

interface ViewTicketTabsProps {
  activeTab: TabType;
  ticket: ITicket;
  organisation?: IOrganisation;
  comments: IComment[];
  notes: INote[];
  isLoadingComments: boolean;
  showNoteModal: boolean;
  showEditSimilarTicketsModal: boolean;
  setShowNoteModal: (value: boolean) => void;
  setShowEditSimilarTicketsModal: (value: boolean) => void;
}

export default function ViewTicketTabs({
  activeTab,
  ticket,
  organisation,
  comments,
  notes,
  isLoadingComments,
  setShowNoteModal,
  setShowEditSimilarTicketsModal,
}: ViewTicketTabsProps) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get the appropriate icon component for the ticket type
  const TypeIcon = ticketTypeIcons[ticket.type] || ticketTypeIcons.OTHER;

  async function handleSendComment() {
    if (!user?.documentId) return;
    if (!newComment.trim()) return;

    setIsUploading(true);
    try {
      const attachments = commentImage
        ? await API.userHandler.uploadImage(commentImage)
        : null;

      const comment: ICommentCreate = {
        author: user.id,
        ticket: ticket.id,
        content: newComment.trim(),
        attachments: attachments ? [attachments.id] : [],
      };

      await API.commentHandler.create(comment);

      // Reset form
      setNewComment("");
      setCommentImage(null);
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCommentImage(file);
    }
  };

  const removeImage = () => {
    setCommentImage(null);
  };

  return (
    <>
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
                      {comment.author?.profile?.url ? (
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
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/80">{comment.content}</p>

                        {/* Display attachments */}
                        {comment.attachments &&
                          comment.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-1 text-white/60 text-xs mb-2">
                                <Paperclip size={12} />
                                <span>
                                  Attachments ({comment.attachments.length})
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {comment.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="relative group cursor-pointer"
                                    onClick={() =>
                                      window.open(attachment.url, "_blank")
                                    }
                                  >
                                    <img
                                      src={attachment.url}
                                      alt={
                                        attachment.alternativeText ||
                                        attachment.name
                                      }
                                      className="w-full h-24 object-cover rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/50 px-2 py-1 rounded">
                                        Click to view
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/20">
              <div className="space-y-3">
                {/* Image preview */}
                {commentImage && (
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <img
                      src={URL.createObjectURL(commentImage)}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-sm text-white/60 flex-1">
                      {commentImage.name}
                    </span>
                    <button
                      onClick={removeImage}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <span className="text-white/60 hover:text-white">×</span>
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
                    disabled={isUploading}
                  />

                  {/* Image upload button */}
                  <label className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2">
                    <Paperclip size={16} className="text-white/60" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  <Button
                    buttonText={isUploading ? "Sending..." : "Send"}
                    onPress={handleSendComment}
                    disabled={isUploading || !newComment.trim()}
                  />
                </div>
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white/80">
                          {note.author?.username || "Unknown User"}
                        </span>
                        {note.type && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              note.type === "INTERNAL"
                                ? "bg-blue-500/20 text-blue-400"
                                : note.type === "PRIVATE"
                                ? "bg-purple-500/20 text-purple-400"
                                : note.type === "SYSTEM"
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {note.type}
                          </span>
                        )}
                      </div>
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch size={20} className="text-green" />
                    <h3 className="text-lg font-semibold">Similar Tickets</h3>
                  </div>
                  <button
                    onClick={() => setShowEditSimilarTicketsModal(true)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit similar tickets"
                  >
                    <Edit size={16} />
                  </button>
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
    </>
  );
}
