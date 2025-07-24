import type { IUser } from "./user.type";
import type { ITicket } from "./ticket.types";
import type { IKnowledgeBase } from "./knowledgeBase.type";

export interface IActivity {
  id: string;
  documentId: string;
  user: IUser;
  ticket?: ITicket;
  knowledgeBase?: IKnowledgeBase;
  type: ActivityType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateActivity {
  content: string;
  user: string;
  ticket?: string;
  knowledgeBase?: string;
  type: ActivityType;
}

export enum ActivityType {
  TICKET = "ticket",
  KNOWLEDGE_BASE = "knowledgeBase",
  FORUM = "forum",
  COMMENT = "comment",
  REPLY = "reply",
  MENTION = "mention",
}
