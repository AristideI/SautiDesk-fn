import strapi from "./strapi";
import type {
  IKnowledgeBase,
  ICreateKnowledgeBase,
} from "types/knowledgeBase.type";
import { authHeaders } from "api";

const defaultKnowledgeBasePopulates = {
  "populate[author][populate][profile][populate]": "*",
  "populate[comments][populate]": "*",
  "populate[activities][populate]": "*",
};

export const KnowledgeBaseHandler = {
  async findAll(): Promise<IKnowledgeBase[]> {
    const { data } = await strapi.get("/knowledge-bases", {
      headers: authHeaders(),
      params: defaultKnowledgeBasePopulates,
    });
    return data.data;
  },

  // Get a single knowledge base article by ID
  async findOne(id: string): Promise<IKnowledgeBase> {
    const { data } = await strapi.get(`/knowledge-bases/${id}`, {
      headers: authHeaders(),
      params: defaultKnowledgeBasePopulates,
    });
    return data;
  },

  // Create a new knowledge base article
  async create(knowledgeBase: ICreateKnowledgeBase): Promise<IKnowledgeBase> {
    const { data } = await strapi.post("/knowledge-bases", knowledgeBase, {
      headers: authHeaders(),
      params: defaultKnowledgeBasePopulates,
    });
    return data;
  },

  // Update a knowledge base article
  async update(
    id: string,
    knowledgeBase: Partial<ICreateKnowledgeBase>
  ): Promise<IKnowledgeBase> {
    const { data } = await strapi.put(`/knowledge-bases/${id}`, knowledgeBase, {
      headers: authHeaders(),
      params: defaultKnowledgeBasePopulates,
    });
    return data;
  },

  // Delete a knowledge base article
  async delete(id: string): Promise<void> {
    await strapi.delete(`/knowledge-bases/${id}`, {
      headers: authHeaders(),
    });
  },

  // Get knowledge base articles by author
  async findByAuthor(authorId: number): Promise<IKnowledgeBase[]> {
    const { data } = await strapi.get("/knowledge-bases", {
      headers: authHeaders(),
      params: {
        ...defaultKnowledgeBasePopulates,
        "filters[author][id][$eq]": authorId,
      },
    });
    return data;
  },

  // Search knowledge base articles
  async search(query: string): Promise<IKnowledgeBase[]> {
    const { data } = await strapi.get("/knowledge-bases", {
      headers: authHeaders(),
      params: {
        ...defaultKnowledgeBasePopulates,
        "filters[$or][0][title][$containsi]": query,
        "filters[$or][1][content][$containsi]": query,
        "filters[$or][2][tags][$containsi]": query,
      },
    });
    return data;
  },

  // Get knowledge base articles by tags
  async findByTags(tags: string[]): Promise<IKnowledgeBase[]> {
    const { data } = await strapi.get("/knowledge-bases", {
      headers: authHeaders(),
      params: {
        ...defaultKnowledgeBasePopulates,
        "filters[tags][$in]": tags,
      },
    });
    return data;
  },

  // Get public knowledge base articles
  async findPublic(): Promise<IKnowledgeBase[]> {
    const { data } = await strapi.get("/knowledge-bases", {
      headers: authHeaders(),
      params: {
        ...defaultKnowledgeBasePopulates,
        "filters[state][$eq]": "public",
      },
    });
    return data;
  },

  // Add comment to knowledge base article
  async addComment(
    id: string,
    commentData: { content: string; author: number }
  ): Promise<void> {
    await strapi.post(`/knowledge-bases/${id}/comments`, commentData, {
      headers: authHeaders(),
    });
  },

  // Update knowledge base state (public/private)
  async updateState(
    id: string,
    state: "public" | "private"
  ): Promise<IKnowledgeBase> {
    const { data } = await strapi.put(
      `/knowledge-bases/${id}`,
      { state },
      {
        headers: authHeaders(),
        params: defaultKnowledgeBasePopulates,
      }
    );
    return data;
  },
};
