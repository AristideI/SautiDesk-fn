import { API, authHeaders } from "api";
import strapi from "./strapi";
import type { ITicket, ITicketCreate, ITicketUpdate } from "types/ticket.types";
import type { IUser } from "types/user.type";
import { ActivityType } from "types/activity.type";
import { NotificationType } from "types/notification.type";

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
          "populate[similarTickets][populate]": "*",
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
          "populate[similarTickets][populate]": "*",
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
          "populate[similarTickets][populate]": "*",
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
        "populate[similarTickets][populate]": "*",
      },
    });
    return data.data;
  },

  async create(ticketData: ITicketCreate, organisationId: string, user: IUser) {
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

    // API.activityHandler.create({
    //   content: `
    //   ${user.username} created a ticket with title ${data.data.title} with ID ${data.data.documentId}
    //   `,
    //   user: user.documentId,
    //   ticket: data.data.documentId,
    //   type: ActivityType.TICKET,
    // });

    // ticketData.similarTickets?.forEach(async (ticket) => {
    //   API.activityHandler.create({
    //     content: `
    //     ${user.username} linked this ticket to ${data.data.title} with ID ${data.data.documentId}
    //     `,
    //     user: user.documentId,
    //     ticket: ticket,
    //     type: ActivityType.TICKET,
    //   });
    // });

    // API.activityHandler.create({
    //   content: `
    //   ${user.username} assigned this ticket to ${data.data.assignedTo?.username} with ID ${data.data.assignedTo?.documentId}
    //   `,
    //   user: ticketData.assignedTo || "",
    //   ticket: data.data.documentId,
    //   type: ActivityType.TICKET,
    // });

    // API.notificationHandler.create({
    //   type: NotificationType.TICKET,
    //   content: `
    //   ${user.username} assigned this ticket to ${data.data.assignedTo?.username} with ID ${data.data.assignedTo?.documentId}
    //   `,
    //   ticket: data.data.documentId,
    //   user: data.data.assignedTo?.documentId || "",
    //   from: user.documentId,
    // });

    return data.data;
  },

  async update(id: string, ticketData: ITicketUpdate) {
    const { data } = await strapi.put<{
      data: ITicket;
    }>(
      `/tickets/${id}`,
      { data: ticketData },
      {
        headers: authHeaders(),
      }
    );
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
};
