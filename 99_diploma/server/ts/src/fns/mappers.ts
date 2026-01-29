import type { Note, NoteDb, Session, SessionDb } from "../types.js";
import { checkInt } from "./checkers.js";

export const mapSession = (data?: SessionDb) => {
  let result: Session | undefined;

  if (data) {
    const expire = checkInt(data.expire);
    if (expire !== undefined) result = { user: data.user, expire };
  }

  return result;
};

export const mapNote = (data?: NoteDb) => {
  let result: Note | undefined;

  if (data) {
    const createdAt = checkInt(data.created_at);
    if (createdAt !== undefined) {
      result = {
        id: data.id.toString(),
        user: data.user,
        title: data.title,
        text: data.text,
        isArchived: data.is_archived,
        createdAt,
      };
    }
  }

  return result;
};
