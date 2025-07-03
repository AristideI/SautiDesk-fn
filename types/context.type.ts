import type { IConversation } from "./conversation.type";
import type { IKnowledgeBase } from "./knowledgeBase.type";
import type { ITicket } from "./ticket.types";
import type { ILogInUser, IRegisterUser, IUser, UserRole } from "./user.type";
import type { INotification, ICreateNotification } from "./notification.type";

export interface AuthContextType {
  user: IUser | null;
  userRole: UserRole | null;
  token: string | null;
  loadUserInfo: () => Promise<void>;
  login: (user: ILogInUser) => Promise<IUser | void>;
  logout: () => void;
  register: (user: IRegisterUser) => Promise<void>;
}

export interface PinsContextType {
  pinnedStore: IPinnedStore;
  pinConversation: (conversation: IConversation) => Promise<void>;
  unpinConversation: (conversation: IConversation) => Promise<void>;
  pinTicket: (ticket: ITicket) => Promise<void>;
  unpinTicket: (ticket: ITicket) => Promise<void>;
  pinKnowledgeBase: (knowledgeBase: IKnowledgeBase) => Promise<void>;
  unpinKnowledgeBase: (knowledgeBase: IKnowledgeBase) => Promise<void>;
}

export interface IPinnedStore {
  tickets: ITicket[] | null;
  conversations: IConversation[] | null;
  knowledgeBases: IKnowledgeBase[] | null;
}

export interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notification: ICreateNotification) => Promise<void>;
}
