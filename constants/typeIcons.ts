import {
  Bug,
  FileSearch2,
  GitPullRequestArrow,
  Lightbulb,
  MessageCircleQuestion,
  Ticket,
} from "lucide-react";
import { TicketType } from "types/ticket.types";

export const ticketTypeIcons = {
  [TicketType.TICKET]: Ticket,
  [TicketType.QUESTION]: MessageCircleQuestion,
  [TicketType.INCIDENT]: FileSearch2,
  [TicketType.REQUEST]: GitPullRequestArrow,
  [TicketType.PROBLEM]: Bug,
  [TicketType.SUGGESTION]: Lightbulb,
  [TicketType.OTHER]: FileSearch2,
};
