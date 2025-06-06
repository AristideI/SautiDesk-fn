import type { ITicket } from "./ticket.types";
import type { IUser } from "./user.type";

export interface IOrganisation {
  id: string;
  documentId: string;
  name: string;
  description?: string;
  agents?: IUser[];
  tickets?: ITicket[];
  industry: string;
  updatedAt: Date;
  createdAt: Date;
}
