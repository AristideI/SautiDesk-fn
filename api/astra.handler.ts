import { DataAPIClient } from "@datastax/astra-db-ts";
import { astraDbUrl, astraToken } from "utils/env";

console.log("ASTRA TOKEN", astraToken);

const astraClient = new DataAPIClient({
  dbOptions: {
    token:
      "AstraCS:nLStbgdEoOJYDibSnfCdJDNa:dc8b351e4af6fe03df050e31a784887d550cab43e5e59cc9ea82c2bbb8d3da8b",
  },
});
const astraDb = astraClient.db(astraDbUrl);
const ticketsCollection = astraDb.collection("tickets");
const agentsCollection = astraDb.collection("agents");

export const astraHandler = {
  async listCollections() {
    const colls = await astraDb.listCollections();
    return colls;
  },
  async listAgents() {
    const agents = await agentsCollection.find({}).toArray();
    return agents;
  },
  async listTickets() {
    const tickets = await ticketsCollection.find({}).toArray();
    return tickets;
  },
};
