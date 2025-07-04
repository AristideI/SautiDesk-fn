import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  IKnowledgeBase,
  ICreateKnowledgeBase,
} from "types/knowledgeBase.type";
import { API } from "api";
import { useAuthContext } from "./auth.context";
import type { KnowledgeBaseContextType } from "types/context.type";

const KnowledgeBaseContext = createContext<
  KnowledgeBaseContextType | undefined
>(undefined);

export function useKnowledgeBaseContext() {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error(
      "useKnowledgeBaseContext must be used within a KnowledgeBaseContextProvider"
    );
  }
  return context;
}

type ProviderProps = {
  children: ReactNode;
};

export default function KnowledgeBaseContextProvider({
  children,
}: ProviderProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<IKnowledgeBase[]>([]);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    useState<IKnowledgeBase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  // Load knowledge bases when user is available
  useEffect(() => {
    if (user?.id) {
      fetchKnowledgeBases();
    }
  }, [user?.id]);

  const fetchKnowledgeBases = async () => {
    if (!user?.id) {
      console.log("User ID not available, skipping knowledge base fetch");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await API.knowledgeBaseHandler.findAll();
      setKnowledgeBases(data);
    } catch (error) {
      console.error("Error fetching knowledge bases:", error);
      setError("Failed to fetch knowledge bases");
    } finally {
      setLoading(false);
    }
  };

  const fetchKnowledgeBase = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await API.knowledgeBaseHandler.findOne(id);
      setSelectedKnowledgeBase(data);
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      setError("Failed to fetch knowledge base");
    } finally {
      setLoading(false);
    }
  };

  const createKnowledgeBase = async (data: ICreateKnowledgeBase) => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newKnowledgeBase = await API.knowledgeBaseHandler.create({
        ...data,
        author: user.id,
      });
      setKnowledgeBases((prev) => [newKnowledgeBase, ...prev]);
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      setError("Failed to create knowledge base");
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (
    id: string,
    data: Partial<ICreateKnowledgeBase>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedKnowledgeBase = await API.knowledgeBaseHandler.update(
        id,
        data
      );
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.documentId === id ? updatedKnowledgeBase : kb))
      );
      if (selectedKnowledgeBase?.documentId === id) {
        setSelectedKnowledgeBase(updatedKnowledgeBase);
      }
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      setError("Failed to update knowledge base");
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await API.knowledgeBaseHandler.delete(id);
      setKnowledgeBases((prev) => prev.filter((kb) => kb.documentId !== id));
      if (selectedKnowledgeBase?.documentId === id) {
        setSelectedKnowledgeBase(null);
      }
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      setError("Failed to delete knowledge base");
    } finally {
      setLoading(false);
    }
  };

  const searchKnowledgeBases = async (
    query: string
  ): Promise<IKnowledgeBase[]> => {
    try {
      return await API.knowledgeBaseHandler.search(query);
    } catch (error) {
      console.error("Error searching knowledge bases:", error);
      setError("Failed to search knowledge bases");
      return [];
    }
  };

  const findByTags = async (tags: string[]): Promise<IKnowledgeBase[]> => {
    try {
      return await API.knowledgeBaseHandler.findByTags(tags);
    } catch (error) {
      console.error("Error finding knowledge bases by tags:", error);
      setError("Failed to find knowledge bases by tags");
      return [];
    }
  };

  const findPublic = async (): Promise<IKnowledgeBase[]> => {
    try {
      return await API.knowledgeBaseHandler.findPublic();
    } catch (error) {
      console.error("Error finding public knowledge bases:", error);
      setError("Failed to find public knowledge bases");
      return [];
    }
  };

  const addComment = async (id: string, content: string) => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      await API.knowledgeBaseHandler.addComment(id, {
        content,
        author: user.id,
      });
      // Refresh the selected knowledge base to get updated comments
      if (selectedKnowledgeBase?.documentId === id) {
        await fetchKnowledgeBase(id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment");
    }
  };

  const updateState = async (id: string, state: "public" | "private") => {
    try {
      const updatedKnowledgeBase = await API.knowledgeBaseHandler.updateState(
        id,
        state
      );
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.documentId === id ? updatedKnowledgeBase : kb))
      );
      if (selectedKnowledgeBase?.documentId === id) {
        setSelectedKnowledgeBase(updatedKnowledgeBase);
      }
    } catch (error) {
      console.error("Error updating knowledge base state:", error);
      setError("Failed to update knowledge base state");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const values = useMemo(() => {
    return {
      knowledgeBases,
      selectedKnowledgeBase,
      loading,
      error,
      setSelectedKnowledgeBase,
      fetchKnowledgeBases,
      fetchKnowledgeBase,
      createKnowledgeBase,
      updateKnowledgeBase,
      deleteKnowledgeBase,
      searchKnowledgeBases,
      findByTags,
      findPublic,
      addComment,
      updateState,
      clearError,
    };
  }, [knowledgeBases, selectedKnowledgeBase, loading, error]);

  return (
    <KnowledgeBaseContext.Provider value={values}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}
