import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "components/utils/button";
import { LoadingSection } from "components/utils/loadings";
import {
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  FileText,
  User,
  Calendar,
  Clock,
  Tag,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { useAuthContext } from "store/auth.context";
import { API } from "api";
import { toast } from "react-toastify";
import type { IMessage } from "types/message.type";
import { TicketState, TicketPriority } from "types/ticket.types";
import { ticketTypeIcons } from "constants/typeIcons";
import dayjs from "dayjs";
import type { IConversation } from "types/conversation.type";
import { useOrganisationContext } from "store/organisation.context";

type TabType = "tasks" | "conversation" | "notes";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

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
  const { tickets, loading } = useOrganisationContext();
  const ticket = tickets?.find((t) => t.documentId === ticketId);

  const [activeTab, setActiveTab] = useState<TabType>("conversation");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [showNewNoteInput, setShowNewNoteInput] = useState(false);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: IMessage = {
      id: Date.now(),
      documentId: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversation: {} as IConversation,
      sender: user,
      content: newMessage,
      ticketId: ticketId!,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    toast.success("Message sent");
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, task]);
    setNewTask("");
    setShowNewTaskInput(false);
    toast.success("Task added");
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
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
    setShowNewNoteInput(false);
    toast.success("Note added");
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.HIGH:
        return "text-red-400 bg-red-500/20";
      case TicketPriority.MEDIUM:
        return "text-yellow-400 bg-yellow-500/20";
      case TicketPriority.LOW:
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStateColor = (state: TicketState) => {
    switch (state) {
      case TicketState.OPEN:
        return "text-blue-400 bg-blue-500/20";
      case TicketState.IN_PROGRESS:
        return "text-yellow-400 bg-yellow-500/20";
      case TicketState.RESOLVED:
        return "text-green-400 bg-green-500/20";
      case TicketState.CLOSED:
        return "text-gray-400 bg-gray-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  if (loading) {
    return <LoadingSection />;
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
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <TypeIcon size={20} className="text-white/60" />
              <span className="text-white/80">{ticket.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{ticket.title}</h1>
            <div className="w-px h-6 bg-white/20" />
            <Button
              buttonText="Submit as Closed"
              onPress={handleCloseTicket}
              variant="secondary"
            />
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-black/30 border-b border-white/20 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-white/60" />
            <span className="text-white/80">
              Owner: {ticket?.ownedBy?.username}
            </span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-white/60" />
              <span className="text-white/80">
                Assigned: {ticket?.assignedTo?.username}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-white/60" />
            <span className="text-white/80">
              Created: {dayjs(ticket.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white/60" />
            <span className="text-white/80">
              Updated: {dayjs(ticket.updatedAt).format("MMM DD, YYYY")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(
              ticket.priority
            )}`}
          >
            {ticket.priority} Priority
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs ${getStateColor(
              ticket.state
            )}`}
          >
            {ticket.state}
          </span>
          {ticket.tags && (
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-white/60" />
              <span className="text-white/80 text-sm">{ticket.tags}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/20 border-b border-white/20">
        <div className="flex">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "tasks"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <CheckSquare size={16} />
            <span>Tasks</span>
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
            <span>Conversation</span>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === "notes"
                ? "border-green text-green"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <FileText size={16} />
            <span>Notes</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "tasks" && (
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Button
                buttonText="Add Task"
                onPress={() => setShowNewTaskInput(true)}
              />
            </div>

            {showNewTaskInput && (
              <div className="flex items-center gap-2 mb-4 p-4 bg-white/5 rounded-lg">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                />
                <Button buttonText="Add" onPress={handleAddTask} />
                <button
                  onClick={() => setShowNewTaskInput(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle size={20} className="text-green" />
                    ) : (
                      <Square size={20} className="text-white/60" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? "line-through text-white/40"
                        : "text-white/80"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs text-white/40">
                    {dayjs(task.createdAt).format("MMM DD")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "conversation" && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green/20 rounded-full flex items-center justify-center">
                    <User size={16} className="text-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white/80">
                        {message?.sender?.username}
                      </span>
                      <span className="text-xs text-white/40">
                        {dayjs(message.createdAt).format("MMM DD, HH:mm")}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-white/80">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/20">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button buttonText="Send" onPress={handleSendMessage} />
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
                onPress={() => setShowNewNoteInput(true)}
              />
            </div>

            {showNewNoteInput && (
              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 h-24 resize-none"
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button buttonText="Add Note" onPress={handleAddNote} />
                  <button
                    onClick={() => setShowNewNoteInput(false)}
                    className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-4">
              {notes.map((note) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
