import type { IUser } from "./user.type";
import type { ITicket } from "./ticket.types";
import type { IKnowledgeBase } from "./knowledgeBase.type";
import type { IForum } from "./forum.type";
import type { IImage } from "./image.type";

export interface IComment {
  id: string;
  documentId: string;
  content: string;
  author: IUser;
  ticket?: ITicket;
  knowledgeBase?: IKnowledgeBase;
  forum?: IForum;
  attachments?: IImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ICommentCreate {
  content: string;
  author: number;
  ticket?: string;
  knowledgeBase?: string;
  forum?: string;
  attachments?: number[];
}

export interface ICommentUpdate {
  content?: string;
  isResolved?: boolean;
  attachments?: string[];
}
