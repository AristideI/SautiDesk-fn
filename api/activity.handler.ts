import { authHeaders } from "api";
import strapi from "./strapi";
import { type IActivity, type ICreateActivity } from "types/activity.type";

export const ActivityHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: IActivity[] } }>(
      `/activities`,
      {
        headers: authHeaders(),
        params: {
          "populate[user][populate]": "*",
          "populate[ticket][populate]": "*",
          "populate[knowledgeBase][populate]": "*",
          "populate[forum][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findByUserId(userId: string) {
    const { data } = await strapi.get<{ data: { data: IActivity[] } }>(
      `/activities`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            user: {
              $eq: userId,
            },
          },
          "populate[user][populate]": "*",
          "populate[ticket][populate]": "*",
          "populate[knowledgeBase][populate]": "*",
          "populate[forum][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findByTicketId(ticketId: string) {
    const { data } = await strapi.get<{ data: { data: IActivity[] } }>(
      `/activities`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            ticket: {
              $eq: ticketId,
            },
          },
          "populate[user][populate]": "*",
          "populate[ticket][populate]": "*",
          "populate[knowledgeBase][populate]": "*",
          "populate[forum][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: IActivity;
    }>(`/activities/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[user][populate]": "*",
        "populate[ticket][populate]": "*",
        "populate[knowledgeBase][populate]": "*",
        "populate[forum][populate]": "*",
      },
    });
    return data.data;
  },

  async create(activityData: ICreateActivity) {
    const { data } = await strapi.post<{
      data: IActivity;
    }>(
      `/activities`,
      { data: activityData },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async update(id: string, activityData: Partial<ICreateActivity>) {
    const { data } = await strapi.put<{
      data: IActivity;
    }>(
      `/activities/${id}`,
      { data: activityData },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: IActivity;
    }>(`/activities/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },
};
