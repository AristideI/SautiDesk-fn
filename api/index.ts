import getAuthToken from "utils/getAuthToken";
import { UserHandler } from "./user.handler";
import { OrganisationHandler } from "./organisation.handler";

export const authHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export const API = {
  userHandler: UserHandler,
  organisationHandler: OrganisationHandler,
};
