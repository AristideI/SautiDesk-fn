import type { IMessage } from "./message.type";
import type { IUser } from "./user.type";

export interface IConversation {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  participants: IUser[];
  messages: IMessage[];
}
