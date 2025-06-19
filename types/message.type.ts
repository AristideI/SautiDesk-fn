import type { IConversation } from "./conversation.type";
import type { IImage } from "./image.type";
import type { IUser } from "./user.type";

export interface IMessage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  conversation: IConversation;
  sender: IUser;
  content: string;
  ticketId: string;
  image?: IImage;
}
