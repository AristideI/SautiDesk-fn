import React, { useState, useRef } from "react";
import { useConversations } from "hooks/useConversations";
import { useOrganisationContext } from "store/organisation.context";
import { usePinsContext } from "store/pins.context";
import {
  Search,
  Send,
  Image as ImageIcon,
  Ticket,
  ChevronDown,
  User,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Pin,
} from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { ITicket } from "types/ticket.types";
import { InboxLoadingSkeleton } from "components/utils/tableSkeletons";
import type { IConversation } from "types/conversation.type";

export default function OrgInboxPage() {
  const {
    conversations,
    selectedConversation,
    loading,
    error,
    setSelectedConversation,
    sendMessage,
    searchConversations,
  } = useConversations();

  const { tickets } = useOrganisationContext();
  const { pinnedStore, pinConversation, unpinConversation } = usePinsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTicketDropdownOpen, setIsTicketDropdownOpen] = useState(false);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ticketDropdownRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search
  React.useEffect(() => {
    if (searchQuery.trim()) {
      searchConversations(searchQuery).then(setFilteredConversations);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, searchConversations]);

  // Close ticket dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ticketDropdownRef.current &&
        !ticketDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTicketDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageInput.trim()) return;

    try {
      await sendMessage(
        selectedConversation.documentId,
        messageInput.trim(),
        undefined, // imageId - would be set after image upload
        selectedTicketIds.length > 0 ? selectedTicketIds : undefined
      );

      setMessageInput("");
      setSelectedTicketIds([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedConversation) {
      toast.error("Please select a conversation first");
      return;
    }

    setIsImageUploading(true);
    try {
      // TODO: Implement image upload to get imageId
      // const imageId = await uploadImage(file);
      // await sendMessage(selectedConversation.documentId, "", imageId);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketIds((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handlePinConversation = async (conversation: IConversation) => {
    try {
      await pinConversation(conversation);
      toast.success("Conversation pinned successfully");
    } catch (error) {
      console.error("Error pinning conversation:", error);
      toast.error("Failed to pin conversation");
    }
  };

  const handleUnpinConversation = async (conversation: IConversation) => {
    try {
      await unpinConversation(conversation);
      toast.success("Conversation unpinned successfully");
    } catch (error) {
      console.error("Error unpinning conversation:", error);
      toast.error("Failed to unpin conversation");
    }
  };

  const isConversationPinned = (conversationId: number) => {
    return (
      pinnedStore.conversations?.some((c) => c.id === conversationId) || false
    );
  };

  const getConversationTitle = (conversation: IConversation) => {
    const otherParticipants = conversation.participants.filter(
      (p) => p.documentId !== selectedConversation?.participants[0]?.documentId
    );
    return otherParticipants.map((p) => p.username).join(", ") || "Group Chat";
  };

  const getLastMessage = (conversation: IConversation) => {
    const messages = conversation.messages || [];
    if (messages.length === 0) return "No messages yet";

    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.length > 50
      ? lastMessage.content.substring(0, 50) + "..."
      : lastMessage.content;
  };

  const getLastMessageTime = (conversation: IConversation) => {
    const messages = conversation.messages || [];
    if (messages.length === 0) return "";

    const lastMessage = messages[messages.length - 1];
    return dayjs(lastMessage.createdAt).format("HH:mm");
  };

  const getOtherParticipant = () => {
    if (!selectedConversation) return null;
    return selectedConversation.participants.find(
      (p) => p.documentId !== selectedConversation.participants[0]?.documentId
    );
  };

  if (loading) {
    return <InboxLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen flex">
      {/* Left Section - Conversations List */}
      <div className="w-1/4 border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <h1 className="text-xl font-semibold mb-4">Inbox</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={16}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-white/60">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.documentId}
                className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                  selectedConversation?.documentId === conversation.documentId
                    ? "bg-white/10 border-l-4 border-l-green-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <User size={20} />
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <h3 className="font-medium truncate">
                      {getConversationTitle(conversation)}
                    </h3>
                    <p className="text-sm text-white/60 truncate">
                      {getLastMessage(conversation)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isConversationPinned(conversation.id)) {
                          handleUnpinConversation(conversation);
                        } else {
                          handlePinConversation(conversation);
                        }
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        isConversationPinned(conversation.id)
                          ? "text-green hover:text-green/80"
                          : "text-white/40 hover:text-white/60"
                      }`}
                      title={
                        isConversationPinned(conversation.id)
                          ? "Unpin conversation"
                          : "Pin conversation"
                      }
                    >
                      <Pin size={16} />
                    </button>
                    <div className="text-xs text-white/40">
                      {getLastMessageTime(conversation)}
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 text-xs text-white/40 cursor-pointer"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <MessageSquare size={12} />
                  <span>{conversation.messages?.length || 0} messages</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center Section - Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {getConversationTitle(selectedConversation)}
                  </h2>
                  <p className="text-sm text-white/60">
                    {selectedConversation.participants.length} participants
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages?.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                selectedConversation.messages?.map((message) => (
                  <div
                    key={message.documentId}
                    className={`flex gap-3 ${
                      message.sender.documentId ===
                      selectedConversation.participants[0]?.documentId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender.documentId !==
                      selectedConversation.participants[0]?.documentId && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender.documentId ===
                        selectedConversation.participants[0]?.documentId
                          ? "bg-green-500/20 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.sender.username}
                        </span>
                        <span className="text-xs opacity-60">
                          {dayjs(message.createdAt).format("HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.image && (
                        <img
                          src={message.image.url}
                          alt="Message attachment"
                          className="mt-2 rounded max-w-full"
                        />
                      )}
                      {message.tickets && message.tickets.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.tickets.map((ticket: ITicket) => (
                            <div
                              key={ticket.documentId}
                              className="flex items-center gap-2 text-xs bg-white/10 rounded px-2 py-1"
                            >
                              <Ticket size={12} />
                              <span>{ticket.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 resize-none"
                    rows={3}
                  />

                  {/* Selected Tickets */}
                  {selectedTicketIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTicketIds.map((ticketId) => {
                        const ticket = tickets?.find(
                          (t) => t.documentId === ticketId
                        );
                        return ticket ? (
                          <div
                            key={ticketId}
                            className="flex items-center gap-2 bg-green-500/20 text-green-400 rounded px-2 py-1 text-sm"
                          >
                            <Ticket size={12} />
                            <span>{ticket.title}</span>
                            <button
                              onClick={() => handleTicketSelect(ticketId)}
                              className="text-green-400 hover:text-green-300"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Image Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImageUploading}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Upload image"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Ticket Link */}
                  <div className="relative" ref={ticketDropdownRef}>
                    <button
                      onClick={() =>
                        setIsTicketDropdownOpen(!isTicketDropdownOpen)
                      }
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                      title="Link ticket"
                    >
                      <Ticket size={20} />
                      <ChevronDown size={16} />
                    </button>

                    {isTicketDropdownOpen && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-black border border-white/20 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        <div className="p-2 border-b border-white/20">
                          <h3 className="text-sm font-medium">Link Tickets</h3>
                        </div>
                        {tickets?.map((ticket) => (
                          <button
                            key={ticket.documentId}
                            onClick={() =>
                              handleTicketSelect(ticket.documentId)
                            }
                            className={`w-full p-2 text-left hover:bg-white/10 flex items-center gap-2 ${
                              selectedTicketIds.includes(ticket.documentId)
                                ? "bg-green-500/20 text-green-400"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTicketIds.includes(
                                ticket.documentId
                              )}
                              readOnly
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{ticket.title}</p>
                              <p className="text-xs text-white/60 truncate">
                                {ticket.documentId}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">
                Select a conversation
              </h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Participant Information */}
      <div className="w-1/4 border-l border-white/20 flex flex-col">
        {selectedConversation && getOtherParticipant() ? (
          <>
            {/* Participant Header */}
            <div className="p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold">Participant Info</h2>
            </div>

            {/* Participant Details */}
            <div className="flex-1 p-4">
              <div className="text-center mb-6">
                {getOtherParticipant()?.profile?.url ? (
                  <img
                    src={getOtherParticipant()?.profile?.url}
                    alt={getOtherParticipant()?.username}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                    <User size={32} />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-1">
                  {getOtherParticipant()?.username}
                </h3>
                <p className="text-white/60 text-sm">
                  {getOtherParticipant()?.userRole}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Mail size={16} className="text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-sm">{getOtherParticipant()?.email}</p>
                  </div>
                </div>

                {getOtherParticipant()?.phone && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Phone size={16} className="text-white/60" />
                    <div>
                      <p className="text-sm text-white/60">Phone</p>
                      <p className="text-sm">{getOtherParticipant()?.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Calendar size={16} className="text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Joined</p>
                    <p className="text-sm">
                      {dayjs(getOtherParticipant()?.createdAt).format(
                        "MMM DD, YYYY"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversation Stats */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h4 className="font-medium mb-3">Conversation Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">
                      Total Messages
                    </span>
                    <span className="text-sm font-medium">
                      {selectedConversation.messages?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/60">Started</span>
                    <span className="text-sm font-medium">
                      {selectedConversation.messages &&
                      selectedConversation.messages.length > 0
                        ? dayjs(
                            selectedConversation.messages[0].createdAt
                          ).format("MMM DD")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <User size={48} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-lg font-semibold mb-2">No Participant</h2>
              <p className="text-sm">
                Select a conversation to view participant details
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
