import { NOTHING } from "../constants.js";
import type { Note, Session } from "../types.js";
import { checkArray, checkBoolean, checkInt, checkNumber, checkString } from "./checkers.js";

export const makeSession = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? checkString(value.user) : undefined;
    const expire = checkInt(("expire" in value ? checkString(value.expire) : undefined) ?? NOTHING);

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};

export const makeNote = (value: any) => {
  let result: Note | undefined;

  if (typeof value === "object" && value !== null) {
    const id = "id" in value ? checkNumber(value.id) : undefined;
    const title = "title" in value ? checkString(value.title) : undefined;
    const text = "text" in value ? checkString(value.text) : undefined;
    const isArchived = "is_archived" in value ? checkBoolean(value.is_archived) : undefined;
    const createdAt = "created_at" in value ? checkInt(checkString(value.created_at) ?? "") : undefined;

    if (
      title !== undefined &&
      text !== undefined &&
      id !== undefined &&
      isArchived !== undefined &&
      createdAt !== undefined
    )
      result = { title, text, id: id ? id.toString() : "", isArchived, createdAt, user: "" };
  }

  return result;
};

export const makeNotes = (value: any) => checkArray(value, makeNote);
