import { AGE } from "../constants.js";
import type { NoteLite, NotesPayload, Session } from "../types.js";

export const getStringOrUdf = (value: any) => (typeof value === "string" ? value : undefined);
export const getNumberOrUdf = (value: any) => (typeof value === "number" ? value : undefined);
export const getBooleanOrUdf = (value: any) => (typeof value === "boolean" ? value : undefined);

export const getRecordOrUdf = (value: any) =>
  typeof value === "object" && value !== null ? (value as Record<string, any>) : undefined;

export const getArray = <T>(value: unknown, checker: (value: unknown) => T | undefined) => {
  const result: T[] = [];

  if (Array.isArray(value)) {
    value.forEach((item) => {
      const checkedItem = checker(item);
      if (checkedItem !== undefined) result.push(checkedItem);
    });
  }

  return result;
};

export const getPasswordOrUdf = (value: unknown) => {
  let result: string | undefined;

  if (typeof value === "object" && value !== null) {
    const password = "password" in value ? getStringOrUdf(value.password) : undefined;

    if (password !== undefined) result = password;
  }

  return result;
};

export const getSessionOrUdf = (value: unknown) => {
  let result: Session | undefined;

  if (typeof value === "object" && value !== null) {
    const user = "user" in value ? getStringOrUdf(value.user) : undefined;
    const expire = "expire" in value ? getNumberOrUdf(value.expire) : undefined;

    if (user !== undefined && expire !== undefined) result = { user, expire };
  }

  return result;
};

export const getAgeOrUdf = (value: any) => {
  switch (value) {
    case AGE.allTime:
      return AGE.allTime;

    case AGE.archive:
      return AGE.archive;

    case AGE.oneMonth:
      return AGE.oneMonth;

    case AGE.threeMonth:
      return AGE.threeMonth;

    default:
      return undefined;
  }
};

export const getNotesPayloadOrUdf = (value: any) => {
  let result: NotesPayload | undefined;

  if (typeof value === "object" && value !== null) {
    const age = "age" in value ? getAgeOrUdf(value.age) : undefined;
    const search = "search" in value ? getStringOrUdf(value.search) : undefined;
    const page = "page" in value ? getNumberOrUdf(value.page) : undefined;

    result = { age: age ?? AGE.allTime, search: search ?? "", page: page ?? 1 };
  }

  return result;
};

export const getNoteLiteOrUdf = (value: any) => {
  let result: NoteLite | undefined;

  if (typeof value === "object" && value !== null) {
    const title = "title" in value ? getStringOrUdf(value.title) : undefined;
    const text = "text" in value ? getStringOrUdf(value.text) : undefined;
    const isArchive = "isArchive" in value ? getBooleanOrUdf(value.isArchive) : undefined;

    if (title !== undefined && text !== undefined) result = { title, text, isArchive: isArchive ?? false };
  }

  return result;
};

export const getNotesLite = (value: any) => getArray(value, getNoteLiteOrUdf);
