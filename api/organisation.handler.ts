import { authHeaders } from "api";
import strapi from "./strapi";
import type { IOrganisation } from "types/organisation.type";

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
      },
    });
    return data.data;
  },
};
