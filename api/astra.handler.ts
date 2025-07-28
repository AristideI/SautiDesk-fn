import type { IAstraTicket } from "types/astra.type";
import strapi from "./strapi";

export const astraHandler = {
  async listCollections() {
    const colls = await strapi.get("/astra");
    return colls;
  },

  async createTicket(ticket: IAstraTicket) {
    const createdTicket = await strapi.post("/astra/ticket", {
      data: ticket,
    });
    return createdTicket;
  },

  async getAgent() {
    const agent = await strapi.get(`/astra`);
    console.log(agent);
    return agent;
  },
};
