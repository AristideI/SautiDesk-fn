import type { IActivity } from "./activity.type";
import type { IAgent } from "./agent.type";
import type { IImage } from "./image.type";
import type { INote } from "./note.type";
import type { IOrganisation } from "./organisation.type";
import type { ITicket } from "./ticket.types";

export interface IUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  userRole: UserRole;
  agent?: IAgent;
  profile: IImage;
  phone?: string;
  organisation?: IOrganisation;
  tickets?: ITicket[];
  activities?: IActivity[];
  notes?: INote[];
  createdAt: string;
}

export interface ILogInUser {
  identifier: string;
  password: string;
}

export interface IRegisterUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  userRole?: string;
  profile?: File;
  organisation?: string;
}
export interface ISeedRegisterUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  userRole?: string;
  profile?: string;
  organisation?: string;
}

export interface ILoginResponse {
  jwt: string;
  user: IUser;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  CLIENT = "CLIENT",
}
