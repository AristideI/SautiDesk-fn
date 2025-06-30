import type { IUser } from "./user.type";

export interface IAgent {
  id: string;
  documentId: string;
  title: string;
  areaOfExpertise: string;
  about?: string;
  interests?: string[];
  qualification?: string;
  education?: string;
  user: IUser;
  isActive: boolean;
  specializations?: string[];
  experience?: number;
  rating?: number;
  languages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgentCreate {
  title: string;
  areaOfExpertise: string;
  about?: string;
  interests?: string[];
  qualification?: string;
  education?: string;
  user: string;
  isActive?: boolean;
  specializations?: string[];
  experience?: number;
  rating?: number;
  languages?: string[];
}

export interface IAgentUpdate {
  title?: string;
  areaOfExpertise?: string;
  about?: string;
  interests?: string[];
  qualification?: string;
  education?: string;
  isActive?: boolean;
  specializations?: string[];
  experience?: number;
  rating?: number;
  languages?: string[];
}

export interface IAgentStats {
  totalTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  responseTime: number;
}
