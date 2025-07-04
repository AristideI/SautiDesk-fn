import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { PinsContextType, IPinnedStore } from "types/context.type";
import type { IConversation } from "types/conversation.type";
import type { ITicket } from "types/ticket.types";
import type { IKnowledgeBase } from "types/knowledgeBase.type";
import type { IUser } from "types/user.type";

const PinsContext = createContext<PinsContextType | undefined>(undefined);

export function usePinsContext() {
  const context = useContext(PinsContext);
  if (context === undefined) {
    throw new Error("usePinsContext must be used within a PinsContextProvider");
  }
  return context;
}

type ProviderProps = {
  children: ReactNode;
};

export default function PinsContextProvider({ children }: ProviderProps) {
  const [pinnedStore, setPinnedStore] = useState<IPinnedStore>({
    tickets: null,
    conversations: null,
    knowledgeBases: null,
    agents: null,
  });

  // Load pinned items from localStorage on mount
  useEffect(() => {
    const storedPinnedStore = localStorage.getItem("pinnedStore");
    if (storedPinnedStore) {
      try {
        const parsedStore = JSON.parse(storedPinnedStore);
        setPinnedStore(parsedStore);
      } catch (error) {
        console.error("Error parsing pinned store from localStorage:", error);
        // Reset to default if parsing fails
        setPinnedStore({
          tickets: null,
          conversations: null,
          knowledgeBases: null,
          agents: null,
        });
      }
    }
  }, []);

  // Save pinned items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pinnedStore", JSON.stringify(pinnedStore));
  }, [pinnedStore]);

  const pinConversation = async (conversation: IConversation) => {
    const newPinnedStore = {
      ...pinnedStore,
      conversations: [...(pinnedStore.conversations || []), conversation],
    };
    setPinnedStore(newPinnedStore);
  };

  const unpinConversation = async (conversation: IConversation) => {
    const newPinnedStore = {
      ...pinnedStore,
      conversations:
        pinnedStore.conversations?.filter((c) => c.id !== conversation.id) ||
        null,
    };
    setPinnedStore(newPinnedStore);
  };

  const pinTicket = async (ticket: ITicket) => {
    const newPinnedStore = {
      ...pinnedStore,
      tickets: [...(pinnedStore.tickets || []), ticket],
    };
    setPinnedStore(newPinnedStore);
  };

  const unpinTicket = async (ticket: ITicket) => {
    const newPinnedStore = {
      ...pinnedStore,
      tickets: pinnedStore.tickets?.filter((t) => t.id !== ticket.id) || null,
    };
    setPinnedStore(newPinnedStore);
  };

  const pinKnowledgeBase = async (knowledgeBase: IKnowledgeBase) => {
    const newPinnedStore = {
      ...pinnedStore,
      knowledgeBases: [...(pinnedStore.knowledgeBases || []), knowledgeBase],
    };
    setPinnedStore(newPinnedStore);
  };

  const unpinKnowledgeBase = async (knowledgeBase: IKnowledgeBase) => {
    const newPinnedStore = {
      ...pinnedStore,
      knowledgeBases:
        pinnedStore.knowledgeBases?.filter(
          (kb) => kb.id !== knowledgeBase.id
        ) || null,
    };
    setPinnedStore(newPinnedStore);
  };

  const pinAgent = async (agent: IUser) => {
    const newPinnedStore = {
      ...pinnedStore,
      agents: [...(pinnedStore.agents || []), agent],
    };
    setPinnedStore(newPinnedStore);
  };

  const unpinAgent = async (agent: IUser) => {
    const newPinnedStore = {
      ...pinnedStore,
      agents: pinnedStore.agents?.filter((a) => a.documentId !== agent.documentId) || null,
    };
    setPinnedStore(newPinnedStore);
  };

  const values = useMemo(() => {
    return {
      pinnedStore,
      pinConversation,
      unpinConversation,
      pinTicket,
      unpinTicket,
      pinKnowledgeBase,
      unpinKnowledgeBase,
      pinAgent,
      unpinAgent,
    };
  }, [pinnedStore]);

  return <PinsContext.Provider value={values}>{children}</PinsContext.Provider>;
}
