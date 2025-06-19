import type { IUser } from "./user.type";

export interface IKnowledgeBase {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  author_id: IUser;
  conversation: string; // assuming this is a string (e.g. a reference or ID)
}



// we can have somethign like votes on comments so that users can upvote or downvote comments