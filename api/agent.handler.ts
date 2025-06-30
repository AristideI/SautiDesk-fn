import { authHeaders } from "api";
import strapi from "./strapi";
import type { IAgent, IAgentCreate, IAgentUpdate } from "types/agent.type";

export const AgentHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: IAgent[] } }>(`/agents`, {
      headers: authHeaders(),
      params: {
        "populate[user][populate][profile][populate]": "*",
        "populate[user][populate][tickets][populate]": "*",
      },
    });
    return data.data;
  },

  async findByOrganisationId(organisationId: string) {
    const { data } = await strapi.get<{ data: { data: IAgent[] } }>(`/agents`, {
      headers: authHeaders(),
      params: {
        filters: {
          "user.organisation": {
            $eq: organisationId,
          },
        },
        "populate[user][populate][profile][populate]": "*",
        "populate[user][populate][tickets][populate]": "*",
      },
    });
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: IAgent;
    }>(`/agents/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[user][populate][profile][populate]": "*",
        "populate[user][populate][tickets][populate]": "*",
      },
    });
    return data.data;
  },

  async findByUserId(userId: string) {
    const { data } = await strapi.get<{
      data: IAgent[];
    }>(`/agents`, {
      headers: authHeaders(),
      params: {
        filters: {
          user: {
            $eq: userId,
          },
        },
        "populate[user][populate][profile][populate]": "*",
        "populate[user][populate][tickets][populate]": "*",
      },
    });
    return data.data[0] || null;
  },

  async create(agentData: IAgentCreate) {
    const { data } = await strapi.post<{
      data: IAgent;
    }>(
      `/agents`,
      { data: agentData },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async update(id: string, agentData: IAgentUpdate) {
    const { data } = await strapi.put<{
      data: IAgent;
    }>(`/agents/${id}`, agentData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: IAgent;
    }>(`/agents/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async toggleActive(id: string, isActive: boolean) {
    const { data } = await strapi.put<{
      data: IAgent;
    }>(
      `/agents/${id}`,
      { isActive },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async updateRating(id: string, rating: number) {
    const { data } = await strapi.put<{
      data: IAgent;
    }>(
      `/agents/${id}`,
      { rating },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },
};
