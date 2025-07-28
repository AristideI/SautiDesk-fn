import { useState, useEffect } from "react";
import { useAuthContext } from "store/auth.context";
import { Search, MessageSquare, User, Clock, Send } from "lucide-react";
import { Button } from "components/utils/button";
import { toast } from "react-hot-toast";

interface IConversation {
  id: number;
  title: string;
  participants: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  lastMessage: {
    content: string;
    createdAt: string;
    sender: {
      id: number;
      username: string;
      email: string;
    };
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface IMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AgentInboxPage() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/conversations/agent');
      // const data = await response.json();

      // Mock data for now
      const mockConversations: IConversation[] = [
        {
          id: 1,
          title: "Login Issue Support",
          participants: [
            {
              id: user?.id || 1,
              username: user?.username || "Agent",
              email: user?.email || "agent@example.com",
            },
            {
              id: 2,
              username: "john_doe",
              email: "john@example.com",
            },
          ],
          lastMessage: {
            content:
              "I'm still having trouble with the login. Can you help me?",
            createdAt: "2024-01-15T14:30:00Z",
            sender: {
              id: 2,
              username: "john_doe",
              email: "john@example.com",
            },
          },
          unreadCount: 1,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
        },
        {
          id: 2,
          title: "Password Reset Request",
          participants: [
            {
              id: user?.id || 1,
              username: user?.username || "Agent",
              email: user?.email || "agent@example.com",
            },
            {
              id: 3,
              username: "jane_smith",
              email: "jane@example.com",
            },
          ],
          lastMessage: {
            content:
              "Thank you for your help! The password reset worked perfectly.",
            createdAt: "2024-01-15T13:45:00Z",
            sender: {
              id: 3,
              username: "jane_smith",
              email: "jane@example.com",
            },
          },
          unreadCount: 0,
          createdAt: "2024-01-15T09:30:00Z",
          updatedAt: "2024-01-15T13:45:00Z",
        },
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/conversations/${conversationId}/messages`);
      // const data = await response.json();

      // Mock data for now
      const mockMessages: IMessage[] = [
        {
          id: 1,
          content:
            "Hello, I'm having trouble logging into my account. Can you help me?",
          createdAt: "2024-01-15T10:00:00Z",
          sender: {
            id: 2,
            username: "john_doe",
            email: "john@example.com",
          },
        },
        {
          id: 2,
          content:
            "Hi John! I'd be happy to help you with your login issue. Can you tell me what error message you're seeing?",
          createdAt: "2024-01-15T10:05:00Z",
          sender: {
            id: user?.id || 1,
            username: user?.username || "Agent",
            email: user?.email || "agent@example.com",
          },
        },
        {
          id: 3,
          content:
            "I'm getting an 'Invalid credentials' error, but I'm sure my password is correct.",
          createdAt: "2024-01-15T10:10:00Z",
          sender: {
            id: 2,
            username: "john_doe",
            email: "john@example.com",
          },
        },
        {
          id: 4,
          content: "I'm still having trouble with the login. Can you help me?",
          createdAt: "2024-01-15T14:30:00Z",
          sender: {
            id: 2,
            username: "john_doe",
            email: "john@example.com",
          },
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setIsSending(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newMessage })
      // });

      const newMsg: IMessage = {
        id: messages.length + 1,
        content: newMessage,
        createdAt: new Date().toISOString(),
        sender: {
          id: user?.id || 1,
          username: user?.username || "Agent",
          email: user?.email || "agent@example.com",
        },
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    return (
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.participants.some((p) =>
        p.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <p className="text-white/70 mt-1">
            Manage your conversations and messages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white/5 rounded-lg p-4">
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                size={20}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green/50"
              />
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto h-[calc(100%-80px)]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-green/20 border border-green/30"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white truncate">
                      {conversation.title}
                    </h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-green text-black text-xs px-2 py-1 rounded-full font-medium">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-white/70 text-sm truncate mb-2">
                    {conversation.lastMessage.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{conversation.lastMessage.sender.username}</span>
                    <span>
                      {new Date(
                        conversation.lastMessage.createdAt
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare
                  size={32}
                  className="text-white/30 mx-auto mb-2"
                />
                <p className="text-white/50 text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-white/5 rounded-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  {selectedConversation.title}
                </h2>
                <p className="text-white/70 text-sm">
                  {selectedConversation.participants
                    .filter((p) => p.id !== user?.id)
                    .map((p) => p.username)
                    .join(", ")}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender.id === user?.id
                          ? "bg-green text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender.username}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green/50"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    size="sm"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare
                  size={48}
                  className="text-white/30 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-white/50">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
