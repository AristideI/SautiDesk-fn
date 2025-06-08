import getAuthToken from "utils/getAuthToken";
import strapi from "./strapi";
import { UserHandler } from "./user.handler";

export const authHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export const API = {
  userHandler: UserHandler,
};
