import type { IConversation } from "./conversation.type";
import type { IUser } from "./user.type";

export interface IForum {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  author: IUser;
  conversation: IConversation;
}
