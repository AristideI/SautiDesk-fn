import type { IActivity } from "./activity.type";
import type { INote } from "./note.type";
import type { IOrganisation } from "./organisation.type";
import type { IUser } from "./user.type";

export interface ITicket {
  id: string;
  documentId: string;
  title: string;
  description: string;
  state: TicketState;
  priority: TicketPriority;
  similarTickets?: ITicket[];
  activities?: IActivity[];
  type: TicketType;
  assignedTo?: IUser;
  ownedBy: IUser;
  organisation: IOrganisation;
  tags?: string;
  source: TicketSource;
  createdAt: Date;
  updatedAt: Date;
  notes?: INote[];
}

export interface ITicketCreate {
  title: string;
  description: string;
  state: TicketState;
  priority: TicketPriority;
  assignedTo?: string;
  ownedBy: string;
  organisation: string;
  tags?: string;
  source: TicketSource;
  similarTickets?: string[]; // Array of ticket documentIds
}

export interface ITicketUpdate {
  title?: string;
  description?: string;
  state?: TicketState;
  priority?: TicketPriority;
  assignedTo?: string;
  tags?: string;
  similarTickets?: string[]; // Array of ticket documentIds
}

export enum TicketState {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TicketSource {
  MANUAL = "MANUAL",
  AI = "AI",
}

export enum TicketType {
  TICKET = "TICKET",
  INCIDENT = "INCIDENT",
  QUESTION = "QUESTION",
  REQUEST = "REQUEST",
  PROBLEM = "PROBLEM",
  SUGGESTION = "SUGGESTION",
  OTHER = "OTHER",
}
