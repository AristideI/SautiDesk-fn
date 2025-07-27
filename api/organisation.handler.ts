import { authHeaders } from "api";
import strapi from "./strapi";
import type {
  IOrganisation,
  IOrganisationCreate,
} from "types/organisation.type";

export const OrganisationHandler = {
  async findAll() {
    const { data } = await strapi.get<{ data: { data: IOrganisation[] } }>(
      `/organisations`,
      {
        headers: authHeaders(),
      }
    );
    return data.data;
  },

  async findByPersonId(personId: string) {
    const { data } = await strapi.get<{ data: IOrganisation[] }>(
      `/organisations`,
      {
        headers: authHeaders(),
        params: {
          filters: {
            ownerId: {
              $eq: personId,
            },
          },
          "populate[agents][populate]": "*",
        },
      }
    );

    return data.data;
  },

  async findById(id: string) {
    const { data } = await strapi.get<{
      data: IOrganisation;
    }>(`/organisations/${id}`, {
      headers: authHeaders(),
      params: {
        "populate[agents][populate][profile][populate]": "*",
        "populate[tickets][populate][assignedTo][populate][profile][populate]":
          "*",
        "populate[tickets][populate][assignedTo][populate][agent][populate]":
          "*",
        "populate[tickets][populate][ownedBy][populate]": "*",
        "populate[agents][populate][agent][populate]": "*",
        "populate[tickets][populate][similarTickets][populate]": "*",
        "populate[tickets][populate][activities][populate]": "*",
        "populate[tickets][populate][notes][populate]": "*",
        "populate[agents][populate][activities][populate]": "*",
        "populate[agents][populate][notes][populate]": "*",
      },
    });
    return data.data;
  },

  async create(organisation: IOrganisationCreate) {
    const { data } = await strapi.post<{ data: IOrganisation }>(
      `/organisations`,
      { data: organisation },
      { headers: authHeaders() }
    );
    return data.data;
  },
};
