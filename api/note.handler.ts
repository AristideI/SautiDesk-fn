import { authHeaders } from "api";
import strapi from "./strapi";
import type { INote, INoteCreate } from "types/note.type";

export const NoteHandler = {
  createNote: async (data: INoteCreate) => {
    const note = await strapi.post<{ data: INote }>(
      "/notes",
      {
        data: {
          content: data.content,
          author: data.author,
          ticket: data.ticket,
          type: data.type,
        },
      },
      {
        headers: authHeaders(),
      }
    );

    return note.data;
  },
};
