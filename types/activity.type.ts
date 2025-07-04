import type { IUser } from "./user.type";
import type { ITicket } from "./ticket.types";
import type { IKnowledgeBase } from "./knowledgeBase.type";
import type { IForum } from "./forum.type";

export interface IActivity {
  id: number;
  documentId: string;
  user: IUser;
  ticket?: ITicket;
  knowledgeBase?: IKnowledgeBase;
  forum?: IForum;
  type: ActivityType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateActivity {
  user: number;
  ticket?: number;
  knowledgeBase?: number;
  forum?: number;
  type: ActivityType;
  content: string;
}

export enum ActivityType {
  TICKET = "ticket",
  KNOWLEDGE_BASE = "knowledgeBase",
  FORUM = "forum",
  COMMENT = "comment",
  REPLY = "reply",
  MENTION = "mention",
}
