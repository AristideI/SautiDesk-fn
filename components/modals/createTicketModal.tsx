import Button from "components/utils/button";
import { X } from "lucide-react";
import {
  TicketPriority,
  TicketState,
  TicketType,
  TicketSource,
} from "types/ticket.types";
import { useState, useRef } from "react";
import { useAuthContext } from "store/auth.context";
import { useOrganisationContext } from "store/organisation.context";
import { API } from "api";
import { toast } from "react-toastify";
import React from "react";

interface CreateTicketModalProps {
  isModalOpen: boolean;
  isAIModalOpen: boolean;
  onCloseModal: () => void;
  onCloseAIModal: () => void;
  onOpenModal: () => void;
}

type FormData = {
  title: string;
  description: string;
  priority: TicketPriority;
  state: TicketState;
  type: TicketType;
  assignedTo: string;
};

export default function CreateTicketModal({
  isModalOpen,
  isAIModalOpen,
  onCloseModal,
  onCloseAIModal,
  onOpenModal,
}: CreateTicketModalProps) {
  const { user } = useAuthContext();
  const { organisation, agents } = useOrganisationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    priority: TicketPriority.LOW,
    state: TicketState.OPEN,
    type: TicketType.TICKET,
    assignedTo: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !organisation) {
      toast.error("User or organisation not found");
      return;
    }

    try {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        state: formData.state,
        priority: formData.priority,
        type: formData.type,
        assignedTo: formData.assignedTo || undefined,
        ownedBy: user.documentId!,
        organisation: organisation.documentId,
        source: TicketSource.MANUAL,
      };

      await API.ticketHandler.create(ticketData);
      toast.success("Ticket created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: TicketPriority.LOW,
        state: TicketState.OPEN,
        type: TicketType.TICKET,
        assignedTo: "",
      });

      onCloseModal();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket. Please try again.");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // First, transcribe the audio using OpenAI
      const transcription = await API.openAIHandler.transcribe(file);

      // Then, use GPT to generate ticket information
      const agentsList =
        (agents
          ?.map((agent) => agent.documentId)
          .filter(Boolean) as string[]) || [];
      const ticketData = await API.openAIHandler.getTicketData(
        transcription,
        agentsList
      );

      // Update form data with AI-generated content
      setFormData({
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        state: TicketState.OPEN,
        type: ticketData.type,
        assignedTo: ticketData.assignedTo || "",
      });

      // Close AI modal and open regular modal
      onCloseAIModal();
      onOpenModal();

      toast.success(
        "Audio processed successfully! Please review and submit the ticket."
      );
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    onCloseModal();
    // Reset form when closing
    setFormData({
      title: "",
      description: "",
      priority: TicketPriority.LOW,
      state: TicketState.OPEN,
      type: TicketType.TICKET,
      assignedTo: "",
    });
  };

  const handleCloseAIModal = () => {
    onCloseAIModal();
    setIsProcessing(false);
  };

  return (
    <>
      {/* AI Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-black border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          isAIModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create Ticket with AI</h2>
            <button
              onClick={handleCloseAIModal}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <Button
              buttonText={isProcessing ? "Processing..." : "Upload Audio File"}
              onPress={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full max-w-md"
            />
            <p className="mt-4 text-white/60 text-center">
              Upload an audio file describing your ticket. We&apos;ll process it
              and create a ticket for you.
            </p>
          </div>
        </div>
      </div>

      {/* Sliding Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-black border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Ticket</h2>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                  placeholder="Enter ticket title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 h-32 resize-none"
                  placeholder="Enter ticket description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                >
                  <option value={TicketType.TICKET}>Ticket</option>
                  <option value={TicketType.INCIDENT}>Incident</option>
                  <option value={TicketType.QUESTION}>Question</option>
                  <option value={TicketType.REQUEST}>Request</option>
                  <option value={TicketType.PROBLEM}>Problem</option>
                  <option value={TicketType.SUGGESTION}>Suggestion</option>
                  <option value={TicketType.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                >
                  <option value={TicketPriority.LOW}>Low</option>
                  <option value={TicketPriority.MEDIUM}>Medium</option>
                  <option value={TicketPriority.HIGH}>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                >
                  <option value={TicketState.OPEN}>Open</option>
                  <option value={TicketState.ASSIGNED}>Assigned</option>
                  <option value={TicketState.IN_PROGRESS}>In Progress</option>
                  <option value={TicketState.RESOLVED}>Resolved</option>
                  <option value={TicketState.CLOSED}>Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50"
                >
                  <option value="">Unassigned</option>
                  {agents?.map((agent) => (
                    <option key={agent.id} value={agent.documentId}>
                      {agent.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <Button
                buttonText="Create Ticket"
                onPress={() => {
                  const fakeEvent = {
                    preventDefault: () => {},
                  } as React.FormEvent;
                  handleSubmit(fakeEvent);
                }}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
