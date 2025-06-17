import React, { useState } from "react";
import Button from "components/utils/button";
import {
  Calendar,
  Funnel,
  OctagonAlert,
  Search,
  Ticket,
  Workflow,
  X,
} from "lucide-react";
import { useOrganisationContext } from "store/organisation.context";
import type { ITicket } from "types/ticket.types";
import { TicketPriority, TicketState } from "types/ticket.types";

export default function OrgTicketsPage() {
  const { tickets, agents } = useOrganisationContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: TicketPriority.MEDIUM,
    state: TicketState.OPEN,
    assignedTo: "",
  });

  function handleOnOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
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

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString();
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
          <Button buttonText="Add Ticket" onPress={handleOnOpenModal} />
        </section>
      </article>
      <article className="flex w-full py-4 border-b border-white/40 px-6 gap-4">
        <label className="w-1/5 relative mr-12">
          <input
            type="text"
            className="border border-white/30 rounded-lg w-full px-4 pl-8 py-1 outline-none"
            placeholder="Search"
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
            onPress={() => {}}
            className="border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4"
          />
          <Button
            buttonText="Source"
            icon={<Workflow size={20} />}
            onPress={() => {}}
            className="border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4"
          />
          <Button
            buttonText="Priority"
            icon={<OctagonAlert size={20} />}
            onPress={() => {}}
            className="border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4"
          />
          <Button
            buttonText="Date Added"
            icon={<Calendar size={20} />}
            onPress={() => {}}
            className="border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4"
          />
          <Button
            buttonText="Ticket Filter"
            icon={<Funnel size={20} />}
            onPress={() => {}}
            className="border-none bg-white/0 hover:bg-white/10 text-white/50 !px-4"
          />
        </>
      </article>
      <article className="flex-1 p-6">
        {tickets && tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="text-left py-3 px-4 text-white/60">
                    Ticket ID
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">Title</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                  <th className="text-left py-3 px-4 text-white/60">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">
                    Assigned To
                  </th>
                  <th className="text-left py-3 px-4 text-white/60">Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket: ITicket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-white/20 hover:bg-white/5"
                  >
                    <td className="py-3 px-4">{ticket.id}</td>
                    <td className="py-3 px-4">{ticket.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
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
                        className={`px-2 py-1 rounded-full text-sm ${
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
                    <td className="py-3 px-4">
                      {ticket.assignedTo
                        ? ticket.assignedTo.username
                        : "Unassigned"}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">No tickets found</div>
        )}
      </article>

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
                    <option key={agent.id} value={agent.id}>
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
