import Button from "components/utils/button";
import { X, ChevronDown } from "lucide-react";
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
  const { organisation, agents, loadOrganisation } = useOrganisationContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssignedToOpen, setIsAssignedToOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    priority: TicketPriority.LOW,
    state: TicketState.OPEN,
    type: TicketType.TICKET,
    assignedTo: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const assignedToRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

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

  async function handleAssignedToClick(documentId: string) {
    setFormData({ ...formData, assignedTo: documentId });
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsAssignedToOpen(false);
  }

  async function handleTypeClick(type: TicketType) {
    setFormData({ ...formData, type });
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsTypeOpen(false);
  }

  async function handleStatusClick(state: TicketState) {
    setFormData({ ...formData, state });
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsStatusOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    if (!user || !organisation) {
      toast.error("User or organisation not found");
      return;
    }

    setIsSubmitting(true);
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

      await API.ticketHandler.create(ticketData, organisation.documentId);
      loadOrganisation();
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
    } finally {
      setIsSubmitting(false);
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      onCreate();

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

  function onCreate() {
    const button = document.getElementById("create-ticket-button");
    if (button) {
      button.click();
    }
  }

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
                <h2 className="block text-sm font-medium mb-2">Type</h2>
                <div className="relative">
                  <div
                    ref={typeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsTypeOpen((prev) => !prev);
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{formData.type}</span>
                      <ChevronDown size={16} className="text-white/60" />
                    </div>
                  </div>

                  {isTypeOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-lg z-10">
                      {Object.values(TicketType).map((type) => (
                        <button
                          key={type}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTypeClick(type);
                          }}
                          className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2 w-full"
                        >
                          <span className="text-sm">{type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority
                </label>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData({
                        ...formData,
                        priority: TicketPriority.LOW,
                      });
                    }}
                    className={`rounded-lg flex items-center justify-center py-2 w-full gap-4 ${
                      formData.priority === TicketPriority.LOW
                        ? "border border-green-500"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-sm text-white/60">Low</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData({
                        ...formData,
                        priority: TicketPriority.MEDIUM,
                      });
                    }}
                    className={`rounded-lg flex items-center justify-center py-2 w-full gap-4 ${
                      formData.priority === TicketPriority.MEDIUM
                        ? "border border-yellow-500"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <p className="text-sm text-white/60">Medium</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData({
                        ...formData,
                        priority: TicketPriority.HIGH,
                      });
                    }}
                    className={`rounded-lg flex items-center justify-center py-2 w-full gap-4 ${
                      formData.priority === TicketPriority.HIGH
                        ? "border border-red-500"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-sm text-white/60">High</p>
                  </button>
                </div>
              </div>

              <div>
                <h2 className="block text-sm font-medium mb-2">Status</h2>
                <div className="relative">
                  <div
                    ref={statusRef}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsStatusOpen((prev) => !prev);
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{formData.state}</span>
                      <ChevronDown size={16} className="text-white/60" />
                    </div>
                  </div>

                  {isStatusOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-lg z-10">
                      {Object.values(TicketState).map((state) => (
                        <button
                          key={state}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStatusClick(state);
                          }}
                          className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2 w-full"
                        >
                          <span className="text-sm">{state}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="block text-sm font-medium mb-2">Assign To</h2>
                <div className="relative">
                  <div
                    ref={assignedToRef}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAssignedToOpen((prev) => !prev);
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 cursor-pointer"
                  >
                    {formData.assignedTo ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {agents?.find(
                            (agent) => agent.documentId === formData.assignedTo
                          )?.profile?.url && (
                            <img
                              src={
                                agents.find(
                                  (agent) =>
                                    agent.documentId === formData.assignedTo
                                )?.profile?.url
                              }
                              alt="Assigned To"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm">
                            {agents?.find(
                              (agent) =>
                                agent.documentId === formData.assignedTo
                            )?.username || "Unknown"}
                          </span>
                        </div>
                        <ChevronDown size={16} className="text-white/60" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/60">Unassigned</p>
                        <ChevronDown size={16} className="text-white/60" />
                      </div>
                    )}
                  </div>

                  {isAssignedToOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-lg z-10 max-h-48 overflow-y-auto">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormData({ ...formData, assignedTo: "" });
                          setIsAssignedToOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm"
                      >
                        Unassigned
                      </div>

                      {agents?.map((agent) => {
                        return (
                          <button
                            key={agent.documentId}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAssignedToClick(agent.documentId);
                            }}
                            className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2 w-full"
                          >
                            {agent.profile?.url && (
                              <img
                                src={agent.profile.url}
                                alt={agent.username}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <span className="text-sm">{agent.username}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20">
              <Button
                id="create-ticket-button"
                buttonText={isSubmitting ? "Creating..." : "Create Ticket"}
                onPress={(e) => {
                  e?.preventDefault();
                  handleSubmit(e as React.FormEvent);
                }}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
