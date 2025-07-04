import type { IActivity } from "./activity.type";
import type { IComment } from "./comment.type";
import type { IUser } from "./user.type";

export interface IKnowledgeBase {
  id: number;
  documentId: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  author: IUser;
  comments: IComment[];
  state: IState;
  tags: string[];
  activities: IActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateKnowledgeBase {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  author: number;
}

enum IState {
  PUBLIC = "public",
  PRIVATE = "private",
}
