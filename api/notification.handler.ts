import strapi from "./strapi";
import type {
  INotification,
  ICreateNotification,
} from "types/notification.type";
import { authHeaders } from "api";

const defaultNotificationPopulates = {
  "populate[from][populate]": "*",
  "populate[agent][populate]": "*",
};

export const NotificationHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: INotification[] }>(
      `/notifications`,
      {
        headers: authHeaders(),
        params: {
          sort: ["createdAt:desc"],
          ...defaultNotificationPopulates,
        },
      }
    );
    return data.data;
  },

  async findByUser(userId: string) {
    const { data } = await strapi.get<{ data: { data: INotification[] } }>(
      `/notifications`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            $or: [
              {
                from: {
                  $eq: userId,
                },
              },
              {
                agent: {
                  $eq: userId,
                },
              },
            ],
          },
          sort: ["createdAt:desc"],
          ...defaultNotificationPopulates,
        },
      }
    );
    return data.data;
  },

  async findUnread(userId: string) {
    const { data } = await strapi.get<{ data: { data: INotification[] } }>(
      `/notifications`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            $and: [
              {
                $or: [
                  {
                    from: {
                      $eq: userId,
                    },
                  },
                  {
                    agent: {
                      $eq: userId,
                    },
                  },
                ],
              },
              {
                isRead: {
                  $eq: false,
                },
              },
            ],
          },
          sort: ["createdAt:desc"],
          ...defaultNotificationPopulates,
        },
      }
    );
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: INotification;
    }>(`/notifications/${id}`, {
      headers: authHeaders(),
      params: defaultNotificationPopulates,
    });
    return data.data;
  },

  async create(notificationData: ICreateNotification) {
    const { data } = await strapi.post<{
      data: INotification;
    }>(
      `/notifications`,
      { data: notificationData },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async update(id: string, notificationData: Partial<INotification>) {
    const { data } = await strapi.put<{
      data: INotification;
    }>(`/notifications/${id}`, notificationData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: INotification;
    }>(`/notifications/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async markAsRead(id: string) {
    const { data } = await strapi.put<{
      data: INotification;
    }>(
      `/notifications/${id}`,
      { isRead: true },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async markAllAsRead(userId: string) {
    const { data } = await strapi.put<{
      data: INotification[];
    }>(
      `/notifications`,
      {
        filters: {
          $and: [
            {
              $or: [
                {
                  from: {
                    $eq: userId,
                  },
                },
                {
                  agent: {
                    $eq: userId,
                  },
                },
              ],
            },
            {
              isRead: {
                $eq: false,
              },
            },
          ],
        },
        data: { isRead: true },
      },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async clearAll(userId: string) {
    const { data } = await strapi.delete<{
      data: INotification[];
    }>(`/notifications`, {
      headers: authHeaders(),
      params: {
        filters: {
          $or: [
            {
              from: {
                $eq: userId,
              },
            },
            {
              agent: {
                $eq: userId,
              },
            },
          ],
        },
      },
    });
    return data.data;
  },
};
