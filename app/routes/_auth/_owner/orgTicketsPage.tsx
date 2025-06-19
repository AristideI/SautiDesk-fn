import React, { useState, useRef } from "react";
import Button from "components/utils/button";
import { LoadingSection } from "components/utils/loadings";
import {
  Calendar,
  Funnel,
  OctagonAlert,
  Search,
  Ticket,
  Workflow,
  X,
  Mic,
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import type { ITicket } from "types/ticket.types";
import { TicketPriority, TicketState, TicketType } from "types/ticket.types";
import { ticketTypeIcons } from "constants/typeIcons";
import { openAIApiKey } from "utils/env";
import dayjs from "dayjs";
import { useDebounce } from "~/hooks/useDebounce";

type FilterType = "type" | "source" | "priority" | "date" | "status" | null;

export default function OrgTicketsPage() {
  const { tickets, agents, loading: isLoading } = useOrganisationContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: [] as TicketType[],
    source: [] as string[],
    priority: [] as TicketPriority[],
    status: [] as TicketState[],
    dateRange: {
      start: null as Date | null,
      end: null as Date | null,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: TicketPriority.MEDIUM,
    state: TicketState.OPEN,
    type: TicketType.TICKET,
    assignedTo: "",
  });

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Filter tickets based on search and filters
  const filteredTickets = React.useMemo(() => {
    if (!tickets) return [];

    return tickets.filter((ticket) => {
      // Search filter
      if (debouncedSearchQuery) {
        const searchLower = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.documentId.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(ticket.type)) {
        return false;
      }

      // Priority filter
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(ticket.priority)
      ) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(ticket.state)) {
        return false;
      }

      // Source filter
      if (
        filters.source.length > 0 &&
        !filters.source.includes(ticket.source)
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const ticketDate = new Date(ticket.createdAt);
        if (filters.dateRange.start && ticketDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && ticketDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, debouncedSearchQuery, filters]);

  function handleOnOpenModal() {
    setIsModalOpen(true);
  }

  function handleOnOpenAIModal() {
    setIsAIModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleCloseAIModal() {
    setIsAIModalOpen(false);
  }

  function handleOpenFilter(filterType: FilterType) {
    setActiveFilter(filterType);
  }

  function handleCloseFilter() {
    setActiveFilter(null);
  }

  function handleFilterChange(
    filterType: keyof typeof filters,
    value: unknown
  ) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      type: [],
      source: [],
      priority: [],
      status: [],
      dateRange: { start: null, end: null },
    });
    setSearchQuery("");
  }

  function getActiveFiltersCount() {
    return (
      filters.type.length +
      filters.source.length +
      filters.priority.length +
      filters.status.length +
      (filters.dateRange.start ? 1 : 0) +
      (filters.dateRange.end ? 1 : 0) +
      (searchQuery ? 1 : 0)
    );
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    // TODO: Implement ticket creation
    handleCloseModal();
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // First, transcribe the audio using OpenAI
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", "whisper-1");

      const transcriptionResponse = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
          },
          body: formData,
        }
      );

      const transcriptionData = await transcriptionResponse.json();
      const transcription = transcriptionData.text;

      // Then, use GPT to generate ticket information
      const gptResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that creates ticket information from audio transcriptions. Extract a title, description, and suggest a priority (HIGH, MEDIUM, or LOW), and type (TICKET, INCIDENT, REQUEST, PROBLEM, SUGGESTION, OTHER), and assignedTo (this is the from the agents list of the agent that should be assigned to the ticket), based on the content. Format the response as JSON with fields: title, description, priority, type, assignedTo.",
              },
              {
                role: "user",
                content: `Transcription: ${transcription}, agents ID: ${agents?.map(
                  (agent) => agent.id
                )} => assignedTo has to be from the agents list`,
              },
            ],
            response_format: { type: "json_object" },
          }),
        }
      );

      const gptData = await gptResponse.json();
      const ticketInfo = JSON.parse(gptData.choices[0].message.content);

      // Update the form with the generated information
      setFormData((prev) => ({
        ...prev,
        title: ticketInfo.title,
        description: ticketInfo.description,
        priority: ticketInfo.priority,
        type: ticketInfo.type,
        assignedTo: ticketInfo.assignedTo || "",
      }));

      // Close AI modal and open the ticket creation modal
      handleCloseAIModal();
      handleOnOpenModal();
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing audio file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main>
      <article className="flex justify-between items-center border-b border-white/40 py-4 px-6">
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <section className="flex gap-4">
          <Button
            buttonText="Focus Mode"
            variant="secondary"
            onPress={() => {}}
            className="border-white/50 hover:bg-white/10 text-white/50"
          />
          <Button
            buttonText="Create with AI"
            variant="secondary"
            icon={<Mic size={20} />}
            onPress={handleOnOpenAIModal}
            className="border-white/50 hover:bg-white/10 text-white/50"
          />
          <Button buttonText="Add Ticket" onPress={handleOnOpenModal} />
        </section>
      </article>
      <article className="flex w-full py-4 border-b border-white/40 px-6 gap-4">
        <label className="w-1/5 relative mr-12">
          <input
            type="text"
            className="border border-white/30 rounded-lg w-full px-4 pl-8 py-1 outline-none"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute top-1/5 left-2"
            color="#ffffff60"
            size={20}
          />
        </label>
        <>
          <Button
            buttonText="Type"
            icon={<Ticket size={20} />}
            onPress={() => handleOpenFilter("type")}
            className={`border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4 ${
              filters.type.length > 0 ? "bg-green/20 text-green-400" : ""
            }`}
          />
          <Button
            buttonText="Source"
            icon={<Workflow size={20} />}
            onPress={() => handleOpenFilter("source")}
            className={`border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4 ${
              filters.source.length > 0 ? "bg-green/20 text-green-400" : ""
            }`}
          />
          <Button
            buttonText="Priority"
            icon={<OctagonAlert size={20} />}
            onPress={() => handleOpenFilter("priority")}
            className={`border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4 ${
              filters.priority.length > 0 ? "bg-green/20 text-green-400" : ""
            }`}
          />
          <Button
            buttonText="Status"
            icon={<Funnel size={20} />}
            onPress={() => handleOpenFilter("status")}
            className={`border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4 ${
              filters.status.length > 0 ? "bg-green/20 text-green-400" : ""
            }`}
          />
          <Button
            buttonText="Date Added"
            icon={<Calendar size={20} />}
            onPress={() => handleOpenFilter("date")}
            className={`border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4 ${
              filters.dateRange.start || filters.dateRange.end
                ? "bg-green/20 text-green-400"
                : ""
            }`}
          />
          {getActiveFiltersCount() > 0 && (
            <Button
              buttonText={`Clear (${getActiveFiltersCount()})`}
              onPress={clearFilters}
              variant="secondary"
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            />
          )}
        </>
      </article>
      <article className="flex-1 p-6">
        {isLoading ? (
          <LoadingSection />
        ) : filteredTickets && filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="font-semibold">
                <tr className="border-b border-white/40">
                  <th className="text-left py-3 px-4 text-white/60">
                    Ticket ID
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">Title</th>
                  <th className="text-left py-3 px-4 text-white/60">Type</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                  <th className="text-left py-3 px-4 text-white/60">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">
                    Assigned To
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">
                    Request Date
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTickets.map((ticket: ITicket) => {
                  const TypeIcon =
                    ticketTypeIcons[ticket.type] ||
                    ticketTypeIcons[TicketType.OTHER];
                  return (
                    <tr
                      key={ticket.id}
                      className="border-b border-white/20 hover:bg-white/5"
                    >
                      <td className="py-3 px-4">{ticket.documentId}</td>
                      <td className="py-3 px-4">{ticket.title}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon size={16} className="text-white/60" />
                          <span className="text-white/80">{ticket.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.state === "OPEN"
                              ? "bg-blue-500/20 text-blue-400"
                              : ticket.state === "IN_PROGRESS"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : ticket.state === "RESOLVED"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {ticket.state}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-4 py-1 rounded-full text-xs ${
                            ticket.priority === "HIGH"
                              ? "bg-red-500/20 text-red-400"
                              : ticket.priority === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={ticket.assignedTo?.profile.url}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        {ticket.assignedTo
                          ? ticket.assignedTo.username
                          : "Unassigned"}
                      </td>
                      <td className="py-3 px-4">
                        {dayjs(ticket.createdAt).format("DD/MM/YYYY, HH:mm")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            {getActiveFiltersCount() > 0
              ? "No tickets match your filters"
              : "No tickets found"}
          </div>
        )}
      </article>

      {/* Filter Modals */}
      {activeFilter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Filter by{" "}
                {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </h3>
              <button
                onClick={handleCloseFilter}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {activeFilter === "type" && (
              <div className="space-y-3">
                {Object.values(TicketType).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("type", [...filters.type, type]);
                        } else {
                          handleFilterChange(
                            "type",
                            filters.type.filter((t) => t !== type)
                          );
                        }
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <span className="flex items-center gap-2">
                      {React.createElement(ticketTypeIcons[type], { size: 16 })}
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeFilter === "priority" && (
              <div className="space-y-3">
                {Object.values(TicketPriority).map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("priority", [
                            ...filters.priority,
                            priority,
                          ]);
                        } else {
                          handleFilterChange(
                            "priority",
                            filters.priority.filter((p) => p !== priority)
                          );
                        }
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        priority === "HIGH"
                          ? "bg-red-500/20 text-red-400"
                          : priority === "MEDIUM"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeFilter === "status" && (
              <div className="space-y-3">
                {Object.values(TicketState).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("status", [
                            ...filters.status,
                            status,
                          ]);
                        } else {
                          handleFilterChange(
                            "status",
                            filters.status.filter((s) => s !== status)
                          );
                        }
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        status === "OPEN"
                          ? "bg-blue-500/20 text-blue-400"
                          : status === "IN_PROGRESS"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : status === "RESOLVED"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {activeFilter === "source" && (
              <div className="space-y-3">
                {["MANUAL", "AI"].map((source) => (
                  <label
                    key={source}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.source.includes(source)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("source", [
                            ...filters.source,
                            source,
                          ]);
                        } else {
                          handleFilterChange(
                            "source",
                            filters.source.filter((s) => s !== source)
                          );
                        }
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            )}

            {activeFilter === "date" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      filters.dateRange.start
                        ? filters.dateRange.start.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: date,
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={
                      filters.dateRange.end
                        ? filters.dateRange.end.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: date,
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                buttonText="Apply Filters"
                onPress={handleCloseFilter}
                className="flex-1"
              />
              <Button
                buttonText="Clear"
                variant="secondary"
                onPress={() => {
                  if (activeFilter === "date") {
                    handleFilterChange("dateRange", { start: null, end: null });
                  } else {
                    handleFilterChange(
                      activeFilter as keyof typeof filters,
                      []
                    );
                  }
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-black/95 border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
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
        className={`fixed top-0 right-0 h-full w-1/3 bg-black/95 border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
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
                onPress={handleSubmit}
                className="w-full"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
