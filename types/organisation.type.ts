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

export interface IOrganisationCreate {
  name: string;
  description?: string;
  industry: string;
  ownerId: string;
}
