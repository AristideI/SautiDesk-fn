import type { IConversation } from "./conversation.type";
import type { IImage } from "./image.type";
import type { ITicket } from "./ticket.types";
import type { IUser } from "./user.type";

export interface IMessage {
  id: number;
  documentId: string;
  conversation: IConversation;
  sender: IUser;
  content: string;
  image?: IImage;
  tickets: ITicket[];
  createdAt: string;
  updatedAt: string;
}
