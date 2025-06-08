import type { IUser } from "./user.type";

export interface Agent {
  tags: string[];
  description: string;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
