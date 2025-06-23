import { TicketPriority, TicketState } from "types/ticket.types";

export const getPriorityColor = (priority: TicketPriority) => {
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

export const getStateColor = (state: TicketState) => {
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
