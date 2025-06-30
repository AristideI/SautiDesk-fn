import strapi from "./strapi";
import type {
  ILogInUser,
  ILoginResponse,
  IRegisterUser,
  IUser,
} from "types/user.type";
import type { IImage } from "types/image.type";
import { authHeaders } from "api";

const defaultWorkerPopulates = {
  "populate[profile]": "*",
  "populate[tickets]": "*",
  "populate[organisation]": "*",
  "populate[agent][populate]": "*",
};

export const UserHandler = {
  async logIn(user: ILogInUser): Promise<ILoginResponse> {
    const { data } = await strapi.post("/auth/local", user);
    return data;
  },

  async register(user: IRegisterUser): Promise<ILoginResponse> {
    const image = user.profile ? await this.uploadImage(user.profile) : null;
    const { data } = await strapi.post("/auth/local/register", {
      ...user,
      profile: image?.id || null,
    });
    return data;
  },

  async uploadImage(img: File): Promise<IImage> {
    const formData = new FormData();
    formData.append("files", img);
    const { data } = await strapi.post<IImage[]>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data[0];
  },
  async getUsers() {
    const { data } = await strapi.get("/users", { headers: authHeaders() });
    return data;
  },

  async getLoginUser(id: number) {
    const { data } = await strapi.get<IUser>(`/users/${id}`, {
      headers: authHeaders(),
      params: defaultWorkerPopulates,
    });
    return data;
  },

  async getUser(id: string) {
    const { data } = await strapi.get<IUser>(`/users/${id}`, {
      headers: authHeaders(),
      params: defaultWorkerPopulates,
    });
    return data;
  },

  async logout() {
    await strapi.post("/logout");
  },
};
