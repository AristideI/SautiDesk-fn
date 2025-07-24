import { X, ChevronDown } from "lucide-react";
import Button from "components/utils/button";
import type { ITicket } from "types/ticket.types";

interface TicketModalsProps {
  showNoteModal: boolean;
  setShowNoteModal: (show: boolean) => void;
  showEditSimilarTicketsModal: boolean;
  setShowEditSimilarTicketsModal: (show: boolean) => void;
  newNote: string;
  setNewNote: (note: string) => void;
  handleAddNote: () => void;
  isSimilarTicketsDropdownOpen: boolean;
  setIsSimilarTicketsDropdownOpen: (open: boolean) => void;
  selectedSimilarTickets: string[];
  tickets: ITicket[];
  handleSimilarTicketToggle: (ticketId: string) => void;
  handleSaveSimilarTickets: () => void;
}

export default function TicketModals({
  showNoteModal,
  setShowNoteModal,
  showEditSimilarTicketsModal,
  setShowEditSimilarTicketsModal,
  newNote,
  setNewNote,
  handleAddNote,
  isSimilarTicketsDropdownOpen,
  setIsSimilarTicketsDropdownOpen,
  selectedSimilarTickets,
  tickets,
  handleSimilarTicketToggle,
  handleSaveSimilarTickets,
}: TicketModalsProps) {
  return (
    <>
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

      {/* Edit Similar Tickets Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-black border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          showEditSimilarTicketsModal ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Similar Tickets</h2>
            <button
              onClick={() => setShowEditSimilarTicketsModal(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Similar Tickets
              </label>
              <div className="relative">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSimilarTicketsDropdownOpen(
                      !isSimilarTicketsDropdownOpen
                    );
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {selectedSimilarTickets.length > 0
                        ? `${selectedSimilarTickets.length} ticket(s) selected`
                        : "Select similar tickets"}
                    </span>
                    <ChevronDown size={16} className="text-white/60" />
                  </div>
                </div>

                {isSimilarTicketsDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/20 rounded-lg z-10 max-h-48 overflow-y-auto">
                    {tickets?.map((ticket) => (
                      <button
                        key={ticket.documentId}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSimilarTicketToggle(ticket.documentId);
                        }}
                        className={`w-full p-2 text-left hover:bg-white/10 flex items-center gap-2 ${
                          selectedSimilarTickets.includes(ticket.documentId)
                            ? "bg-green-500/20 text-green-400"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSimilarTickets.includes(
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

              {/* Selected Similar Tickets Display */}
              {selectedSimilarTickets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSimilarTickets.map((ticketId) => {
                    const ticket = tickets?.find(
                      (t) => t.documentId === ticketId
                    );
                    return ticket ? (
                      <div
                        key={ticketId}
                        className="flex items-center gap-2 bg-green-500/20 text-green-400 rounded px-2 py-1 text-sm"
                      >
                        <span>{ticket.title}</span>
                        <button
                          onClick={() => handleSimilarTicketToggle(ticketId)}
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
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              buttonText="Save Changes"
              onPress={handleSaveSimilarTickets}
              className="flex-1"
            />
            <Button
              buttonText="Cancel"
              onPress={() => setShowEditSimilarTicketsModal(false)}
              variant="secondary"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </>
  );
}
