import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "store/auth.context";
import { API } from "api";
import { toast } from "react-toastify";
import type { IConversation } from "types/conversation.type";
import type { IMessage } from "types/message.type";

interface UseConversationsReturn {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  loading: boolean;
  error: string | null;
  setSelectedConversation: (conversation: IConversation | null) => void;
  refreshConversations: () => Promise<void>;
  createConversation: (
    participantIds: string[]
  ) => Promise<IConversation | null>;
  sendMessage: (
    conversationId: string,
    content: string,
    imageId?: string,
    ticketIds?: string[]
  ) => Promise<IMessage | null>;
  addParticipant: (
    conversationId: string,
    participantId: string
  ) => Promise<void>;
  removeParticipant: (
    conversationId: string,
    participantId: string
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  searchConversations: (query: string) => Promise<IConversation[]>;
  getConversationById: (conversationId: string) => IConversation | null;
  getUnreadCount: () => number;
  markConversationAsRead: (conversationId: string) => void;
}

export function useConversations(): UseConversationsReturn {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load conversations for the current user
  const loadConversations = useCallback(async () => {
    if (!user?.documentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userConversations = await API.conversationHandler.findByUserId();
      const filteredConversations = userConversations.filter((conv) =>
        conv.participants.some((p) => p.documentId === user.documentId)
      );
      setConversations(filteredConversations || []);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load conversations");
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [user?.documentId]);

  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  // Create new conversation
  const createConversation = useCallback(
    async (participantIds: string[]): Promise<IConversation | null> => {
      if (!user?.documentId) {
        toast.error("User not authenticated");
        return null;
      }

      try {
        // Include current user in participants if not already included
        const allParticipants = participantIds.includes(user.documentId)
          ? participantIds
          : [...participantIds, user.documentId];

        const newConversation = await API.conversationHandler.create(
          allParticipants
        );

        // Add to conversations list
        setConversations((prev) => [newConversation, ...prev]);

        toast.success("Conversation created successfully");
        return newConversation;
      } catch (err) {
        console.error("Error creating conversation:", err);
        toast.error("Failed to create conversation");
        return null;
      }
    },
    [user?.documentId]
  );

  // Send message
  const sendMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      imageId?: string,
      ticketIds?: string[]
    ): Promise<IMessage | null> => {
      if (!user?.documentId) {
        toast.error("User not authenticated");
        return null;
      }

      try {
        const newMessage = await API.conversationHandler.sendMessage(
          conversationId,
          {
            content,
            senderId: user.documentId,
            imageId,
            ticketIds,
          }
        );

        // Update conversations with new message
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.documentId === conversationId) {
              return {
                ...conv,
                messages: [...(conv.messages || []), newMessage],
                updatedAt: new Date().toISOString(),
              };
            }
            return conv;
          })
        );

        // Update selected conversation if it's the current one
        if (selectedConversation?.documentId === conversationId) {
          setSelectedConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...(prev.messages || []), newMessage],
                  updatedAt: new Date().toISOString(),
                }
              : null
          );
        }

        return newMessage;
      } catch (err) {
        console.error("Error sending message:", err);
        toast.error("Failed to send message");
        return null;
      }
    },
    [user?.documentId, selectedConversation?.documentId]
  );

  // Add participant to conversation
  const addParticipant = useCallback(
    async (conversationId: string, participantId: string): Promise<void> => {
      try {
        const updatedConversation =
          await API.conversationHandler.addParticipant(
            conversationId,
            participantId
          );

        // Update conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.documentId === conversationId ? updatedConversation : conv
          )
        );

        // Update selected conversation if it's the current one
        if (selectedConversation?.documentId === conversationId) {
          setSelectedConversation(updatedConversation);
        }

        toast.success("Participant added successfully");
      } catch (err) {
        console.error("Error adding participant:", err);
        toast.error("Failed to add participant");
      }
    },
    [selectedConversation?.documentId]
  );

  // Remove participant from conversation
  const removeParticipant = useCallback(
    async (conversationId: string, participantId: string): Promise<void> => {
      try {
        const updatedConversation =
          await API.conversationHandler.removeParticipant(
            conversationId,
            participantId
          );

        // Update conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.documentId === conversationId ? updatedConversation : conv
          )
        );

        // Update selected conversation if it's the current one
        if (selectedConversation?.documentId === conversationId) {
          setSelectedConversation(updatedConversation);
        }

        toast.success("Participant removed successfully");
      } catch (err) {
        console.error("Error removing participant:", err);
        toast.error("Failed to remove participant");
      }
    },
    [selectedConversation?.documentId]
  );

  // Delete conversation
  const deleteConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      try {
        await API.conversationHandler.delete(conversationId);

        // Remove from conversations list
        setConversations((prev) =>
          prev.filter((conv) => conv.documentId !== conversationId)
        );

        // Clear selected conversation if it's the deleted one
        if (selectedConversation?.documentId === conversationId) {
          setSelectedConversation(null);
        }

        toast.success("Conversation deleted successfully");
      } catch (err) {
        console.error("Error deleting conversation:", err);
        toast.error("Failed to delete conversation");
      }
    },
    [selectedConversation?.documentId]
  );

  // Search conversations (client-side implementation)
  const searchConversations = useCallback(
    async (query: string): Promise<IConversation[]> => {
      try {
        // Client-side search implementation
        const filteredConversations = conversations.filter((conv) => {
          const participantNames = conv.participants
            .map((p) => p.username.toLowerCase())
            .join(" ");
          const messageContent =
            conv.messages?.map((m) => m.content.toLowerCase()).join(" ") || "";

          return (
            participantNames.includes(query.toLowerCase()) ||
            messageContent.includes(query.toLowerCase())
          );
        });

        return filteredConversations;
      } catch (err) {
        console.error("Error searching conversations:", err);
        toast.error("Failed to search conversations");
        return [];
      }
    },
    [conversations]
  );

  // Get conversation by ID
  const getConversationById = useCallback(
    (conversationId: string): IConversation | null => {
      return (
        conversations.find((conv) => conv.documentId === conversationId) || null
      );
    },
    [conversations]
  );

  // Get unread count (placeholder implementation)
  const getUnreadCount = useCallback((): number => {
    // This would typically count unread messages
    // For now, return 0 as placeholder
    return 0;
  }, []);

  // Mark conversation as read (placeholder implementation)
  const markConversationAsRead = useCallback((conversationId: string): void => {
    // This would typically update read status
    // For now, just log the action
    console.log(`Marking conversation ${conversationId} as read`);
  }, []);

  // Load conversations on mount and when user changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-select first conversation if none selected and conversations exist
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  return {
    conversations,
    selectedConversation,
    loading,
    error,
    setSelectedConversation,
    refreshConversations,
    createConversation,
    sendMessage,
    addParticipant,
    removeParticipant,
    deleteConversation,
    searchConversations,
    getConversationById,
    getUnreadCount,
    markConversationAsRead,
  };
}
