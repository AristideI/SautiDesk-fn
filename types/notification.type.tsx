import type { IUser } from "./user.type";

export interface INotification {
  id: number;
  documentId: string;
  type: string;
  from: IUser;
  agent: IUser;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface ICreateNotification {
  type: string;
  content: string;
  from: number;
  agent: number;
}
