import type { IOrganisation } from "./organisation.type";
import type { ITicket } from "./ticket.types";

export interface IUser {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  userRole: UserRole;
  profile: string;
  phone?: string;
  organisation?: IOrganisation;
  tickets?: ITicket[];
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
