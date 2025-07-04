import type { IConversation } from "./conversation.type";
import type {
  ICreateKnowledgeBase,
  IKnowledgeBase,
} from "./knowledgeBase.type";
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
  pinAgent: (agent: IUser) => Promise<void>;
  unpinAgent: (agent: IUser) => Promise<void>;
}

export interface IPinnedStore {
  tickets: ITicket[] | null;
  conversations: IConversation[] | null;
  knowledgeBases: IKnowledgeBase[] | null;
  agents: IUser[] | null;
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

export interface KnowledgeBaseContextType {
  knowledgeBases: IKnowledgeBase[];
  selectedKnowledgeBase: IKnowledgeBase | null;
  loading: boolean;
  error: string | null;
  setSelectedKnowledgeBase: (knowledgeBase: IKnowledgeBase | null) => void;
  fetchKnowledgeBases: () => Promise<void>;
  fetchKnowledgeBase: (id: string) => Promise<void>;
  createKnowledgeBase: (data: ICreateKnowledgeBase) => Promise<void>;
  updateKnowledgeBase: (
    id: string,
    data: Partial<ICreateKnowledgeBase>
  ) => Promise<void>;
  deleteKnowledgeBase: (id: string) => Promise<void>;
  searchKnowledgeBases: (query: string) => Promise<IKnowledgeBase[]>;
  findByTags: (tags: string[]) => Promise<IKnowledgeBase[]>;
  findPublic: () => Promise<IKnowledgeBase[]>;
  addComment: (id: string, content: string) => Promise<void>;
  updateState: (id: string, state: "public" | "private") => Promise<void>;
  clearError: () => void;
}
