import { authHeaders } from "api";
import strapi from "./strapi";
import type {
  IComment,
  ICommentCreate,
  ICommentUpdate,
} from "types/comment.type";

export const CommentHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: IComment[] } }>(
      `/comments`,
      {
        headers: authHeaders(),
        params: {
          "populate[author][populate]": "*",
          "populate[ticket][populate]": "*",
          "populate[knowledgeBase][populate]": "*",
          "populate[forum][populate]": "*",
          "populate[attachments][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findByTicketId(ticketId: string) {
    const { data } = await strapi.get<{ data: { data: IComment[] } }>(
      `/comments`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            ticket: {
              $eq: ticketId,
            },
          },
          "populate[author][populate][profile][populate]": "*",
          "populate[attachments][populate]": "*",
          sort: ["createdAt:asc"],
        },
      }
    );
    return data.data;
  },

  async findByKnowledgeBaseId(knowledgeBaseId: string) {
    const { data } = await strapi.get<{ data: { data: IComment[] } }>(
      `/comments`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            knowledgeBase: {
              $eq: knowledgeBaseId,
            },
            status: {
              $eq: "ACTIVE",
            },
          },
          "populate[author][populate]": "*",
          "populate[attachments][populate]": "*",
          sort: ["createdAt:asc"],
        },
      }
    );
    return data.data;
  },

  async findByForumId(forumId: string) {
    const { data } = await strapi.get<{ data: { data: IComment[] } }>(
      `/comments`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            forum: {
              $eq: forumId,
            },
            status: {
              $eq: "ACTIVE",
            },
          },
          "populate[author][populate]": "*",
          "populate[attachments][populate]": "*",
          sort: ["createdAt:asc"],
        },
      }
    );
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: IComment;
    }>(`/comments/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[author][populate]": "*",
        "populate[ticket][populate]": "*",
        "populate[knowledgeBase][populate]": "*",
        "populate[forum][populate]": "*",
        "populate[attachments][populate]": "*",
      },
    });
    return data.data;
  },

  async create(commentData: ICommentCreate) {
    const { data } = await strapi.post<{
      data: IComment;
    }>(`/comments`, commentData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async update(id: string, commentData: ICommentUpdate) {
    const { data } = await strapi.put<{
      data: IComment;
    }>(`/comments/${id}`, commentData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: IComment;
    }>(`/comments/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async markAsResolved(id: string) {
    const { data } = await strapi.put<{
      data: IComment;
    }>(
      `/comments/${id}`,
      { isResolved: true },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async hideComment(id: string) {
    const { data } = await strapi.put<{
      data: IComment;
    }>(
      `/comments/${id}`,
      { status: "HIDDEN" },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },
};
