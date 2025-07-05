import type { IAstraTicket } from "types/astra.type";
import strapi from "./strapi";

export const astraHandler = {
  async listCollections() {
    const colls = await strapi.get("/astra");
    return colls;
  },

  async createTicket(ticket: IAstraTicket) {
    // const testTicket: IAstraTicket = {
    //   ticketId: "94",
    //   title: "Internet Outage in Ramera Neighborhood",
    //   description:
    //     "Client John Paul from Ramera near the Amahoro Stadium reported no internet since 8 a.m. Several people in the area are affected. Issue started around 8 a.m. despite router restart. Agent Sandrine advised of a network disruption due to fiber line maintenance. Estimated resolution by 6 p.m. Ticket reference number: #CBX test 243 891",
    //   type: "TICKET",
    //   assignedTo: "2",
    //   tags: ["test", "ticket"],
    // };

    const createdTicket = await strapi.post("/astra/ticket", {
      data: ticket,
    });
    return createdTicket;
  },
};
