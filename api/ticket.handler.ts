import { API, authHeaders } from "api";
import strapi from "./strapi";
import type { ITicket, ITicketCreate, ITicketUpdate } from "types/ticket.types";

export const TicketHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: ITicket[] } }>(
      `/tickets`,
      {
        headers: authHeaders(),
        params: {
          "populate[assignedTo][populate]": "*",
          "populate[ownedBy][populate]": "*",
          "populate[organisation][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findByOrganisationId(organisationId: string) {
    const { data } = await strapi.get<{ data: { data: ITicket[] } }>(
      `/tickets`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            organisation: {
              $eq: organisationId,
            },
          },
          "populate[assignedTo][populate]": "*",
          "populate[ownedBy][populate]": "*",
          "populate[organisation][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findByAssignedTo(userId: string) {
    const { data } = await strapi.get<{ data: { data: ITicket[] } }>(
      `/tickets`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            assignedTo: {
              $eq: userId,
            },
          },
          "populate[assignedTo][populate]": "*",
          "populate[ownedBy][populate]": "*",
          "populate[organisation][populate]": "*",
        },
      }
    );
    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: ITicket;
    }>(`/tickets/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[assignedTo][populate]": "*",
        "populate[ownedBy][populate]": "*",
        "populate[organisation][populate]": "*",
      },
    });
    return data.data;
  },

  async create(ticketData: ITicketCreate, organisationId: string) {
    const { data } = await strapi.post<{
      data: ITicket;
    }>(
      `/tickets`,
      { data: ticketData },
      {
        headers: authHeaders(),
      }
    );
    // await API.smsHandler.sendSMS(
    //   "+250785478021",
    //   `Ticket created: ${
    //     data.data.title
    //   } you can view more with this link: ${`http://localhost:5173/o/organisations/${organisationId}/tickets/${data.data.documentId}`}`
    // );
    // await API.smsHandler.sendMail(
    //   "i.aristide08@gmail.com",
    //   "Ticket created",
    //   `Ticket created: ${
    //     data.data.title
    //   } you can view more with this link: ${`http://localhost:5173/o/organisations/${organisationId}/tickets/${data.data.documentId}`}`
    // );

    return data.data;
  },

  async update(id: string, ticketData: ITicketUpdate) {
    const { data } = await strapi.put<{
      data: ITicket;
    }>(`/tickets/${id}`, ticketData, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async delete(id: string) {
    const { data } = await strapi.delete<{
      data: ITicket;
    }>(`/tickets/${id}`, {
      headers: authHeaders(),
    });
    return data.data;
  },

  async updateState(id: string, state: string) {
    const { data } = await strapi.put<{
      data: ITicket;
    }>(
      `/tickets/${id}`,
      { state },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async assignTicket(id: string, assignedTo: string) {
    const { data } = await strapi.put<{
      data: ITicket;
    }>(
      `/tickets/${id}`,
      { assignedTo },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async updatePriority(id: string, priority: string) {
    const { data } = await strapi.put<{
      data: ITicket;
    }>(
      `/tickets/${id}`,
      { priority },
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },
};
