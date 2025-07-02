import type { ITicket } from "types/ticket.types";

export const getTicketCount = (tickets: ITicket[] | null, agentId: string) => {
  if (!tickets) return 0;
  return tickets.filter((ticket) => ticket.assignedTo?.documentId === agentId)
    .length;
};
