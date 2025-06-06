import type { IOrganisation } from "./organisation.type";
import type { IUser } from "./user.type";

export interface ITicket {
  id: string;
  documentId: string;
  title: string;
  description: string;
  state: TicketState;
  priority: TicketPriority;
  assignedTo?: IUser;
  ownedBy: IUser;
  organisation: IOrganisation;
  tags?: string[];
  source: TicketSource;
  createdAt: Date;
  updatedAt: Date;
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
