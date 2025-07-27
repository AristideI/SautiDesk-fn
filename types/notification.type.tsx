import type { IKnowledgeBase } from "./knowledgeBase.type";
import type { ITicket } from "./ticket.types";
import type { IUser } from "./user.type";

export interface INotification {
  id: number;
  documentId: string;
  type: NotificationType;
  ticket: ITicket;
  knowledgeBase: IKnowledgeBase;
  from: IUser;
  agent: IUser;
  content: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface ICreateNotification {
  type: NotificationType;
  content: string;
  from: string;
  ticket: string;
  user: string;
}

export enum NotificationType {
  TICKET = "ticket",
  KNOWLEDGE_BASE = "knowledgeBase",
  FORUM = "forum",
  COMMENT = "comment",
  REPLY = "reply",
  MENTION = "mention",
}
