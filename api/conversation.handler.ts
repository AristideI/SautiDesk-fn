import { authHeaders } from "api";
import strapi from "./strapi";
import type { IConversation } from "types/conversation.type";
import type { IMessage } from "types/message.type";
import type { IUser } from "types/user.type";

export const ConversationHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: IConversation[] } }>(
      `/conversations`,
      {
        headers: authHeaders(),
        params: {
          "populate[participants][populate][profile][populate]": "*",
          "populate[messages][populate][sender][populate][profile][populate]":
            "*",
          "populate[messages][populate][image][populate]": "*",
          "populate[messages][populate][tickets][populate]": "*",
          sort: ["updatedAt:desc"],
        },
      }
    );
    return data.data;
  },

  async findByUserId() {
    const { data } = await strapi.get<{ data: IConversation[] }>(
      `/conversations`,
      {
        headers: authHeaders(),
        params: {
          "populate[participants][populate][profile][populate]": "*",
          "populate[messages][populate][sender][populate][profile][populate]":
            "*",
          "populate[messages][populate][image][populate]": "*",
          "populate[messages][populate][tickets][populate]": "*",
          sort: ["updatedAt:desc"],
        },
      }
    );
    console.log(data.data);
    return data.data;
  },

  async findByOrganisationId(organisationId: string) {
    const { data } = await strapi.get<{ data: { data: IConversation[] } }>(
      `/conversations`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            "participants.organisation": {
              $eq: organisationId,
            },
          },
          "populate[participants][populate][profile][populate]": "*",
          "populate[messages][populate][sender][populate][profile][populate]":
            "*",
          "populate[messages][populate][image][populate]": "*",
          "populate[messages][populate][tickets][populate]": "*",
          sort: ["updatedAt:desc"],
        },
      }
    );
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: IConversation;
    }>(`/conversations/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[participants][populate][profile][populate]": "*",
        "populate[messages][populate][sender][populate][profile][populate]":
          "*",
        "populate[messages][populate][image][populate]": "*",
        "populate[messages][populate][tickets][populate]": "*",
        sort: ["messages.createdAt:asc"],
      },
    });
    return data.data;
  },

  async create(participantIds: string[]) {
    const { data } = await strapi.post<{
      data: IConversation;
    }>(
      `/conversations`,
      {
        data: {
          participants: participantIds,
        },
      },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async update(id: string, conversationData: Partial<IConversation>) {
    const { data } = await strapi.put<{
      data: IConversation;
    }>(`/conversations/${id}`, conversationData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: IConversation;
    }>(`/conversations/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async addParticipant(conversationId: string, participantId: string) {
    const conversation = await this.findById(conversationId);
    const currentParticipants = conversation.participants.map(
      (p) => p.documentId
    );

    if (!currentParticipants.includes(participantId)) {
      const updatedParticipants = [...currentParticipants, participantId];
      return await this.update(conversationId, {
        participants: updatedParticipants as unknown as IUser[],
      });
    }

    return conversation;
  },

  async removeParticipant(conversationId: string, participantId: string) {
    const conversation = await this.findById(conversationId);
    const currentParticipants = conversation.participants.map(
      (p) => p.documentId
    );
    const updatedParticipants = currentParticipants.filter(
      (id) => id !== participantId
    );

    return await this.update(conversationId, {
      participants: updatedParticipants as unknown as IUser[],
    });
  },

  async getMessages(conversationId: string) {
    const conversation = await this.findById(conversationId);
    return conversation.messages || [];
  },

  async sendMessage(
    conversationId: string,
    messageData: {
      content: string;
      senderId: string;
      imageId?: string;
      ticketIds?: string[];
    }
  ) {
    const { data } = await strapi.post<{
      data: IMessage;
    }>(
      `/messages`,
      {
        data: {
          conversation: conversationId,
          sender: messageData.senderId,
          content: messageData.content,
          image: messageData.imageId || null,
          tickets: messageData.ticketIds || [],
        },
      },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },
};
