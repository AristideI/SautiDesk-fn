import type { ITicket } from "./ticket.types";
import type { IUser } from "./user.type";

export interface INote {
  id: string;
  documentId: string;
  content: string;
  author: IUser;
  ticket: ITicket;
  type: "INTERNAL" | "PRIVATE" | "SYSTEM";
  linkedTicket: ITicket;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteCreate {
  content: string;
  author: string;
  ticket: string;
  type: "INTERNAL" | "PRIVATE" | "SYSTEM";
}
